<template>
  <nav class="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-100 flex items-center justify-around z-50 px-2">
    <router-link 
      v-for="item in navItems" 
      :key="item.path" 
      :to="item.path"
      class="flex flex-col items-center justify-center space-y-1 relative h-full flex-1"
      v-slot="{ isActive }"
    >
      <div 
        v-if="isActive" 
        class="absolute top-0 left-0 right-0 h-0.5 bg-green-500 animate-in fade-in slide-in-from-top-1"
      ></div>
      
      <component 
        :is="item.icon" 
        class="w-6 h-6 transition-colors" 
        :class="isActive ? 'text-green-500' : 'text-slate-400'"
      />
      
      <span 
        class="text-[10px] font-medium transition-colors"
        :class="isActive ? 'text-green-600' : 'text-slate-400'"
      >
        {{ item.name }}
      </span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { 
  HomeIcon, 
  UserGroupIcon, 
  ArchiveBoxIcon, 
  ChartBarIcon 
} from '@heroicons/vue/24/outline';

const navItems = [
  { name: 'Beranda', path: '/dashboard', icon: HomeIcon },
  { name: 'Merchant', path: '/merchants', icon: UserGroupIcon },
  { name: 'Stok', path: '/stock', icon: ArchiveBoxIcon },
  { name: 'Laporan', path: '/reports', icon: ChartBarIcon },
];
</script>
