<template>
  <div class="px-4 space-y-8 pb-24">
    <!-- Main Stepper Section -->
    <section>
      <div class="mb-4">
        <h2 class="text-xl font-bold text-slate-900">Alur Stok Harian</h2>
        <p class="text-xs text-slate-500 font-medium">Lengkapi langkah-langkah ini setiap pagi dan malam.</p>
      </div>
      
      <StockStepper :steps="['Pagi: Inisiasi', 'Malam: Penutupan']">
        <template #pagi>
          <div class="space-y-6">
            <h3 class="text-lg font-bold text-slate-900 border-l-4 border-green-500 pl-3">Inisiasi Pagi</h3>
            <div class="grid grid-cols-1 gap-4">
              <div v-for="product in stockStore.products" :key="product.id" class="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center overflow-hidden">
                    <img v-if="product.url" :src="product.url" class="w-full h-full object-cover">
                    <ArchiveBoxIcon v-else class="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-slate-800">{{ product.name }}</h4>
                    <p class="text-[10px] text-slate-400 font-bold uppercase">Stok: {{ product.stock }} pcs</p>
                  </div>
                </div>
                <input type="number" class="w-20 py-2 bg-white border-none rounded-xl text-center font-black text-green-600 shadow-sm" placeholder="Qty">
              </div>
            </div>
          </div>
        </template>
        
        <template #malam>
          <div class="space-y-6">
            <h3 class="text-lg font-bold text-slate-900 border-l-4 border-slate-900 pl-3">Penutupan Malam</h3>
            <div class="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center space-x-3">
              <div class="bg-green-100 p-2 rounded-full">
                <CheckCircleIcon class="w-5 h-5 text-green-600" />
              </div>
              <p class="text-xs font-medium text-green-800">Stok fisik sesuai dengan catatan sistem. Kerja bagus!</p>
            </div>
            
            <div class="space-y-4">
              <div class="p-5 bg-slate-900 rounded-3xl text-white shadow-xl">
                <label class="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1 block">Total Kas yang Terkumpul</label>
                <div class="flex items-center space-x-2">
                  <span class="text-2xl font-black text-white/40">Rp</span>
                  <input type="number" class="w-full bg-transparent border-none p-0 text-3xl font-black focus:ring-0 text-white placeholder-white/20" placeholder="0">
                </div>
              </div>
            </div>
          </div>
        </template>
      </StockStepper>
    </section>

    <!-- Product Management Section -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-xl font-bold text-slate-900">Manajemen Produk</h2>
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">KELOLA KATALOG ANDA</p>
        </div>
        <button 
          @click="openModal()" 
          class="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-xl transition-all shadow-md active:scale-95"
        >
          <PlusIcon class="w-4 h-4" />
          <span class="text-xs font-bold">Produk Baru</span>
        </button>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <div v-for="product in stockStore.products" :key="product.id" class="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-green-200 transition-colors">
          <div class="flex items-center space-x-4">
            <div class="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-50">
              <img v-if="product.url" :src="product.url" class="w-full h-full object-cover">
              <PhotoIcon v-else class="w-6 h-6 text-slate-300" />
            </div>
            <div>
              <h4 class="text-sm font-bold text-slate-800">{{ product.name }}</h4>
              <p class="text-[11px] text-slate-500 line-clamp-1 max-w-[150px]">{{ product.description }}</p>
              <div class="flex items-center space-x-2 mt-1">
                <span class="text-[10px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md">{{ product.currency }} {{ product.price.toLocaleString() }}</span>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Stok: {{ product.stock }}</span>
              </div>
            </div>
          </div>
          <button @click="openModal(product)" class="p-2 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded-xl transition-all">
            <PencilSquareIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>

    <!-- Monitoring Timeline -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-slate-900">Pemantauan</h2>
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">24 JAM TERAKHIR</span>
      </div>
      
      <div class="space-y-4">
        <div v-for="i in 3" :key="i" class="flex items-start space-x-4">
          <div class="flex flex-col items-center">
            <div class="w-2 h-2 rounded-full bg-green-500 mb-1"></div>
            <div class="w-0.5 h-16 bg-slate-100"></div>
          </div>
          <div class="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
            <div class="flex justify-between items-start mb-1">
              <h4 class="text-sm font-bold text-slate-800">Inisiasi Stok</h4>
              <span class="text-[10px] font-bold text-slate-400">10:4{{ i }} WIB</span>
            </div>
            <p class="text-xs text-slate-500">Merchant <strong>Toko Ahmad</strong> melakukan inisiasi stok pagi.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="closeModal"></div>
          
          <!-- Content -->
          <div class="relative w-full sm:max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden transform transition-all">
            <div class="p-6 pb-2 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 class="text-xl font-black text-slate-900">{{ isEditing ? 'Edit Produk' : 'Produk Baru' }}</h3>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ isEditing ? 'Perbarui data katalog' : 'Tambahkan produk ke katalog' }}</p>
              </div>
              <button @click="closeModal" class="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                <XMarkIcon class="w-6 h-6" />
              </button>
            </div>

            <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
              <div class="space-y-1">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Produk</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <ShoppingBagIcon class="w-4 h-4 text-slate-400" />
                  </div>
                  <input v-model="form.name" type="text" required class="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-green-500 transition-all text-slate-900" placeholder="Contoh: Kopi Susu">
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deskripsi</label>
                <textarea v-model="form.description" rows="2" class="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-green-500 transition-all text-slate-900" placeholder="Jelaskan produk singkat..."></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Harga (IDR)</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <CurrencyDollarIcon class="w-4 h-4 text-slate-400" />
                    </div>
                    <input v-model.number="form.price" type="number" required class="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-green-500 transition-all text-slate-900" placeholder="0">
                  </div>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stok Awal</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <ArchiveBoxIcon class="w-4 h-4 text-slate-400" />
                    </div>
                    <input v-model.number="form.stock" type="number" required class="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-green-500 transition-all text-slate-900" placeholder="0">
                  </div>
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL Gambar</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <PhotoIcon class="w-4 h-4 text-slate-400" />
                  </div>
                  <input v-model="form.url" type="url" class="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-green-500 transition-all text-slate-900" placeholder="https://...">
                </div>
              </div>

              <button type="submit" class="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-green-100 transition-all active:scale-[0.98] mt-4">
                {{ isEditing ? 'Simpan Perubahan' : 'Tambah Produk' }}
              </button>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { 
  ArchiveBoxIcon, 
  CheckCircleIcon, 
  PlusIcon, 
  PencilSquareIcon, 
  XMarkIcon, 
  PhotoIcon, 
  CurrencyDollarIcon,
  ShoppingBagIcon
} from '@heroicons/vue/24/outline';
import StockStepper from '../../../core/components/ui/StockStepper.vue';
import { useStockStore } from '../store';
import type { Product } from '../../../core/types';

const stockStore = useStockStore();

// Modal State
const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);

const initialForm = {
  name: '',
  description: '',
  price: 0,
  currency: 'IDR',
  stock: 0,
  url: ''
};

const form = reactive({ ...initialForm });

const openModal = (product?: Product) => {
  if (product) {
    isEditing.value = true;
    editingId.value = product.id;
    Object.assign(form, { ...product });
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

const handleSubmit = () => {
  if (isEditing.value && editingId.value !== null) {
    stockStore.updateProduct({ ...form, id: editingId.value });
  } else {
    stockStore.addProduct({ ...form });
  }
  closeModal();
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
