<template>
  <div class="card-premium relative overflow-hidden group">
    <!-- Status Badge -->
    <div :class="[
      'absolute top-0 right-0 px-4 py-1 rounded-bl-2xl text-[10px] font-bold tracking-widest uppercase',
      merchant.status === 'ON' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    ]">
      {{ merchant.status }}
    </div>

    <!-- Header -->
    <div class="flex items-center space-x-3 mb-4">
      <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
        <StoreFrontIcon class="w-6 h-6" />
      </div>
      <div>
        <h3 class="font-bold text-slate-900 leading-tight">{{ merchant.name }}</h3>
        <div class="flex items-center text-xs text-slate-400 mt-0.5">
          <MapPinIcon class="w-3 h-3 mr-1" />
          {{ merchant.position }}
        </div>
      </div>
    </div>

    <!-- Info Grid -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="p-3 bg-slate-50 rounded-xl">
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Stok Saat Ini</span>
        <div class="flex items-baseline space-x-1">
          <span :class="['text-xl font-bold', merchant.stock < 20 ? 'text-red-500' : 'text-slate-900']">
            {{ merchant.stock }}
          </span>
          <span class="text-xs text-slate-400">pcs</span>
        </div>
      </div>
      <div class="p-3 bg-slate-50 rounded-xl">
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Kas Harian</span>
        <div class="flex items-baseline space-x-1">
          <span class="text-lg font-bold text-slate-900">Rp{{ formatCash(merchant.cash) }}</span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-between border-t border-slate-50 pt-4">
      <div class="flex items-center space-x-2">
        <span class="text-xs font-semibold text-slate-500">Jadwal LIBUR:</span>
        <span class="text-xs font-bold text-orange-500">{{ merchant.offDays }} hari</span>
      </div>
      
      <div class="flex items-center">
        <Switch
          v-model="isMerchantOn"
          @update:model-value="toggleStatus"
          :class="isMerchantOn ? 'bg-green-500' : 'bg-slate-200'"
          class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        >
          <span class="sr-only">Toggle Merchant</span>
          <span
            aria-hidden="true"
            :class="isMerchantOn ? 'translate-x-5' : 'translate-x-0'"
            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
          />
        </Switch>
      </div>
    </div>
    
    <!-- Quick Actions Overlay (appear on hover on tablets, or always show some buttons) -->
    <div class="flex mt-4 space-x-2">
      <button class="flex-1 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-bold hover:bg-green-100 transition-colors">
        Setuju Restock
      </button>
      <button class="px-3 py-2 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors">
        Detail
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { BuildingStorefrontIcon as StoreFrontIcon, MapPinIcon } from '@heroicons/vue/24/outline';
import { Switch } from '@headlessui/vue';
import type { Merchant } from '../../../core/types';

const props = defineProps<{
  merchant: Merchant;
}>();

const emit = defineEmits(['toggle']);

const isMerchantOn = computed({
  get: () => props.merchant.status === 'ON',
  set: (_val) => emit('toggle', props.merchant.id)
});

const formatCash = (val: number) => {
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return (val / 1000).toFixed(0) + 'K';
  return val;
};

const toggleStatus = () => {
  // Logic handled by computed setter which emits toggle event
};
</script>
