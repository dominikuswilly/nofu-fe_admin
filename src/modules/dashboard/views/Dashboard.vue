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
        :trend="0"
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
        :trend="0"
        :progress="0"
      />
    </div>

    <!-- Main Charts Layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Stock Overview Mock Chart -->
      <!-- <div class="card-premium">
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
      </div> -->

      <!-- Restock Requests Carousel/List -->
      <div class="card-premium">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-slate-900">Menunggu Restock</h3>
          <!-- <span class="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {{ overview.restockRequests.length }} BARU
          </span> -->
        </div>
        <div class="space-y-3">
          <div 
            v-for="req in overview.restockRequests" 
            :key="req.id" 
            @click="handleShowDetail(req.id)"
            class="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-transparent hover:border-slate-200 transition-all cursor-pointer group"
          >
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 group-hover:text-green-600 transition-colors">
                <TruckIcon class="w-5 h-5" />
              </div>
              <div>
                <p class="text-sm font-bold text-slate-800">{{ req.merchantName }}</p>
                <p class="text-[10px] text-slate-400 font-medium">{{ formatDate(req.updatedAt || req.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>

    <!-- Restock Detail Modal -->
    <Teleport to="body">
      <div v-if="showDetailModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
          <!-- Header -->
          <div class="p-5 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h3 class="font-black text-slate-900 text-lg">Detail Restock</h3>
              <p class="text-xs text-slate-400 font-medium uppercase tracking-wider">ID: #{{ selectedDetail?.id.split('-')[0] }}</p>
            </div>
            <button @click="showDetailModal = false" class="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-5 space-y-6">
            <div v-if="isLoadingDetail" class="flex flex-col items-center justify-center py-12">
              <div class="w-10 h-10 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin mb-4"></div>
              <p class="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Memuat Data...</p>
            </div>
            
            <template v-else-if="selectedDetail">
              <!-- Summary Cards -->
              <div class="grid grid-cols-2 gap-3">
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Unit</p>
                  <p class="text-2xl font-black text-slate-900">{{ selectedDetail.totalQty }}</p>
                </div>
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Jenis</p>
                  <p class="text-2xl font-black text-slate-900">{{ selectedDetail.totalItem }}</p>
                </div>
              </div>

              <!-- Product List -->
              <div>
                <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Item Produk</h4>
                <div class="space-y-2">
                  <div v-for="item in selectedDetail.restockDetail" :key="item.id" class="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
                    <div class="flex items-center space-x-3">
                      <img :src="item.productImageUrl" class="w-10 h-10 rounded-lg object-cover bg-slate-50" />
                      <div>
                        <p class="text-sm font-bold text-slate-900">{{ item.productName }}</p>
                        <p class="text-[10px] text-slate-400 font-medium">PK-{{ item.productId.slice(0, 8) }}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-black text-slate-900">{{ item.qty }}</p>
                      <p class="text-[10px] text-slate-400 font-medium uppercase">UNIT</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Location (Optional) -->
              <!-- Location (Clickable to Google Maps) -->
              <div 
                @click="openInGoogleMaps(selectedDetail.location.latitude, selectedDetail.location.longitude)"
                class="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between cursor-pointer hover:bg-emerald-100 transition-colors group"
              >
                <div class="flex items-center space-x-4">
                  <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <MapPinIcon class="w-6 h-6" />
                  </div>
                  <div>
                    <p class="text-xs font-bold text-emerald-900">Lokasi Restock</p>
                    <p class="text-[10px] text-emerald-600 font-medium tracking-tight">Lat: {{ selectedDetail.location.latitude }}, Lon: {{ selectedDetail.location.longitude }}</p>
                  </div>
                </div>
                <div class="flex items-center text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-white/50 px-2 py-1 rounded-lg">
                  Peta
                  <ArrowTopRightOnSquareIcon class="w-3 h-3 ml-1" />
                </div>
              </div>
            </template>
          </div>

          <!-- Footer -->
          <div class="p-5 bg-slate-50 flex space-x-3">
            <button 
              @click="showDetailModal = false"
              class="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors"
            >
              Tutup
            </button>
            <button 
              @click="stockStore.approveRequest(selectedDetail?.id || ''); showDetailModal = false"
              class="flex-1 py-3 px-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 shadow-lg shadow-green-500/30 transition-all active:scale-95"
            >
              Setujui Restock
            </button>
          </div>
        </div>
      </div>
    </Teleport>
      </div>
    </div>

    <!-- Quick Actions / Progress -->
    <!-- <div class="card-premium bg-gradient-to-br from-green-600 to-emerald-700 text-white border-none">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h4 class="font-bold text-lg">Progres Kampanye Penjualan</h4>
          <p class="text-white/70 text-xs">Target: N/A bulan ini</p>
        </div>
        <div class="w-12 h-12 rounded-full border-4 border-white/20 flex items-center justify-center">
          <span class="text-xs font-bold">85%</span>
        </div>
      </div>
      <div class="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
        <div class="h-full bg-white rounded-full w-[85%]"></div>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { 
  BuildingStorefrontIcon, 
  SignalIcon, 
  ExclamationTriangleIcon, 
  BanknotesIcon,
  TruckIcon,
  // CheckIcon,
  XMarkIcon,
  MapPinIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/vue/24/outline';
import MetricCard from '../../../core/components/ui/MetricCard.vue';
import { useStockStore } from '../../stock/store';
// import { useMerchantStore } from '../../merchants/store';
import type { RestockResponse } from '../../../core/types';

const stockStore = useStockStore();
// const merchantStore = useMerchantStore();

const showDetailModal = ref(false);
const isLoadingDetail = ref(false);
const selectedDetail = ref<RestockResponse | null>(null);

const handleShowDetail = async (id: string) => {
  isLoadingDetail.value = true;
  showDetailModal.value = true;
  selectedDetail.value = null;
  
  try {
    const detail = await stockStore.fetchRestockDetail(id);
    selectedDetail.value = detail;
  } catch (error) {
    console.error('Error fetching detail:', error);
    showDetailModal.value = false;
  } finally {
    isLoadingDetail.value = false;
  }
};

const openInGoogleMaps = (lat: number, lon: number) => {
  const url = `https://www.google.com/maps?q=${lat},${lon}`;
  window.open(url, '_blank');
};

const overview = computed(() => stockStore.overview);
// const stockPreview = computed(() => merchantStore.merchants.slice(0, 4).map(m => ({
//   id: m.id,
//   name: m.name,
//   stock: m.stock
// })));

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
