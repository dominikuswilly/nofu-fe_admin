<template>
  <div class="min-h-screen bg-slate-50/50 pb-24">
    <!-- Sticky Summary Widget (Visible when merchant selected) -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-[-100%] opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-[-100%] opacity-0"
    >
      <div v-if="selectedMerchantId" class="sticky top-12 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-2 shadow-sm flex items-center justify-between mb-2">
        <div class="flex flex-col">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected Merchant</span>
          <span class="text-sm font-bold text-slate-900">{{ selectedMerchant?.name }}</span>
        </div>
        <div class="flex items-center space-x-6">
          <div class="hidden sm:flex flex-col items-end">
            <span class="text-[10px] font-bold text-blue-500 uppercase">Total QRIS</span>
            <span class="text-xs font-black text-slate-800">Rp {{ formatNumber(mockSummary.qris) }}</span>
          </div>
          <div class="hidden sm:flex flex-col items-end">
            <span class="text-[10px] font-bold text-green-500 uppercase">Total CASH</span>
            <span class="text-xs font-black text-slate-800">Rp {{ formatNumber(mockSummary.cash) }}</span>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-[10px] font-bold text-slate-900 uppercase">Harus dikembalikan</span>
            <span class="text-sm font-black text-green-600">Rp {{ formatNumber(mockSummary.total) }}</span>
          </div>
        </div>
      </div>
    </Transition>

    <div class="px-4 space-y-6 mt-0">
      <!-- Top Section: Pilih Merchant -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-xl font-black text-slate-900">Stok</h1>
            <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Alur Stok Harian</p>
          </div>
        </div>

        <div class="mb-2">
          <h2 class="text-sm font-bold text-slate-800 mb-3">Pilih Merchant</h2>
          <!-- Mobile: Horizontal Scroll, Desktop: Grid -->
          <div class="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-4 gap-4 no-scrollbar">
            <div 
              v-for="merchant in merchantStore.merchants" 
              :key="merchant.id"
              @click="selectMerchant(merchant.id)"
              :class="[
                'flex-shrink-0 w-64 sm:w-auto p-4 rounded-2xl border transition-all cursor-pointer group relative',
                selectedMerchantId === merchant.id 
                  ? 'bg-white border-green-500 ring-4 ring-green-50 shadow-lg' 
                  : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-md'
              ]"
            >
              <div class="flex items-start justify-between mb-3">
                <div 
                  :class="[
                    'w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black transition-colors',
                    selectedMerchantId === merchant.id ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                  ]"
                >
                  {{ getInitials(merchant.name) }}
                </div>
                <span 
                  :class="[
                    'text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-tighter',
                    getStatusStyle(merchant.id)
                  ]"
                >
                  {{ getStatusLabel(merchant.id) }}
                </span>
              </div>
              <div>
                <h3 class="text-sm font-bold text-slate-900 mb-0.5">{{ merchant.name }}</h3>
                <p class="text-[10px] text-slate-400 font-medium">{{ merchant.position || 'ID: ' + merchant.id }}</p>
              </div>
              
              <!-- Selected Indicator -->
              <div v-if="selectedMerchantId === merchant.id" class="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full shadow-lg">
                <CheckIcon class="w-3 h-3 stroke-[4]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Middle Section: Alur Stok Harian -->
      <section :class="{'opacity-50 pointer-events-none grayscale transition-all duration-500': !selectedMerchantId}">
        <div class="mb-4">
          <h2 class="text-xl font-black text-slate-900 uppercase tracking-tight">Alur Stok harian</h2>
          <p class="text-xs text-slate-500 font-medium">
            {{ selectedMerchantId ? `Mengelola stok untuk ${selectedMerchant?.name}` : 'Pilih merchant dulu untuk mengelola stok harian' }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Step 1: PAGI -->
          <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div class="flex items-start justify-between mb-6">
              <div>
                <span class="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 block">Langkah 1</span>
                <h3 class="text-lg font-black text-slate-900">PAGI: Inisiasi</h3>
              </div>
              <div v-if="isPagiDone" class="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-black flex items-center space-x-1">
                <CheckCircleIcon class="w-3 h-3" />
                <span>SELESAI</span>
              </div>
            </div>
            
            <p class="text-sm text-slate-500 mb-8 leading-relaxed">
              Hitung stok awal semua produk dan input saldo kas pagi ini sebelum memulai operasional.
            </p>

            <div v-if="isPagiDone" class="mb-8 p-3 bg-slate-50 rounded-2xl flex items-center justify-between border border-dashed border-slate-200">
              <span class="text-xs font-bold text-slate-400">Status</span>
              <span class="text-xs font-black text-slate-800">Selesai pukul 08.15 WIB</span>
            </div>

            <button 
              @click="startInitiation"
              class="w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center space-x-2 shadow-lg active:scale-95"
              :class="isPagiDone ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'"
            >
              <PlayIcon v-if="!isPagiDone" class="w-4 h-4 fill-current" />
              <span>{{ isPagiDone ? 'Sudah Inisiasi' : 'Mulai Inisiasi' }}</span>
            </button>
            
            <!-- Visual Accent -->
            <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
          </div>

          <!-- Step 2: MALAM -->
          <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div class="flex items-start justify-between mb-6">
              <div>
                <span class="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1 block">Langkah 2</span>
                <h3 class="text-lg font-black text-slate-900">MALAM: Penutup</h3>
              </div>
              <div v-if="isMalamDone" class="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-black flex items-center space-x-1">
                <CheckCircleIcon class="w-3 h-3" />
                <span>SELESAI</span>
              </div>
            </div>

            <p class="text-sm text-slate-500 mb-6 leading-relaxed">
              Tutup penjualan, rekonsiliasi kas, dan cek saldo akhir hari untuk memastikan laporan akurat.
            </p>

            <!-- Ringkasan Hari Ini (Visible when merchant selected) -->
            <div class="mb-8 space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ringkasan Hari Ini</h4>
              <div class="flex justify-between items-center text-xs">
                <span class="text-slate-500 font-medium">Total penjualan QRIS</span>
                <span class="font-black text-blue-600">Rp {{ formatNumber(mockSummary.qris) }}</span>
              </div>
              <div class="flex justify-between items-center text-xs border-b border-slate-200 pb-2">
                <span class="text-slate-500 font-medium">Total penjualan CASH</span>
                <span class="font-black text-green-600">Rp {{ formatNumber(mockSummary.cash) }}</span>
              </div>
              <div class="flex justify-between items-center pt-1">
                <span class="text-xs font-bold text-slate-900">Total Penjualan</span>
                <span class="text-sm font-black text-slate-900">Rp {{ formatNumber(mockSummary.qris + mockSummary.cash) }}</span>
              </div>
              <div class="pt-3 border-t border-slate-200 flex flex-col items-center justify-center">
                <span class="text-[10px] font-bold text-slate-400 uppercase mb-1">Saldo yang harus dikembalikan</span>
                <span class="text-2xl font-black text-green-600">Rp {{ formatNumber(mockSummary.total) }}</span>
              </div>
            </div>

            <button 
              class="w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center space-x-2 shadow-lg active:scale-95"
              :class="!isPagiDone || isMalamDone ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-green-600 text-white shadow-green-200 hover:bg-green-700'"
            >
              <MoonIcon v-if="!isMalamDone" class="w-4 h-4 fill-current" />
              <span>{{ isMalamDone ? 'Sudah Penutup' : 'Mulai Penutup' }}</span>
            </button>
            
            <!-- Warning Banner for Step 2 -->
            <div v-if="selectedMerchantId && !isMalamDone" class="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center space-x-2 animate-pulse">
              <ExclamationTriangleIcon class="w-4 h-4 text-amber-500 flex-shrink-0" />
              <p class="text-[10px] font-bold text-amber-700 leading-tight">Penutup hari ini belum dilakukan untuk {{ selectedMerchant?.name }}.</p>
            </div>

            <!-- Visual Accent -->
            <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-green-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
          </div>
        </div>
      </section>

      <!-- Bottom Section: Riwayat 24 Jam Terakhir -->
      <section>
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-black text-slate-900">Riwayat 24 jam terakhir</h2>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aktivitas merchant terbaru</p>
          </div>
          
          <!-- Quick Filter Pills -->
          <div v-if="selectedMerchantId" class="flex items-center space-x-2">
            <select class="text-xs font-bold bg-white border-slate-200 rounded-lg py-1 pl-2 pr-8 focus:ring-green-500 focus:border-green-500">
              <option>Semua Tipe</option>
              <option>Inisiasi</option>
              <option>Penjualan</option>
              <option>Penutup</option>
            </select>
          </div>
        </div>

        <div v-if="!selectedMerchantId" class="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4">
          <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
            <QueueListIcon class="w-8 h-8 text-slate-300" />
          </div>
          <div>
            <h4 class="text-slate-900 font-bold">Pilih merchant dulu</h4>
            <p class="text-slate-400 text-xs max-w-[240px] mx-auto">Silakan pilih merchant di atas untuk melihat riwayat aktivitas 24 jam terakhir.</p>
          </div>
        </div>

        <div v-else class="space-y-4">
          <div v-if="mockHistory.length === 0" class="bg-white border border-slate-100 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4">
             <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
              <FaceFrownIcon class="w-8 h-8 text-slate-300" />
            </div>
            <div>
              <h4 class="text-slate-900 font-bold">Belum ada riwayat</h4>
              <p class="text-slate-400 text-xs">Belum ada aktivitas tercatat untuk merchant ini hari ini.</p>
            </div>
          </div>
          
          <div v-else v-for="(event, idx) in mockHistory" :key="idx" class="relative pl-8 group">
            <!-- Timeline Line -->
            <div 
              v-if="idx !== mockHistory.length - 1" 
              class="absolute left-3 top-6 bottom-[-16px] w-[2px] bg-slate-100"
            ></div>
            
            <!-- Timeline Dot -->
            <div 
              class="absolute left-1 top-2 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10"
              :class="getEventColor(event.type)"
            ></div>

            <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 group-hover:border-slate-300 transition-colors">
              <div class="flex justify-between items-start mb-2">
                <div class="flex items-center space-x-2">
                  <span class="text-xs font-black text-slate-800 uppercase">{{ event.typeLabel }}</span>
                  <span class="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{{ event.time }}</span>
                </div>
                <span class="text-[10px] font-bold text-slate-400">{{ event.user }}</span>
              </div>
              <div class="flex items-end justify-between">
                <p class="text-xs text-slate-500 leading-relaxed max-w-[70%]">{{ event.description }}</p>
                <div v-if="event.amount" class="text-right">
                  <span class="text-[10px] font-bold text-slate-400 block uppercase">Nominal</span>
                  <span class="text-xs font-black text-slate-900">Rp {{ formatNumber(event.amount) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Floating Action for Mobile when merchant selected -->
    <div v-if="selectedMerchantId" class="fixed bottom-4 left-4 right-4 z-40 sm:hidden">
       <div class="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between">
         <div class="flex flex-col">
           <span class="text-[9px] font-bold text-white/50 uppercase">Harus dikembalikan</span>
           <span class="text-sm font-black">Rp {{ formatNumber(mockSummary.total) }}</span>
         </div>
         <button class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-green-500/20 active:scale-95 transition-all">
           Detail Lap.
         </button>
       </div>
    </div>

    <!-- Initiation Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="isInitiationModalOpen" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="isInitiationModalOpen = false"></div>
          
          <!-- Content -->
          <div class="relative w-full sm:max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
            <div class="p-6 border-b border-slate-50 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 class="text-xl font-black text-slate-900">Inisiasi Stok</h3>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ selectedMerchant?.name }}</p>
              </div>
              <button @click="isInitiationModalOpen = false" class="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                <XMarkIcon class="w-6 h-6" />
              </button>
            </div>

            <!-- Product List Area -->
            <div class="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              <div v-if="stockStore.products.length === 0" class="py-12 text-center">
                 <div class="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <QueueListIcon class="w-6 h-6 text-slate-300" />
                 </div>
                 <p class="text-sm font-bold text-slate-400">Memuat katalog...</p>
              </div>
              <div v-else v-for="product in stockStore.products" :key="product.id" class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-slate-100">
                    <img v-if="product.url" :src="product.url" class="w-full h-full object-cover">
                    <ShoppingBagIcon v-else class="w-4 h-4 text-slate-300" />
                  </div>
                  <div>
                    <h4 class="text-xs font-black text-slate-900">{{ product.name }}</h4>
                    <p class="text-[10px] font-bold text-slate-400">Tersedia: {{ product.stock }}</p>
                  </div>
                </div>
                <div class="w-24">
                  <div class="relative">
                    <input 
                      v-model.number="initiationData[product.id]" 
                      type="number" 
                      min="0"
                      class="w-full bg-white border-none rounded-xl px-3 py-2 text-xs font-black text-right focus:ring-2 focus:ring-blue-500 shadow-sm"
                      placeholder="0"
                    >
                    <span class="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase">Qty</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Action -->
            <div class="p-6 border-t border-slate-50 bg-slate-50/50 flex-shrink-0">
              <button 
                @click="submitInitiation"
                :disabled="isSubmitting"
                class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>{{ isSubmitting ? 'Memproses...' : 'Simpan Inisiasi' }}</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { 
  CheckIcon,
  CheckCircleIcon,
  PlayIcon,
  MoonIcon,
  ExclamationTriangleIcon,
  QueueListIcon,
  FaceFrownIcon,
  XMarkIcon,
  ShoppingBagIcon
} from '@heroicons/vue/24/solid';
import { useMerchantStore } from '../../merchants/store';
import { useStockStore } from '../store';
import { parseJwt } from '../../../core/utils/auth';

const merchantStore = useMerchantStore();
const stockStore = useStockStore();
const selectedMerchantId = ref<string | number | null>(null);

// Initiation State
const isInitiationModalOpen = ref(false);
const isSubmitting = ref(false);
const initiationData = reactive<Record<string, number>>({});

// Initialize data
merchantStore.fetchMerchantsWithStock();

const selectedMerchant = computed(() => {
  return merchantStore.merchants.find(m => m.id === selectedMerchantId.value);
});

const isPagiDone = computed(() => selectedMerchant.value?.isPagiDone || false);
const isMalamDone = computed(() => selectedMerchant.value?.isMalamDone || false);

const selectMerchant = (id: string | number) => {
  if (selectedMerchantId.value === id) {
    selectedMerchantId.value = null;
  } else {
    selectedMerchantId.value = id;
  }
};

const startInitiation = async () => {
  if (isPagiDone.value) return;
  
  // Reset data
  Object.keys(initiationData).forEach(key => delete initiationData[key]);
  
  isInitiationModalOpen.value = true;
  await stockStore.fetchProducts();
};


const submitInitiation = async () => {
  if (!selectedMerchantId.value) return;
  
  // Simple validation
  const hasData = Object.values(initiationData).some(qty => qty > 0);
  if (!hasData) {
    alert('Mohon masukkan jumlah stok minimal untuk satu produk.');
    return;
  }

  isSubmitting.value = true;
  
  try {
    const token = localStorage.getItem('token');
    const claims = token ? parseJwt(token) : null;
    const userId = claims?.sub || 'unknown';

    const stockDetails = stockStore.products
      .filter(p => (initiationData[p.id] || 0) > 0)
      .map(p => ({
        productId: p.id,
        price: p.price,
        qty: initiationData[p.id],
        currency: p.currency
      }));

    const payload = {
      userId: userId,
      merchantId: selectedMerchantId.value.toString(),
      stockDetails: stockDetails
    };

    await stockStore.createStockInitiation(payload);
    
    // Refresh merchant data to get updated isPagiDone/isMalamDone status
    await merchantStore.fetchMerchantsWithStock();
    
    isInitiationModalOpen.value = false;
    alert('Berhasil menyimpan inisiasi stok.');
  } catch (error: any) {
    alert(error.message || 'Gagal menyimpan inisiasi stok.');
  } finally {
    isSubmitting.value = false;
  }
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const getStatusLabel = (id: string | number) => {
  const merchant = merchantStore.merchants.find(m => m.id === id);
  if (merchant?.isMalamDone) return 'Sudah penutup';
  if (merchant?.isPagiDone) return 'Menunggu penutup';
  return 'Belum inisiasi';
};

const getStatusStyle = (id: string | number) => {
  const merchant = merchantStore.merchants.find(m => m.id === id);
  if (merchant?.isMalamDone) return 'bg-slate-900 text-white';
  if (merchant?.isPagiDone) return 'bg-blue-100 text-blue-600';
  return 'bg-slate-100 text-slate-500';
};

const formatNumber = (val: number) => {
  return new Intl.NumberFormat('id-ID').format(val);
};

// Mock Summary Data
const mockSummary = computed(() => {
  if (!selectedMerchantId.value) return { qris: 0, cash: 0, total: 0 };
  // Fixed randomized mock based on ID for consistency during session
  const idValue = typeof selectedMerchantId.value === 'string' 
    ? selectedMerchantId.value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    : (selectedMerchantId.value || 0);
  const seed = (idValue * 12345) % 10000;
  const qris = 1500000 + seed * 100;
  const cash = 800000 + seed * 50;
  return { qris, cash, total: qris + cash };
});

// Mock History Data
const mockHistory = computed(() => {
  if (!selectedMerchantId.value) return [];
  
  const merchantName = selectedMerchant.value?.name || 'Merchant';
  const history = [
    { 
      type: 'pagi', 
      typeLabel: 'Inisiasi Pagi', 
      time: '08:15 WIB', 
      user: 'Admin Ahmad', 
      description: `${merchantName} melakukan inisiasi stok pagi.` 
    },
    { 
      type: 'sale', 
      typeLabel: 'Penjualan', 
      time: '12:30 WIB', 
      user: 'Sistem', 
      description: 'Laporan penjualan tengah hari otomatis.', 
      amount: 450000 
    },
    { 
      type: 'adjust', 
      typeLabel: 'Penyesuaian', 
      time: '14:45 WIB', 
      user: 'Admin Budi', 
      description: 'Penyesuaian stok manual: Es Teh Manis (+10).' 
    }
  ];

  if (isMalamDone.value) {
    history.unshift({
      type: 'malam',
      typeLabel: 'Penutup Malam',
      time: '21:00 WIB',
      user: 'Admin Ahmad',
      description: `${merchantName} telah melakukan penutupan toko hari ini.`,
      amount: mockSummary.value.total
    });
  }

  return history;
});

const getEventColor = (type: string) => {
  switch (type) {
    case 'pagi': return 'bg-blue-500';
    case 'malam': return 'bg-slate-900';
    case 'sale': return 'bg-green-500';
    case 'adjust': return 'bg-amber-500';
    default: return 'bg-slate-400';
  }
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

