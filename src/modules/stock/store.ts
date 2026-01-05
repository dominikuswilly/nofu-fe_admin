import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { RestockRequest, DashboardOverview, Product } from '../../core/types';

export const useStockStore = defineStore('stocks', () => {
  const requests = ref<RestockRequest[]>([
    { id: 1, merchantId: 1, merchantName: 'Toko Ahmad', qty: 50, status: 'pending', timestamp: '2026-01-04T08:30:00Z' },
    { id: 2, merchantId: 3, merchantName: 'Cahaya Rejeki', qty: 100, status: 'pending', timestamp: '2026-01-04T09:15:00Z' },
    { id: 3, merchantId: 7, merchantName: 'Gani Kelontong', qty: 30, status: 'approved', timestamp: '2026-01-03T16:45:00Z' },
  ]);

  const products = ref<Product[]>([
    { id: 1, name: 'Extra Joss', description: 'Minuman energi bubuk', price: 1000, currency: 'IDR', stock: 500, url: 'https://images.tokopedia.net/img/cache/700/Vqb7pG/2021/6/15/8e44e27f-9f7e-4b7d-8d4e-6e8e0c8b6a3c.jpg' },
    { id: 2, name: 'Kuku Bima', description: 'Minuman energi rasa anggur', price: 1000, currency: 'IDR', stock: 450, url: 'https://images.tokopedia.net/img/cache/700/Vqb7pG/2022/3/24/7a4a2a1a-3e5f-4d6a-9b4e-8f5c3b2e1a1a.jpg' },
  ]);

  const overview = ref<DashboardOverview>({
    totalMerchants: 8,
    active: 6,
    lowStock: 2,
    todaySales: 25000000,
    restockRequests: requests.value.filter(r => r.status === 'pending'),
  });

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
    const newId = products.value.length > 0 ? Math.max(...products.value.map(p => p.id)) + 1 : 1;
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
    approveRequest,
    rejectRequest,
    addProduct,
    updateProduct
  };
});
