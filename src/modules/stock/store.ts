import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { RestockRequest, DashboardOverview } from '../../core/types';

export const useStockStore = defineStore('stocks', () => {
  const requests = ref<RestockRequest[]>([
    { id: 1, merchantId: 1, merchantName: 'Toko Ahmad', qty: 50, status: 'pending', timestamp: '2026-01-04T08:30:00Z' },
    { id: 2, merchantId: 3, merchantName: 'Cahaya Rejeki', qty: 100, status: 'pending', timestamp: '2026-01-04T09:15:00Z' },
    { id: 3, merchantId: 7, merchantName: 'Gani Kelontong', qty: 30, status: 'approved', timestamp: '2026-01-03T16:45:00Z' },
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

  return {
    requests,
    overview,
    approveRequest,
    rejectRequest
  };
});
