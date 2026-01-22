<template>
  <div class="mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100 relative overflow-hidden transition-all hover:shadow-md">
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ringkasan Hari Ini</h4>
      <button 
        @click="fetchSummary" 
        :disabled="loading"
        class="text-[10px] font-bold text-blue-500 hover:text-blue-700 disabled:text-slate-300 transition-colors flex items-center space-x-1"
      >
        <span v-if="loading" class="animate-spin w-3 h-3 border-2 border-current border-t-transparent rounded-full"></span>
        <span v-else>Refresh</span>
      </button>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 p-3 rounded-xl border border-red-100 flex flex-col items-center text-center">
      <p class="text-[10px] text-red-500 font-bold mb-2">{{ error }}</p>
      <button 
        @click="fetchSummary"
        class="text-[10px] font-black bg-red-100 text-red-600 px-3 py-1 rounded-full hover:bg-red-200 transition-colors"
      >
        Coba Lagi
      </button>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="space-y-3 animate-pulse">
      <div class="flex justify-between items-center">
        <div class="h-3 w-24 bg-slate-200 rounded"></div>
        <div class="h-3 w-20 bg-slate-200 rounded"></div>
      </div>
      <div class="flex justify-between items-center border-b border-slate-200 pb-2">
        <div class="h-3 w-24 bg-slate-200 rounded"></div>
        <div class="h-3 w-20 bg-slate-200 rounded"></div>
      </div>
      <div class="flex justify-between items-center pt-1">
        <div class="h-4 w-28 bg-slate-200 rounded"></div>
        <div class="h-4 w-24 bg-slate-200 rounded"></div>
      </div>
    </div>

    <!-- Data Display -->
    <div v-else class="space-y-3">
      <!-- QRIS -->
      <div class="flex justify-between items-center text-xs group">
        <span class="text-slate-500 font-medium group-hover:text-slate-700 transition-colors">Pembayaran QRIS</span>
        <span class="font-black text-blue-600">
          {{ formatCurrency(summaryData?.subtotalPaymentAmount?.qris) }}
        </span>
      </div>

      <!-- Cash -->
      <div class="flex justify-between items-center text-xs border-b border-slate-200 pb-2 group">
        <span class="text-slate-500 font-medium group-hover:text-slate-700 transition-colors">Pembayaran Tunai</span>
        <span class="font-black text-green-600">
          {{ formatCurrency(summaryData?.subtotalPaymentAmount?.cash) }}
        </span>
      </div>

      <!-- Total -->
      <div class="flex justify-between items-center pt-1">
        <span class="text-xs font-bold text-slate-900">Total Penjualan</span>
        <span class="text-sm font-black text-slate-900 tracking-tight">
          {{ formatCurrency(summaryData?.totalPaymentAmount) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { API_CONFIG } from '../../../core/api/config';

const props = defineProps<{
  merchantId?: string | number | null;
}>();

interface PaymentSummary {
  cash: number;
  qris: number;
}

interface SummaryData {
  subtotalPaymentAmount: PaymentSummary;
  totalPaymentAmount: number;
}

const loading = ref(false);
const error = ref<string | null>(null);
const summaryData = ref<SummaryData | null>(null);

const formatCurrency = (value?: number): string => {
  if (value === undefined || value === null) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value).replace('IDR', 'Rp');
};

const fetchSummary = async () => {
  // Only fetch if we have a merchant ID (assuming context depends on it) 
  // OR if we want to allow fetching without ID (if API supports it).
  // Given the user expectation "when merchant selected", we should definitely fetch when ID exists.
  
  loading.value = true;
  error.value = null;

  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const url = new URL(`${API_CONFIG.transactionApi}/sales/report/summary`);
    if (props.merchantId) {
      url.searchParams.append('merchantId', props.merchantId.toString());
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();

    if (result.responseCode === "200" && result.data) {
      summaryData.value = result.data;
    } else {
      throw new Error(result.responseMessage || 'Gagal memuat data ringkasan');
    }
  } catch (err: any) {
    console.error('Fetch summary error:', err);
    error.value = err.message || 'Terjadi kesalahan jaringan';
  } finally {
    loading.value = false;
  }
};

watch(() => props.merchantId, (newId) => {
  if (newId) {
    fetchSummary();
  }
});

onMounted(() => {
  if (props.merchantId) {
    fetchSummary();
  }
});
</script>
