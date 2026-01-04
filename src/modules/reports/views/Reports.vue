<template>
  <div class="px-4 space-y-6">
    <!-- Reports Tabs -->
    <div class="flex space-x-1 bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
      <button 
        v-for="tab in ['Kas Harian', 'Penjualan', 'Bulanan']" 
        :key="tab"
        @click="activeTab = tab"
        :class="[
          'flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all',
          activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Daily Cash Table -->
    <div v-if="activeTab === 'Kas Harian'" class="card-premium overflow-hidden !p-0">
      <div class="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <h3 class="font-bold text-slate-900">Laporan Kas Merchant</h3>
        <ArrowDownTrayIcon class="w-5 h-5 text-green-600 cursor-pointer" />
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50">
              <th class="p-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter">Merchant</th>
              <th class="p-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter text-right">Cash</th>
              <th class="p-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter text-center">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="m in merchantStore.merchants" :key="m.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="p-4 text-sm font-bold text-slate-700">{{ m.name }}</td>
              <td class="p-4 text-sm font-bold text-slate-900 text-right">Rp{{ m.cash.toLocaleString() }}</td>
              <td class="p-4 text-center">
                <span :class="['text-[10px] font-black px-2 py-0.5 rounded-full', m.cash > 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400']">
                  {{ m.cash > 0 ? 'PAID' : 'EMPTY' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Sales Charts Mock -->
    <div v-if="activeTab === 'Penjualan'" class="space-y-6">
      <div class="card-premium">
        <h3 class="font-bold text-slate-900 mb-6">Total Penjualan</h3>
        <div class="flex items-end justify-between h-40 space-x-2">
          <div v-for="h in [40, 65, 30, 85, 45, 90, 70]" :key="h" class="flex-1 flex flex-col items-center">
            <div 
              class="w-full bg-green-500 rounded-lg animate-in slide-in-from-bottom duration-1000" 
              :style="{ height: `${h}%` }"
            ></div>
            <span class="text-[8px] font-bold text-slate-400 mt-2 uppercase">Hari</span>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div class="card-premium flex flex-col items-center justify-center py-8">
          <div class="w-20 h-20 rounded-full border-8 border-green-500 border-t-transparent animate-spin-slow"></div>
          <p class="mt-4 text-xs font-bold text-slate-500">Target Capaian</p>
          <span class="text-lg font-black text-slate-900">92%</span>
        </div>
        <div class="card-premium flex flex-col items-center justify-center py-8">
          <div class="w-20 h-20 rounded-full border-8 border-emerald-600 border-l-transparent -rotate-45"></div>
          <p class="mt-4 text-xs font-bold text-slate-500">Pertumbuhan</p>
          <span class="text-lg font-black text-emerald-600">+14%</span>
        </div>
      </div>
    </div>

    <!-- Monthly Report Mock -->
    <div v-if="activeTab === 'Bulanan'" class="space-y-4">
      <div v-for="month in ['Desember 2025', 'November 2025']" :key="month" class="card-premium flex items-center justify-between border-l-4 border-green-500">
        <div>
          <h4 class="font-bold text-slate-800">{{ month }}</h4>
          <p class="text-xs text-slate-400">Total Restock: 142 Permintaan</p>
        </div>
        <button class="flex items-center space-x-2 text-xs font-black text-slate-900 border-2 border-slate-100 px-4 py-2 rounded-xl active:bg-slate-50">
          <ArrowDownTrayIcon class="w-4 h-4" />
          <span>EKSPOR</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ArrowDownTrayIcon } from '@heroicons/vue/24/outline';
import { useMerchantStore } from '../../merchants/store';

const merchantStore = useMerchantStore();
const activeTab = ref('Kas Harian');
</script>

<style scoped>
.animate-spin-slow {
  animation: spin 3s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
