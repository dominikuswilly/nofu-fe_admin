<template>
  <div class="px-4 space-y-6">
    <!-- Inline Tabs -->
    <div class="flex space-x-1 bg-slate-100 p-1 rounded-xl">
      <button 
        v-for="tab in tabs" 
        :key="tab"
        @click="activeTab = tab"
        :class="[
          'flex-1 py-2 text-xs font-bold rounded-lg transition-all',
          activeTab === tab ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Merchant List -->
    <div class="space-y-4">
      <transition-group name="list">
        <MerchantCard 
          v-for="merchant in filteredMerchants" 
          :key="merchant.id" 
          :merchant="merchant"
          @toggle="merchantStore.toggleStatus"
        />
      </transition-group>
      
      <div v-if="filteredMerchants.length === 0" class="py-20 text-center text-slate-400">
        <p class="text-sm">Merchant tidak ditemukan.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import MerchantCard from '../components/MerchantCard.vue';
import { useMerchantStore } from '../store';

const merchantStore = useMerchantStore();
const activeTab = ref('Jadwal');
const tabs = ['Jadwal', 'Posisi', 'Aksi', 'Restock'];

// Mock search query (should come from Header via a store or event)
// For this template, we can just filter all if query is empty
const searchQuery = ref(''); 

const filteredMerchants = computed(() => {
  return merchantStore.merchants.filter(m => 
    m.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
