import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Merchant } from '../../core/types';

export const useMerchantStore = defineStore('merchants', () => {
  const merchants = ref<Merchant[]>([
    { id: 1, name: 'Toko Ahmad', status: 'ON', stock: 85, cash: 1500000, offDays: 2, position: 'Soreang' },
    { id: 2, name: 'Budi Mart', status: 'OFF', stock: 0, cash: 0, offDays: 5, position: 'Bandung' },
    { id: 3, name: 'Cahaya Rejeki', status: 'ON', stock: 12, cash: 2400000, offDays: 0, position: 'Cimahi' },
    { id: 4, name: 'Toko Dewi', status: 'ON', stock: 45, cash: 800000, offDays: 1, position: 'Lembang' },
    { id: 5, name: 'Eka Jaya', status: 'OFF', stock: 0, cash: 0, offDays: 3, position: 'Padalarang' },
    { id: 6, name: 'Fajar Utama', status: 'ON', stock: 92, cash: 3100000, offDays: 0, position: 'Dago' },
    { id: 7, name: 'Kelontong Gani', status: 'ON', stock: 5, cash: 1200000, offDays: 4, position: 'Ujung Berung' },
    { id: 8, name: 'Hadi Grosir', status: 'ON', stock: 67, cash: 950000, offDays: 2, position: 'Kopo' },
  ]);

  const toggleStatus = (id: number) => {
    const merchant = merchants.value.find(m => m.id === id);
    if (merchant) {
      merchant.status = merchant.status === 'ON' ? 'OFF' : 'ON';
    }
  };

  const getMerchantById = (id: number) => merchants.value.find(m => m.id === id);

  return {
    merchants,
    toggleStatus,
    getMerchantById
  };
});
