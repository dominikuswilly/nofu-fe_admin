import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { RestockRequest, DashboardOverview, Product, RestockResponse } from '../../core/types';
import { API_CONFIG } from '../../core/api/config';

export const useStockStore = defineStore('stocks', () => {
  const requests = ref<RestockRequest[]>([]);

  const products = ref<Product[]>([]);

  const overview = ref<DashboardOverview>({
    totalMerchants: 0,
    active: 0,
    lowStock: 0,
    todaySales: 0,
    restockRequests: [],
  });

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.productApi}/products`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.responseCode === "200" && Array.isArray(result.data)) {
          products.value = result.data;
        }
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchRestockRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.transactionApi}/admin/restock`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.responseCode === "200" && Array.isArray(result.data)) {
          requests.value = result.data;
          overview.value.restockRequests = requests.value.filter(r => r.status === 'PENDING');
        }
      }
    } catch (error) {
      console.error('Failed to fetch restock requests:', error);
    }
  };

  const approveRequest = (id: string) => {
    const req = requests.value.find(r => r.id === id);
    if (req) {
      req.status = 'approved';
      overview.value.restockRequests = requests.value.filter(r => r.status === 'PENDING');
    }
  };

  const rejectRequest = (id: string) => {
    const req = requests.value.find(r => r.id === id);
    if (req) {
      req.status = 'rejected';
      overview.value.restockRequests = requests.value.filter(r => r.status === 'PENDING');
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.productApi}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });

      const result = await response.json();

      if (response.ok && result.responseCode === "201") {
        if (result.data) {
          products.value.unshift(result.data); // Add to top of list
        } else {
          await fetchProducts();
        }
      } else {
        throw new Error(result.responseMessage || 'Gagal menambahkan produk');
      }
    } catch (error: any) {
      console.error('Failed to add product:', error);
      throw error;
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.productApi}/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProduct)
      });

      const result = await response.json();

      if (response.ok && result.responseCode === "200") {
        await fetchProducts();
      } else {
        throw new Error(result.responseMessage || 'Gagal memperbarui produk');
      }
    } catch (error: any) {
      console.error('Failed to update product:', error);
      throw error;
    }
  };

  const createStockInitiation = async (payload: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.transactionApi}/stock/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || (result.responseCode !== "201" && result.responseCode !== "200")) {
        throw new Error(result.responseMessage || 'Gagal membuat inisiasi stok');
      }

      return result;
    } catch (error: any) {
      console.error('Failed to create stock initiation:', error);
      throw error;
    }
  };

  const fetchStockHistory = async (stockMasterId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.transactionApi}/stock/${stockMasterId}/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.responseCode === "200" && Array.isArray(result.data)) {
          return result.data;
        }
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch stock history:', error);
      return [];
    }
  };

  const fetchRestockDetail = async (id: string): Promise<RestockResponse | null> => {
    // Mocking for now as requested
    console.log('Fetching restock detail for ID:', id);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockData: RestockResponse = {
      id: id,
      totalQty: 10,
      totalItem: 2,
      location: {
        longitude: 106.8736979,
        lattitude: -6.1658450
      },
      restockDetail: [
        {
          id: "1",
          productName: "Air Mineral 600ml",
          productId: "prod-001",
          productImageUrl: "https://placehold.co/100",
          qty: 6
        },
        {
          id: "2",
          productName: "Kripik Singkong 100g",
          productId: "prod-002",
          productImageUrl: "https://placehold.co/100",
          qty: 4
        }
      ]
    };

    return mockData;
  };

  return {
    requests,
    products,
    overview,
    fetchProducts,
    fetchRestockRequests,
    approveRequest,
    rejectRequest,
    addProduct,
    updateProduct,
    createStockInitiation,
    fetchStockHistory,
    fetchRestockDetail
  };
});

