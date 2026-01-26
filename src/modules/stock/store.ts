import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { RestockRequest, DashboardOverview, Product, RestockResponse } from '../../core/types';
import { API_CONFIG } from '../../core/api/config';

export const useStockStore = defineStore('stocks', () => {
  const requests = ref<RestockRequest[]>([]);
  const restockHistory = ref<RestockRequest[]>([]);

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

  const processRestockRequest = async (id: string, action: 'approve' | 'reject') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.transactionApi}/admin/restock/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.responseCode === "200") {
          // Update local state instead of full refetch for better UX
          const req = requests.value.find(r => r.id === id);
          if (req) {
            req.status = action === 'approve' ? 'approved' : 'rejected';
            overview.value.restockRequests = requests.value.filter(r => r.status === 'PENDING');
          }
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error(`Failed to ${action} request:`, error);
      return false;
    }
  };

  const approveRequest = async (id: string) => {
    return await processRestockRequest(id, 'approve');
  };

  const rejectRequest = async (id: string) => {
    return await processRestockRequest(id, 'reject');
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

  const fetchAdminRestockHistory = async (date: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.transactionApi}/admin/restock/history?date=${date}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.responseCode === "200" && Array.isArray(result.data)) {
          restockHistory.value = result.data;
        }
      }
    } catch (error) {
      console.error('Failed to fetch restock history:', error);
      restockHistory.value = [];
    }
  };

  const fetchRestockDetail = async (id: string): Promise<RestockResponse | null> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.transactionApi}/restock/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.responseCode === "200" && result.data) {
          return result.data;
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch restock detail:', error);
      return null;
    }
  };

  return {
    requests,
    restockHistory,
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
    fetchRestockDetail,
    fetchAdminRestockHistory
  };
});

