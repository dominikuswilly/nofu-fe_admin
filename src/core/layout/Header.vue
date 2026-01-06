<template>
  <header class="fixed top-0 left-0 right-0 h-12 z-50 bg-white shadow-sm px-4 flex flex-col justify-center">
    <!-- Top row -->
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center space-x-2">
        <span class="font-bold text-xl text-green-600">MerchantStock</span>
        <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">Admin</span>
      </div>
      
      <div class="flex items-center space-x-4">
        <!-- Notification Bell -->
        <div class="relative group z-10">
          <button @click="showNotifications = !showNotifications" class="p-2 rounded-full hover:bg-slate-100 transition-colors relative">
            <BellIcon class="w-6 h-6 text-slate-600" />
            <span v-if="notificationCount > 0" class="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
              {{ notificationCount }}
            </span>
          </button>
          
          <NotificationDropdown v-if="showNotifications" @close="showNotifications = false" />
        </div>

        <!-- Hamburger button -->
        <Menu as="div" class="relative inline-block text-left z-10">
          <div>
            <MenuButton class="p-2 rounded-full hover:bg-slate-100 transition-colors">
              <Bars3Icon class="w-6 h-6 text-slate-600" />
            </MenuButton>
          </div>
          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-slate-100 rounded-xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none overflow-hidden">
              <div class="px-1 py-1">
                <MenuItem v-slot="{ active }">
                  <router-link to="/products" :class="[active ? 'bg-green-50 text-green-700' : 'text-slate-700', 'group flex w-full items-center rounded-lg px-2 py-2 text-sm']">
                    <ShoppingBagIcon class="mr-2 h-5 w-5" :class="active ? 'text-green-600' : 'text-slate-400'" />
                    Kelola Produk
                  </router-link>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <router-link to="/merchants" :class="[active ? 'bg-green-50 text-green-700' : 'text-slate-700', 'group flex w-full items-center rounded-lg px-2 py-2 text-sm']">
                    <BuildingStorefrontIcon class="mr-2 h-5 w-5" :class="active ? 'text-green-600' : 'text-slate-400'" />
                    Kelola Merchant
                  </router-link>
                </MenuItem> 
                <!-- <MenuItem v-slot="{ active }">
                  <router-link to="/admins" :class="[active ? 'bg-green-50 text-green-700' : 'text-slate-700', 'group flex w-full items-center rounded-lg px-2 py-2 text-sm']">
                    <UserPlusIcon class="mr-2 h-5 w-5" :class="active ? 'text-green-600' : 'text-slate-400'" />
                    Kelola Admin
                  </router-link>
                </MenuItem> -->
              </div>
              <div class="px-1 py-1">
                <!-- <MenuItem v-slot="{ active }">
                  <button :class="[active ? 'bg-green-50 text-green-700' : 'text-slate-700', 'group flex w-full items-center rounded-lg px-2 py-2 text-sm']">
                    <UserCircleIcon class="mr-2 h-5 w-5" :class="active ? 'text-green-600' : 'text-slate-400'" />
                    Profil
                  </button>
                </MenuItem> -->
                <!-- <MenuItem v-slot="{ active }">
                  <button :class="[active ? 'bg-green-50 text-green-700' : 'text-slate-700', 'group flex w-full items-center rounded-lg px-2 py-2 text-sm']">
                    <Cog6ToothIcon class="mr-2 h-5 w-5" :class="active ? 'text-green-600' : 'text-slate-400'" />
                    Pengaturan (WIB)
                  </button>
                </MenuItem> -->
              </div>
              <div class="px-1 py-1">
                <MenuItem v-slot="{ active }">
                  <button @click="handleLogout" :class="[active ? 'bg-red-50 text-red-700' : 'text-slate-700', 'group flex w-full items-center rounded-lg px-2 py-2 text-sm']">
                    <ArrowLeftOnRectangleIcon class="mr-2 h-5 w-5" :class="active ? 'text-red-600' : 'text-slate-400'" />
                    Keluar
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </div>
    </div>

    <!-- Search bar (Merchant name filter) -->
    <!-- <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon class="h-4 w-4 text-slate-400" />
      </div>
      <input
        type="text"
        placeholder="Cari merchant..."
        class="block w-full pl-10 pr-3 py-2 bg-slate-50 border-none rounded-xl text-sm placeholder-slate-400 focus:ring-2 focus:ring-green-500 transition-all shadow-inner"
      />
    </div> -->
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  BellIcon, 
  Bars3Icon, 
  // MagnifyingGlassIcon,
  // UserCircleIcon,
  // Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ShoppingBagIcon,
  // UserPlusIcon,
  BuildingStorefrontIcon
} from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import NotificationDropdown from './NotificationDropdown.vue';
import { useUIStore } from '../stores/ui';

const uiStore = useUIStore();
const router = useRouter();
const showNotifications = ref(false);
const notificationCount = computed(() => uiStore.notifications.length);

const handleLogout = () => {
  localStorage.clear();
  sessionStorage.clear();
  router.push('/login');
};
</script>
