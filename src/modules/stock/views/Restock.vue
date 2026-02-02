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
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <label class="text-xs font-bold text-slate-600 mb-2 block">Status (Multiple)</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="status in statusOptions"
                  :key="status.value"
                  @click="toggleStatus(status.value)"
                  :class="[
                    'px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center space-x-2 border-2',
                    filters.statuses.includes(status.value)
                      ? getStatusActiveClass(status.value)
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  ]"
                >
                  <span
                    :class="[
                      'w-2 h-2 rounded-full transition-all',
                      filters.statuses.includes(status.value) ? 'bg-current' : 'bg-slate-300'
                    ]"
                  ></span>
                  <span>{{ status.label }}</span>
                  <svg
                    v-if="filters.statuses.includes(status.value)"
                    class="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>


            <!-- Date Range Filter -->
            <div>
              <label class="text-xs font-bold text-slate-600 mb-2 block">Created At Range</label>
              <div class="flex flex-col md:flex-row md:items-center gap-3 md:gap-2">
                <div class="relative flex-1">
                   <input
                     v-model="filters.startDate"
                     type="date"
                     class="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                   />
                   <span class="absolute -top-1.5 left-2 bg-white px-1 text-[10px] font-bold text-slate-400">From</span>
                </div>
                <div class="relative flex-1">
                   <input
                     v-model="filters.endDate"
                     type="date"
                     class="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                   />
                   <span class="absolute -top-1.5 left-2 bg-white px-1 text-[10px] font-bold text-slate-400">To</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Clear Filters -->
          <button
            v-if="filters.merchantName || filters.statuses.length > 0 || filters.startDate || filters.endDate"
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
              {{ filters.merchantName || filters.statuses.length > 0 || filters.startDate || filters.endDate ? 'Try adjusting your filters' : 'No restock requests available' }}
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
                    <button
                      @click="openMapModal(restock)"
                      class="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group/map"
                      title="View on Google Maps"
                    >
                      <svg class="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </button>
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
              {{ filters.merchantName || filters.statuses.length > 0 || filters.startDate || filters.endDate ? 'Try adjusting your filters' : 'No restock requests available' }}
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
            <div class="flex items-center justify-between mb-2">
              <p class="text-xs font-bold text-slate-400 uppercase flex items-center space-x-1">
                <MapPinIcon class="w-3 h-3" />
                <span>Location</span>
              </p>
              <button
                @click="openMapModal(restock)"
                class="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                title="View on Google Maps"
              >
                <svg class="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </button>
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

    <!-- Map Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="isMapModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="closeMapModal"></div>
          
          <!-- Content -->
          <div class="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all">
            <!-- Header -->
            <div class="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 class="text-xl font-black text-slate-900 flex items-center space-x-2">
                  <svg class="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>Location Map</span>
                </h3>
                <p v-if="selectedLocation" class="text-xs text-slate-500 font-medium mt-1">
                  {{ selectedLocation.merchantName }}
                </p>
              </div>
              <button @click="closeMapModal" class="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                <XMarkIcon class="w-6 h-6" />
              </button>
            </div>

            <!-- Map Container -->
            <div class="relative" style="height: 500px;">
              <iframe
                v-if="selectedLocation"
                :src="getGoogleMapsEmbedUrl(selectedLocation.latitude, selectedLocation.longitude)"
                width="100%"
                height="100%"
                style="border:0;"
                :allowfullscreen="true"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <!-- Footer -->
            <div class="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div></div>
              <a
                v-if="selectedLocation"
                :href="getGoogleMapsDirectUrl(selectedLocation.latitude, selectedLocation.longitude)"
                target="_blank"
                rel="noopener noreferrer"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors flex items-center space-x-2"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
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

// Note: For production use, replace 'YOUR_GOOGLE_MAPS_API_KEY' with your actual API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8'; // Replace with your key

// Mock Data
interface RestockRecord {
  id: string;
  merchantId: string;
  merchantName: string;
  status: 'pending' | 'approved' | 'on delivery' | 'delivered' | 'cancelled';
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
// Map Modal State
const isMapModalOpen = ref(false);
const selectedLocation = ref<RestockRecord | null>(null);

// Status options for multi-select
const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'on delivery', label: 'On Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' }
];

const filters = ref({
  merchantName: '',
  statuses: [] as string[],
  startDate: '',
  endDate: ''
});

// Computed filtered restocks
const filteredRestocks = computed(() => {
  return mockRestocks.value.filter(restock => {
    const matchesMerchant = !filters.value.merchantName || 
      restock.merchantName.toLowerCase().includes(filters.value.merchantName.toLowerCase());
    
    const matchesStatus = filters.value.statuses.length === 0 || 
      filters.value.statuses.includes(restock.status);
    
    // Date Filtering
    let matchesDate = true;
    if (filters.value.startDate || filters.value.endDate) {
      const restockDate = new Date(restock.createdAt);
      const start = filters.value.startDate ? new Date(filters.value.startDate) : null;
      const end = filters.value.endDate ? new Date(filters.value.endDate) : null;
      
      if (start) {
        start.setHours(0, 0, 0, 0); // Start of day
        matchesDate = matchesDate && restockDate >= start;
      }
      
      if (end) {
        end.setHours(23, 59, 59, 999); // End of day
        matchesDate = matchesDate && restockDate <= end;
      }
    }
    
    return matchesMerchant && matchesStatus && matchesDate;
  });
});

// Helper functions
const clearFilters = () => {
  filters.value.merchantName = '';
  filters.value.statuses = [];
  filters.value.startDate = '';
  filters.value.endDate = '';
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'pending': 'bg-amber-100 text-amber-700',
    'approved': 'bg-blue-100 text-blue-700',
    'on delivery': 'bg-purple-100 text-purple-700',
    'delivered': 'bg-green-100 text-green-700',
    'cancelled': 'bg-red-100 text-red-700'
  };
  return classes[status] || 'bg-slate-100 text-slate-700';
};

const getStatusActiveClass = (status: string) => {
  const classes: Record<string, string> = {
    'pending': 'bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200',
    'approved': 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200',
    'on delivery': 'bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200',
    'delivered': 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200',
    'cancelled': 'bg-red-100 border-red-300 text-red-700 hover:bg-red-200'
  };
  return classes[status] || 'bg-slate-100 border-slate-300 text-slate-700';
};

const toggleStatus = (status: string) => {
  const index = filters.value.statuses.indexOf(status);
  if (index > -1) {
    filters.value.statuses.splice(index, 1);
  } else {
    filters.value.statuses.push(status);
  }
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

const openMapModal = (restock: RestockRecord) => {
  selectedLocation.value = restock;
  isMapModalOpen.value = true;
};

const closeMapModal = () => {
  isMapModalOpen.value = false;
  setTimeout(() => {
    selectedLocation.value = null;
  }, 300); // Wait for transition to complete
};

const getGoogleMapsEmbedUrl = (lat: number, lng: number) => {
  return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${lat},${lng}&zoom=15`;
};

const getGoogleMapsDirectUrl = (lat: number, lng: number) => {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active > div:last-child,
.modal-fade-leave-active > div:last-child {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from > div:last-child {
  transform: scale(0.95);
}

.modal-fade-leave-to > div:last-child {
  transform: scale(0.95);
}
</style>
