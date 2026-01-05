import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { RestockRequest, DashboardOverview, Product } from '../../core/types';
import { API_CONFIG } from '../../core/api/config';

export const useStockStore = defineStore('stocks', () => {
  const requests = ref<RestockRequest[]>([
    { id: 1, merchantId: 1, merchantName: 'Toko Ahmad', qty: 50, status: 'pending', timestamp: '2026-01-04T08:30:00Z' },
    { id: 2, merchantId: 3, merchantName: 'Cahaya Rejeki', qty: 100, status: 'pending', timestamp: '2026-01-04T09:15:00Z' },
    { id: 3, merchantId: 7, merchantName: 'Gani Kelontong', qty: 30, status: 'approved', timestamp: '2026-01-03T16:45:00Z' },
  ]);

  const products = ref<Product[]>([]);

  const overview = ref<DashboardOverview>({
    totalMerchants: 8,
    active: 6,
    lowStock: 2,
    todaySales: 25000000,
    restockRequests: requests.value.filter(r => r.status === 'pending'),
  });

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.productApi}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
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

  const approveRequest = (id: number) => {
    const req = requests.value.find(r => r.id === id);
    if (req) {
      req.status = 'approved';
      overview.value.restockRequests = requests.value.filter(r => r.status === 'pending');
    }
  };

  const rejectRequest = (id: number) => {
    const req = requests.value.find(r => r.id === id);
    if (req) {
      req.status = 'rejected';
      overview.value.restockRequests = requests.value.filter(r => r.status === 'pending');
    }
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    // Note: This needs backend integration, temporary local add for UI testing if needed, 
    // but ideally we should post to backend. For now, pushing locally with a fake UUID-like string or handling accordingly.
    // Since ID is now string, we can't do Math.max.
    // We'll leave it simple for now or commented out if not required by current task, 
    // but existing UI uses it.
    const newId = crypto.randomUUID();
    products.value.push({ ...product, id: newId });
  };

  const updateProduct = (updatedProduct: Product) => {
    const index = products.value.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      products.value[index] = updatedProduct;
    }
  };

  return {
    requests,
    products,
    overview,
    fetchProducts,
    approveRequest,
    rejectRequest,
    addProduct,
    updateProduct
  };
});
