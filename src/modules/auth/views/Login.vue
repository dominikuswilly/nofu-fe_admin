<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-600 text-white shadow-lg shadow-green-200 mb-6">
        <BuildingStorefrontIcon class="w-10 h-10" />
      </div>
      <h2 class="text-3xl font-black text-slate-900 tracking-tight">MerchantStock</h2>
      <p class="mt-2 text-sm text-slate-500 font-medium">Panel Administrasi Lapangan</p>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-10 px-8 shadow-2xl shadow-slate-200/50 rounded-3xl border border-slate-100">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div v-if="errorMessage" class="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-bold flex items-center shadow-sm">
            <ExclamationCircleIcon class="w-5 h-5 mr-2 flex-shrink-0" />
            {{ errorMessage }}
          </div>
          <div>
            <label for="username" class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Username</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UserIcon class="h-5 w-5 text-slate-300" />
              </div>
              <input 
                id="username" 
                v-model="username"
                type="text" 
                required 
                class="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all font-medium text-slate-900 placeholder-slate-300"
                placeholder="Masukkan username"
              >
            </div>
          </div>

          <div>
            <label for="password" class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Kata Sandi</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LockClosedIcon class="h-5 w-5 text-slate-300" />
              </div>
              <input 
                id="password" 
                v-model="password"
                type="password" 
                required 
                class="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all font-medium text-slate-900 placeholder-slate-300"
                placeholder="••••••••"
              >
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-green-600 focus:ring-green-500 border-slate-300 rounded-lg">
              <label for="remember-me" class="ml-2 block text-sm text-slate-500 font-bold">Ingat saya</label>
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              :disabled="isLoading"
              class="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-green-100 text-sm font-black text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'MEMPROSES...' : 'MASUK KE DASHBOARD' }}
            </button>
          </div>
        </form>

        <div class="mt-8">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-slate-100"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-slate-400 font-medium italic">v1.0.0 - Dev</span>
            </div>
          </div>
        </div>
      </div>
      
      <p class="mt-8 text-center text-xs text-slate-400">
        &copy; PT. Bengkel Fajar Jaya. <br>
        Semua Hak Dilindungi.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { BuildingStorefrontIcon, UserIcon, LockClosedIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline';
import { SHA512 } from 'crypto-js';
import { httpClient } from '../../../core/api/httpClient';
import { API_CONFIG } from '../../../core/api/config';

const router = useRouter();
const username = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  if (!username.value || !password.value) return;
  
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const hashedPassword = SHA512(password.value).toString();
    
    await httpClient.post(`${API_CONFIG.customerApi}/admins/login`, {
      username: username.value,
      password: hashedPassword
    });

    router.push('/dashboard');
  } catch (error: any) {
    errorMessage.value = error.message || 'Gagal masuk. Periksa kembali username dan password Anda.';
  } finally {
    isLoading.value = false;
  }
};
</script>
