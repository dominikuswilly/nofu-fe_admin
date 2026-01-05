<template>
  <div class="px-4 space-y-8 pb-24">
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
              <img v-if="product.url" :src="product.url" @error="(e) => (e.target as HTMLImageElement).style.display = 'none'" class="w-full h-full object-cover">
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
import { ref, reactive, onMounted } from 'vue'; // Added onMounted
import { 
  ArchiveBoxIcon, 
  PlusIcon, 
  PencilSquareIcon, 
  XMarkIcon, 
  PhotoIcon, 
  CurrencyDollarIcon,
  ShoppingBagIcon
} from '@heroicons/vue/24/outline';
import { useStockStore } from '../../stock/store'; // Adjusted path
import type { Product } from '../../../core/types';

const stockStore = useStockStore();

// Fetch products on mount
onMounted(() => {
  stockStore.fetchProducts();
});

// Modal State
const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null); // Changed to string

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

const handleSubmit = async () => {
  try {
    if (isEditing.value && editingId.value !== null) {
      await stockStore.updateProduct({ ...form, id: editingId.value } as Product);
    } else {
      await stockStore.addProduct({ ...form } as Product);
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
