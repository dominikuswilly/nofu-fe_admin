<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <Header />
    
    <main class="flex-1 pt-24 pb-20 overflow-x-hidden">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <BottomNav />
    
    <!-- FAB -->
    <button class="btn-fab group">
      <PlusIcon class="w-6 h-6 mr-1" />
      <span class="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap">
        {{ fabLabel }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PlusIcon } from '@heroicons/vue/24/solid';
import Header from './core/layout/Header.vue';
import BottomNav from './core/layout/BottomNav.vue';
const fabLabel = computed(() => {
  const hour = new Date().getHours();
  return hour < 12 ? 'Inisiasi Baru' : 'Restock Baru';
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
