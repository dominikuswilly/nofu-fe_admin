<template>
  <div class="absolute right-0 mt-2 w-80 bg-white shadow-2xl rounded-2xl border border-slate-100 overflow-hidden ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
    <div class="p-4 border-b border-slate-100 flex items-center justify-between">
      <h3 class="font-bold text-slate-800">Notifikasi</h3>
      <button @click="uiStore.clearNotifications()" class="text-xs text-green-600 hover:text-green-700 font-medium">Hapus semua</button>
    </div>
    
    <div class="max-h-96 overflow-y-auto">
      <div v-if="notifications.length === 0" class="p-8 text-center text-slate-400">
        <BellSlashIcon class="w-8 h-8 mx-auto mb-2 opacity-20" />
        <p class="text-sm">Tidak ada notifikasi baru</p>
      </div>
      
      <div v-for="notif in notifications" :key="notif.id" class="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex space-x-3 cursor-pointer">
        <div :class="[
          'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
          notif.type === 'warning' ? 'bg-yellow-100 text-yellow-600' : 
          notif.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
        ]">
          <component :is="getIcon(notif.type)" class="w-5 h-5" />
        </div>
        <div>
          <h4 class="text-sm font-semibold text-slate-800">{{ notif.title }}</h4>
          <p class="text-xs text-slate-500 line-clamp-2 mt-0.5">{{ notif.message }}</p>
          <span class="text-[10px] text-slate-400 mt-1 block">{{ formatTime(notif.timestamp) }}</span>
        </div>
      </div>
    </div>
    
    <div class="p-3 bg-slate-50 text-center">
      <button class="text-xs font-semibold text-slate-500 hover:text-slate-700">Lihat semua riwayat</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { 
  BellSlashIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon 
} from '@heroicons/vue/24/outline';
import { useUIStore } from '../stores/ui';

const uiStore = useUIStore();
const notifications = computed(() => uiStore.notifications);

const getIcon = (type: string) => {
  switch (type) {
    case 'warning': return ExclamationTriangleIcon;
    case 'error': return XCircleIcon;
    default: return InformationCircleIcon;
  }
};

const formatTime = (ts: string) => {
  const date = new Date(ts);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
</script>
