<template>
  <div class="px-4 space-y-6">
    <!-- KPI Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard 
        label="Merchant" 
        :value="overview.totalMerchants" 
        :icon="BuildingStorefrontIcon" 
        colorClass="bg-blue-100 text-blue-600"
        suffix="Total"
      />
      <MetricCard 
        label="Aktif" 
        :value="overview.active" 
        :icon="SignalIcon" 
        colorClass="bg-green-100 text-green-600"
        :trend="4"
      />
      <MetricCard 
        label="Stok Rendah" 
        :value="overview.lowStock" 
        :icon="ExclamationTriangleIcon" 
        colorClass="bg-red-100 text-red-600"
      />
      <MetricCard 
        label="Penjualan Hari Ini" 
        :value="formatCurrency(overview.todaySales)" 
        :icon="BanknotesIcon" 
        colorClass="bg-emerald-100 text-emerald-600"
        :trend="12"
        :progress="75"
      />
    </div>

    <!-- Main Charts Layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Stock Overview Mock Chart -->
      <div class="card-premium">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-slate-900">Ketersediaan Stok</h3>
          <button class="text-xs font-bold text-green-600 uppercase">Detail</button>
        </div>
        <div class="space-y-4">
          <div v-for="merchant in stockPreview" :key="merchant.id">
            <div class="flex justify-between text-xs font-bold text-slate-500 mb-1">
              <span>{{ merchant.name }}</span>
              <span>{{ merchant.stock }}%</span>
            </div>
            <div class="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
              <div 
                :class="['h-full rounded-full transition-all duration-1000', merchant.stock < 30 ? 'bg-red-500' : 'bg-green-500']"
                :style="{ width: `${merchant.stock}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Restock Requests Carousel/List -->
      <div class="card-premium">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-slate-900">Menunggu Restock</h3>
          <span class="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {{ overview.restockRequests.length }} BARU
          </span>
        </div>
        <div class="space-y-3">
          <div v-for="req in overview.restockRequests" :key="req.id" class="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-transparent hover:border-slate-200 transition-all cursor-pointer">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400">
                <TruckIcon class="w-5 h-5" />
              </div>
              <div>
                <p class="text-sm font-bold text-slate-800">{{ req.merchantId }}</p>
                <p class="text-[10px] text-slate-400 font-medium">{{ formatDate(req.updatedAt || req.createdAt) }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm font-black text-slate-900">N/A <span class="text-[10px] font-medium text-slate-400">UNIT</span></span>
              <button @click.stop="stockStore.approveRequest(req.id)" class="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                <CheckIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions / Progress -->
    <div class="card-premium bg-gradient-to-br from-green-600 to-emerald-700 text-white border-none">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h4 class="font-bold text-lg">Progres Kampanye Penjualan</h4>
          <p class="text-white/70 text-xs">Target: Rp 30.000.000 bulan ini</p>
        </div>
        <div class="w-12 h-12 rounded-full border-4 border-white/20 flex items-center justify-center">
          <span class="text-xs font-bold">85%</span>
        </div>
      </div>
      <div class="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
        <div class="h-full bg-white rounded-full w-[85%]"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { 
  BuildingStorefrontIcon, 
  SignalIcon, 
  ExclamationTriangleIcon, 
  BanknotesIcon,
  TruckIcon,
  CheckIcon
} from '@heroicons/vue/24/outline';
import MetricCard from '../../../core/components/ui/MetricCard.vue';
import { useStockStore } from '../../stock/store';
import { useMerchantStore } from '../../merchants/store';

const stockStore = useStockStore();
const merchantStore = useMerchantStore();

const overview = computed(() => stockStore.overview);
const stockPreview = computed(() => merchantStore.merchants.slice(0, 4).map(m => ({
  id: m.id,
  name: m.name,
  stock: m.stock
})));

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val).replace('Rp', 'Rp ');
};

const formatDate = (ts: string) => {
  if (!ts) return '-';
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

onMounted(async () => {
  await stockStore.fetchRestockRequests();
});
</script>
