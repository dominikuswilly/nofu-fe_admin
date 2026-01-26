<template>
  <nav class="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-100 flex items-center justify-around z-50 px-2">
    <template v-for="item in navItems" :key="item.path">
      <!-- Standard Link -->
      <router-link 
        v-if="!item.children"
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

      <!-- Dropdown Wrapper -->
      <div 
        v-else 
        class="flex flex-col items-center justify-center space-y-1 relative h-full flex-1 cursor-pointer"
        @click="toggleMenu(item.name)"
      >
        <!-- Active Indicator for Parent (if any child is active) -->
        <div 
          v-if="isChildActive(item)" 
          class="absolute top-0 left-0 right-0 h-0.5 bg-green-500 animate-in fade-in slide-in-from-top-1"
        ></div>

        <component 
          :is="item.icon" 
          class="w-6 h-6 transition-colors" 
          :class="isChildActive(item) ? 'text-green-500' : 'text-slate-400'"
        />
        
        <span 
          class="text-[10px] font-medium transition-colors"
          :class="isChildActive(item) ? 'text-green-600' : 'text-slate-400'"
        >
          {{ item.name }}
        </span>

        <!-- Dropdown Menu -->
        <div 
          v-if="activeMenu === item.name"
          class="absolute bottom-full mb-2 bg-white rounded-lg shadow-xl border border-slate-100 py-1 min-w-[120px] left-1/2 -translate-x-1/2 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          <router-link
            v-for="child in item.children"
            :key="child.path"
            :to="child.path"
            class="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-green-600 whitespace-nowrap"
            active-class="bg-green-50 text-green-600"
          >
            {{ child.name }}
          </router-link>
        </div>
      </div>
    </template>
  </nav>
  
  <!-- Backdrop for clicking outside -->
  <div 
    v-if="activeMenu" 
    class="fixed inset-0 z-40 bg-transparent"
    @click="activeMenu = null"
  ></div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { 
  HomeIcon, 
  UserGroupIcon, 
  ArchiveBoxIcon, 
  ChartBarIcon 
} from '@heroicons/vue/24/outline';

const route = useRoute();
const activeMenu = ref<string | null>(null);

const navItems = [
  { name: 'Beranda', path: '/dashboard', icon: HomeIcon },
  { name: 'Merchant', path: '/merchants', icon: UserGroupIcon },
  { 
    name: 'Stok', 
    path: '/stock', 
    icon: ArchiveBoxIcon,
    children: [
      { name: 'Stok', path: '/stock' },
      { name: 'Restok', path: '/restock' }
    ]
  },
  { name: 'Laporan', path: '/reports', icon: ChartBarIcon },
];

const toggleMenu = (name: string) => {
  if (activeMenu.value === name) {
    activeMenu.value = null;
  } else {
    activeMenu.value = name;
  }
};

const isChildActive = (item: any) => {
  if (!item.children) return false;
  return item.children.some((child: any) => child.path === route.path);
};
</script>
