<template>
  <div class="w-full">
    <div class="flex items-center mb-8">
      <div v-for="(step, index) in steps" :key="index" class="flex items-center flex-1 last:flex-none">
        <div class="flex flex-col items-center relative">
          <div :class="[
            'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
            currentStep >= index ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-slate-200 text-slate-400'
          ]">
            <component v-if="currentStep > index" :is="CheckIcon" class="w-6 h-6" />
            <span v-else class="font-bold">{{ index + 1 }}</span>
          </div>
          <span :class="[
            'absolute -bottom-6 w-max text-[10px] font-bold uppercase tracking-wider',
            currentStep >= index ? 'text-green-600' : 'text-slate-400'
          ]">
            {{ step }}
          </span>
        </div>
        <div v-if="index < steps.length - 1" :class="[
          'flex-1 h-0.5 mx-4 transition-all duration-500',
          currentStep > index ? 'bg-green-500' : 'bg-slate-100'
        ]"></div>
      </div>
    </div>

    <div class="mt-12 bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-50 min-h-[300px] flex flex-col">
      <div v-if="currentStep === 0" class="animate-in fade-in slide-in-from-right-4 duration-300">
        <slot name="pagi">
          <h3 class="text-xl font-bold text-slate-900 mb-2">Pagi: Inisiasi</h3>
          <p class="text-slate-500 text-sm mb-6">Input stok awal sebelum memulai penjualan.</p>
          <div class="space-y-4">
            <div v-for="i in 3" :key="i" class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div>
                <p class="font-bold text-slate-800 text-sm">Produk {{ i }}</p>
                <p class="text-xs text-slate-400">Saat ini: {{ 10 * i }}</p>
              </div>
              <input type="number" class="w-20 bg-white border-none rounded-xl text-center font-bold text-green-600 shadow-sm py-2" value="0">
            </div>
          </div>
        </slot>
      </div>

      <div v-if="currentStep === 1" class="animate-in fade-in slide-in-from-right-4 duration-300">
        <slot name="malam">
          <h3 class="text-xl font-bold text-slate-900 mb-2">Malam: Penutupan</h3>
          <p class="text-slate-500 text-sm mb-6">Cek fisik dan input total kas hari ini.</p>
          <div class="space-y-4">
            <div class="p-4 bg-red-50 rounded-2xl border border-red-100 mb-4">
              <p class="text-xs font-bold text-red-600 uppercase mb-1">Peringatan</p>
              <p class="text-sm text-red-800">Pastikan semua transaksi telah diselesaikan.</p>
            </div>
            <div class="p-4 bg-slate-50 rounded-2xl">
              <label class="block text-xs font-bold text-slate-400 uppercase mb-2 text-center">Input Kas Fisik</label>
              <div class="flex items-center bg-white rounded-xl shadow-inner px-4 py-3 border-2 border-slate-100 focus-within:border-green-500 transition-colors">
                <span class="font-bold text-slate-400 mr-2">Rp</span>
                <input type="number" class="flex-1 border-none focus:ring-0 font-bold text-2xl text-slate-900 p-0" placeholder="0">
              </div>
            </div>
          </div>
        </slot>
      </div>

      <div class="mt-auto pt-8 flex items-center justify-between">
        <button 
          @click="currentStep--" 
          v-if="currentStep > 0"
          class="px-6 py-3 text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors"
        >
          Kembali
        </button>
        <div v-else></div>
        
        <button 
          @click="currentStep++" 
          class="px-8 py-3 bg-green-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-green-200 hover:bg-green-600 active:scale-95 transition-all"
        >
          {{ currentStep === steps.length - 1 ? 'Selesai & Simpan' : 'Lanjutkan' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CheckIcon } from '@heroicons/vue/24/solid';

const props = defineProps<{
  steps: string[];
}>();

const currentStep = ref(0);
</script>
