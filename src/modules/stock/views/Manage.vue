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
  </div>
</template>

<script setup lang="ts">
import { 
  ArchiveBoxIcon, 
  CheckCircleIcon
} from '@heroicons/vue/24/outline';
import StockStepper from '../../../core/components/ui/StockStepper.vue';
import { useStockStore } from '../store';

const stockStore = useStockStore();
</script>
