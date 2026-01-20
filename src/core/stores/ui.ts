import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Notification } from '../types';

export const useUIStore = defineStore('ui', () => {
  const notifications = ref<Notification[]>([
    // { id: 1, title: 'Peringatan Stok Rendah', message: 'Cahaya Rejeki memerlukan restock segera.', type: 'warning', timestamp: '2026-01-04T10:00:00Z' },
    // { id: 2, title: 'Permintaan Baru', message: 'Toko Ahmad meminta 50 unit.', type: 'info', timestamp: '2026-01-04T08:31:00Z' },
  ]);

  const addNotification = (notif: Omit<Notification, 'id'>) => {
    const id = notifications.value.length + 1;
    notifications.value.unshift({ ...notif, id });
  };

  const clearNotifications = () => {
    notifications.value = [];
  };

  return {
    notifications,
    addNotification,
    clearNotifications
  };
});
