<template>
  <div class="px-4 space-y-8 pb-24">
    <!-- Merchant Management Section -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-xl font-bold text-slate-900">Kelola Merchant</h2>
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">DAFTAR MITRA MERCHANT</p>
        </div>
        <button 
          @click="openModal()" 
          class="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-xl transition-all shadow-md active:scale-95"
        >
          <PlusIcon class="w-4 h-4" />
          <span class="text-xs font-bold">Merchant Baru</span>
        </button>
      </div>

      <!-- Search bar -->
      <div class="relative mb-6">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon class="h-4 w-4 text-slate-400" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari merchant..."
          class="block w-full pl-10 pr-3 py-3 bg-white border border-slate-100 rounded-2xl text-sm placeholder-slate-400 focus:ring-2 focus:ring-green-500 transition-all shadow-sm font-bold"
        />
      </div>

      <div class="grid grid-cols-1 gap-4">
        <div v-for="merchant in filteredMerchants" :key="merchant.id" class="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-green-200 transition-colors">
          <div class="flex items-center space-x-4">
            <div class="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-50">
              <BuildingStorefrontIcon class="w-6 h-6 text-slate-300" />
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h4 class="text-sm font-bold text-slate-800">{{ merchant.name }}</h4>
                <span v-if="!merchant.active" class="text-[8px] font-black bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Nonaktif</span>
                <span v-else class="text-[8px] font-black bg-green-50 text-green-500 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Aktif</span>
              </div>
              <p class="text-[11px] text-slate-500">{{ merchant.email || '-' }} • {{ merchant.phone || '-' }}</p>
              <p class="text-[10px] font-bold text-slate-400 mt-0.5">@{{ merchant.username }}</p>
            </div>
          </div>
          <button @click="openModal(merchant)" class="p-2 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded-xl transition-all">
            <PencilSquareIcon class="w-5 h-5" />
          </button>
        </div>
        
        <div v-if="filteredMerchants.length === 0" class="py-20 text-center text-slate-400">
          <p class="text-sm">Merchant tidak ditemukan.</p>
        </div>
      </div>
    </section>

    <!-- Merchant Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="closeModal"></div>
          
          <!-- Content -->
          <div class="relative w-full sm:max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden transform transition-all">
            <div class="p-6 pb-2 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 class="text-xl font-black text-slate-900">{{ isEditing ? 'Edit Merchant' : 'Merchant Baru' }}</h3>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ isEditing ? 'Perbarui data mitra' : 'Tambahkan mitra merchant baru' }}</p>
              </div>
              <button @click="closeModal" class="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                <XMarkIcon class="w-6 h-6" />
              </button>
            </div>

            <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
              <div class="space-y-1">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Merchant</label>
                <input v-model="form.name" type="text" required class="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-green-500 transition-all text-slate-900" placeholder="Contoh: Toko Berkah">
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                  <input v-model="form.username" type="text" required class="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-green-500 transition-all text-slate-900" placeholder="username123">
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                  <input v-model="form.phone" type="tel" required class="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-green-500 transition-all text-slate-900" placeholder="0812...">
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <input v-model="form.email" type="email" required class="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-green-500 transition-all text-slate-900" placeholder="email@domain.com">
              </div>

              <div class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    <component :is="form.active ? CheckCircleIcon : XCircleIcon" :class="['w-5 h-5', form.active ? 'text-green-500' : 'text-slate-300']" />
                  </div>
                  <div>
                    <p class="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Status Aktif</p>
                    <p class="text-[10px] font-bold text-slate-400 mt-0.5">{{ form.active ? 'Merchant dapat login & berjualan' : 'Merchant dibekukan sementara' }}</p>
                  </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="form.active" class="sr-only peer">
                  <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              <button type="submit" class="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-green-100 transition-all active:scale-[0.98] mt-4">
                {{ isEditing ? 'Simpan Perubahan' : 'Tambah Merchant' }}
              </button>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { 
  BuildingStorefrontIcon, 
  PlusIcon,
  PencilSquareIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline';
import { useMerchantStore } from '../store';
import type { Merchant } from '../../../core/types';

const merchantStore = useMerchantStore();

onMounted(() => {
  merchantStore.fetchMerchants();
});

const searchQuery = ref('');
const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref<string | number | null>(null);

const initialForm = {
  name: '',
  phone: '',
  email: '',
  username: '',
  active: true,
  status: 'ON' as const,
  stock: 0,
  cash: 0,
  offDays: 0,
  position: '-'
};

const form = reactive({ ...initialForm });

const filteredMerchants = computed(() => {
  return merchantStore.merchants.filter(m => 
    m.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    m.username.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const openModal = (merchant?: Merchant) => {
  if (merchant) {
    isEditing.value = true;
    editingId.value = merchant.id;
    Object.assign(form, { ...merchant });
  } else {
    isEditing.value = false;
    editingId.value = null;
    Object.assign(form, { ...initialForm });
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleSubmit = async () => {
  try {
    if (isEditing.value && editingId.value !== null) {
      await merchantStore.updateMerchant({ ...form, id: editingId.value } as Merchant);
    } else {
      // password will be included automatically by the store (default: "nofurider")
      await merchantStore.addMerchant({ ...form } as Merchant);
    }
    closeModal();
  } catch (error: any) {
    alert(error.message || 'Terjadi kesalahan');
  }
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

.modal-fade-enter-active div:last-child {
  animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-leave-active div:last-child {
  animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse;
}

@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@media (min-width: 640px) {
  .modal-fade-enter-active div:last-child {
    animation: scale-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .modal-fade-leave-active div:last-child {
    animation: scale-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse;
  }
}

@keyframes scale-up {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>

