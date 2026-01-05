import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Merchant } from '../../core/types';
import { API_CONFIG } from '../../core/api/config';

export const useMerchantStore = defineStore('merchants', () => {
  const merchants = ref<Merchant[]>([]);

  const fetchMerchants = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.customerApi}/merchants`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.responseCode === "200" && Array.isArray(result.data)) {
          merchants.value = result.data;
        }
      }
    } catch (error) {
      console.error('Failed to fetch merchants:', error);
    }
  };

  const addMerchant = async (merchant: Omit<Merchant, 'id'>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.customerApi}/merchants`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(merchant)
      });

      const result = await response.json();
      if (response.ok && (result.responseCode === "200" || result.responseCode === "201")) {
        await fetchMerchants();
      } else {
        throw new Error(result.responseMessage || 'Gagal menambahkan merchant');
      }
    } catch (error: any) {
      console.error('Failed to add merchant:', error);
      throw error;
    }
  };

  const updateMerchant = async (updatedMerchant: Merchant) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.customerApi}/merchants/${updatedMerchant.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedMerchant)
      });

      const result = await response.json();
      if (response.ok && result.responseCode === "200") {
        await fetchMerchants();
      } else {
        throw new Error(result.responseMessage || 'Gagal memperbarui merchant');
      }
    } catch (error: any) {
      console.error('Failed to update merchant:', error);
      throw error;
    }
  };

  const toggleStatus = async (id: number) => {
    const merchant = merchants.value.find(m => m.id === id);
    if (merchant) {
      const newActiveStatus = !merchant.active;
      try {
        await updateMerchant({ ...merchant, active: newActiveStatus });
      } catch (error) {
        console.error('Failed to toggle status:', error);
      }
    }
  };

  const getMerchantById = (id: number) => merchants.value.find(m => m.id === id);

  return {
    merchants,
    fetchMerchants,
    addMerchant,
    updateMerchant,
    toggleStatus,
    getMerchantById
  };
});

