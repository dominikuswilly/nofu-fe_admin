<template>
  <div class="min-h-screen bg-slate-50/50 pb-24">
    <div class="px-4 py-6 space-y-6">
      <!-- Header Section -->
      <section>
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl font-black text-slate-900">Restock Management</h1>
            <p class="text-xs text-slate-500 font-medium">Kelola permintaan restock dari merchant</p>
          </div>
          <div class="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
            <span class="text-xs font-bold text-slate-400 uppercase">Total Records</span>
            <p class="text-lg font-black text-slate-900">{{ filteredRestocks.length }}</p>
          </div>
        </div>

        <!-- Filter Section -->
        <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div class="flex items-center space-x-2 mb-2">
            <FunnelIcon class="w-4 h-4 text-slate-400" />
            <h2 class="text-sm font-bold text-slate-800">Filter</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Merchant Name Filter -->
            <div>
              <label class="text-xs font-bold text-slate-600 mb-2 block">Merchant Name</label>
              <div class="relative">
                <MagnifyingGlassIcon class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  v-model="filters.merchantName"
                  type="text"
                  placeholder="Search by merchant name..."
                  class="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <!-- Status Filter -->
            <div>
              <label class="text-xs font-bold text-slate-600 mb-2 block">Status</label>
              <select
                v-model="filters.status"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="on delivery">On Delivery</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>

          <!-- Clear Filters -->
          <button
            v-if="filters.merchantName || filters.status"
            @click="clearFilters"
            class="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 transition-colors"
          >
            <XMarkIcon class="w-3 h-3" />
            <span>Clear Filters</span>
          </button>
        </div>
      </section>

      <!-- Table Section (Desktop) -->
      <section class="hidden lg:block">
        <div v-if="filteredRestocks.length === 0" class="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4">
          <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
            <InboxIcon class="w-8 h-8 text-slate-300" />
          </div>
          <div>
            <h4 class="text-slate-900 font-bold">No Records Found</h4>
            <p class="text-slate-400 text-xs max-w-[280px] mx-auto">
              {{ filters.merchantName || filters.status ? 'Try adjusting your filters' : 'No restock requests available' }}
            </p>
          </div>
        </div>

        <div v-else class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Restock ID</th>
                  <th class="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Merchant</th>
                  <th class="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Location</th>
                  <th class="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Created By</th>
                  <th class="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Created At</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="restock in filteredRestocks"
                  :key="restock.id"
                  class="hover:bg-slate-50/50 transition-colors group"
                >
                  <td class="px-6 py-4">
                    <div class="flex items-center space-x-2">
                      <span class="text-xs font-mono font-bold text-slate-900">{{ formatRestockId(restock.id) }}</span>
                      <button
                        @click="copyToClipboard(restock.id)"
                        class="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ClipboardDocumentIcon class="w-3 h-3 text-slate-400 hover:text-slate-600" />
                      </button>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div>
                      <p class="text-sm font-bold text-slate-900">{{ restock.merchantName }}</p>
                      <p class="text-xs text-slate-400 font-medium">ID: {{ restock.merchantId }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span :class="getStatusClass(restock.status)" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase">
                      {{ restock.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-start space-x-1">
                      <MapPinIcon class="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <div class="text-xs">
                        <p class="font-mono text-slate-600">{{ restock.latitude.toFixed(6) }}</p>
                        <p class="font-mono text-slate-600">{{ restock.longitude.toFixed(6) }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <p class="text-sm font-medium text-slate-700">{{ restock.createdBy }}</p>
                  </td>
                  <td class="px-6 py-4">
                    <p class="text-sm text-slate-600">{{ formatDate(restock.createdAt) }}</p>
                    <p class="text-xs text-slate-400">{{ formatTime(restock.createdAt) }}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Card Section (Mobile/Tablet) -->
      <section class="lg:hidden space-y-4">
        <div v-if="filteredRestocks.length === 0" class="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4">
          <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
            <InboxIcon class="w-8 h-8 text-slate-300" />
          </div>
          <div>
            <h4 class="text-slate-900 font-bold">No Records Found</h4>
            <p class="text-slate-400 text-xs max-w-[280px] mx-auto">
              {{ filters.merchantName || filters.status ? 'Try adjusting your filters' : 'No restock requests available' }}
            </p>
          </div>
        </div>

        <div
          v-for="restock in filteredRestocks"
          :key="restock.id"
          class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4"
        >
          <!-- Header -->
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-xs font-bold text-slate-400 uppercase mb-1">Restock ID</p>
              <p class="text-sm font-mono font-bold text-slate-900">{{ formatRestockId(restock.id) }}</p>
            </div>
            <span :class="getStatusClass(restock.status)" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase">
              {{ restock.status }}
            </span>
          </div>

          <!-- Merchant Info -->
          <div class="border-t border-slate-100 pt-4">
            <p class="text-xs font-bold text-slate-400 uppercase mb-2">Merchant</p>
            <p class="text-sm font-bold text-slate-900">{{ restock.merchantName }}</p>
            <p class="text-xs text-slate-500 font-medium">ID: {{ restock.merchantId }}</p>
          </div>

          <!-- Location -->
          <div class="border-t border-slate-100 pt-4">
            <p class="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center space-x-1">
              <MapPinIcon class="w-3 h-3" />
              <span>Location</span>
            </p>
            <div class="text-xs font-mono text-slate-600 space-y-0.5">
              <p>Lat: {{ restock.latitude.toFixed(6) }}</p>
              <p>Lng: {{ restock.longitude.toFixed(6) }}</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="border-t border-slate-100 pt-4 flex items-center justify-between text-xs">
            <div>
              <p class="text-slate-400 font-bold uppercase mb-1">Created By</p>
              <p class="text-slate-700 font-medium">{{ restock.createdBy }}</p>
            </div>
            <div class="text-right">
              <p class="text-slate-400 font-bold uppercase mb-1">Created At</p>
              <p class="text-slate-700 font-medium">{{ formatDate(restock.createdAt) }}</p>
              <p class="text-slate-500 text-xs">{{ formatTime(restock.createdAt) }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  InboxIcon,
  MapPinIcon,
  ClipboardDocumentIcon
} from '@heroicons/vue/24/outline';

// Mock Data
interface RestockRecord {
  id: string;
  merchantId: string;
  merchantName: string;
  status: 'pending' | 'approved' | 'on delivery' | 'delivered';
  latitude: number;
  longitude: number;
  createdBy: string;
  createdAt: string;
}

const mockRestocks = ref<RestockRecord[]>([
  {
    id: 'RST-2026-001-A3F9',
    merchantId: 'MCH-001',
    merchantName: 'Warung Makan Bahagia',
    status: 'pending',
    latitude: -6.200000,
    longitude: 106.816666,
    createdBy: 'MCH-001',
    createdAt: '2026-01-30T08:30:00+07:00'
  },
  {
    id: 'RST-2026-002-B7E2',
    merchantId: 'MCH-002',
    merchantName: 'Toko Sumber Rezeki',
    status: 'approved',
    latitude: -6.175110,
    longitude: 106.865039,
    createdBy: 'MCH-002',
    createdAt: '2026-01-30T07:15:00+07:00'
  },
  {
    id: 'RST-2026-003-C4D1',
    merchantId: 'MCH-003',
    merchantName: 'Kedai Kopi Nusantara',
    status: 'on delivery',
    latitude: -6.914744,
    longitude: 107.609810,
    createdBy: 'MCH-003',
    createdAt: '2026-01-29T16:45:00+07:00'
  },
  {
    id: 'RST-2026-004-E8F5',
    merchantId: 'MCH-004',
    merchantName: 'Minimarket Sejahtera',
    status: 'delivered',
    latitude: -7.250445,
    longitude: 112.768845,
    createdBy: 'MCH-004',
    createdAt: '2026-01-29T10:20:00+07:00'
  },
  {
    id: 'RST-2026-005-F2A8',
    merchantId: 'MCH-005',
    merchantName: 'Warung Pak Budi',
    status: 'pending',
    latitude: -6.208763,
    longitude: 106.845599,
    createdBy: 'MCH-005',
    createdAt: '2026-01-30T06:00:00+07:00'
  },
  {
    id: 'RST-2026-006-G9B3',
    merchantId: 'MCH-006',
    merchantName: 'Toko Berkah Jaya',
    status: 'approved',
    latitude: -6.121435,
    longitude: 106.774124,
    createdBy: 'MCH-006',
    createdAt: '2026-01-29T14:30:00+07:00'
  },
  {
    id: 'RST-2026-007-H1C7',
    merchantId: 'MCH-007',
    merchantName: 'Kedai Roti Manis',
    status: 'on delivery',
    latitude: -6.302100,
    longitude: 106.897400,
    createdBy: 'MCH-007',
    createdAt: '2026-01-28T18:00:00+07:00'
  },
  {
    id: 'RST-2026-008-J5K2',
    merchantId: 'MCH-001',
    merchantName: 'Warung Makan Bahagia',
    status: 'delivered',
    latitude: -6.200000,
    longitude: 106.816666,
    createdBy: 'MCH-001',
    createdAt: '2026-01-28T09:15:00+07:00'
  }
]);

// Filters
const filters = ref({
  merchantName: '',
  status: ''
});

// Computed filtered restocks
const filteredRestocks = computed(() => {
  return mockRestocks.value.filter(restock => {
    const matchesMerchant = !filters.value.merchantName || 
      restock.merchantName.toLowerCase().includes(filters.value.merchantName.toLowerCase());
    
    const matchesStatus = !filters.value.status || 
      restock.status === filters.value.status;
    
    return matchesMerchant && matchesStatus;
  });
});

// Helper functions
const clearFilters = () => {
  filters.value.merchantName = '';
  filters.value.status = '';
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'pending': 'bg-amber-100 text-amber-700',
    'approved': 'bg-blue-100 text-blue-700',
    'on delivery': 'bg-purple-100 text-purple-700',
    'delivered': 'bg-green-100 text-green-700'
  };
  return classes[status] || 'bg-slate-100 text-slate-700';
};

const formatRestockId = (id: string) => {
  // Show shortened version for better readability
  return id;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta'
  }) + ' WIB';
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    // You could add a toast notification here
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
