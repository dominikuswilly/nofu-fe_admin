<template>
  <div class="card-premium flex flex-col justify-between">
    <div class="flex items-center justify-between mb-2">
      <div :class="['p-2 rounded-xl', colorClass]">
        <component :is="icon" class="w-6 h-6" />
      </div>
      <span v-if="trend" :class="[
        'text-xs font-bold px-2 py-0.5 rounded-full',
        trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      ]">
        {{ trend > 0 ? '+' : '' }}{{ trend }}%
      </span>
    </div>
    
    <div>
      <h3 class="text-slate-500 text-sm font-medium">{{ label }}</h3>
      <div class="flex items-baseline space-x-2 mt-1">
        <span class="text-2xl font-bold text-slate-900">{{ value }}</span>
        <span v-if="suffix" class="text-xs text-slate-400 font-medium">{{ suffix }}</span>
      </div>
    </div>
    
    <div v-if="progress" class="mt-4">
      <div class="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1">
        <span>Target</span>
        <span>{{ progress }}%</span>
      </div>
      <div class="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          class="h-full bg-green-500 rounded-full transition-all duration-500"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  label: string;
  value: string | number;
  icon: Component;
  colorClass: string;
  trend?: number;
  suffix?: string;
  progress?: number;
}>();
</script>
