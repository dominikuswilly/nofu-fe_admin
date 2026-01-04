import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', redirect: '/dashboard' },
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: () => import('../modules/dashboard/views/Dashboard.vue') 
  },
  { 
    path: '/merchants', 
    name: 'Merchants', 
    component: () => import('../modules/merchants/views/List.vue') 
  },
  { 
    path: '/stock', 
    name: 'Stock', 
    component: () => import('../modules/stock/views/Manage.vue') 
  },
  { 
    path: '/reports', 
    name: 'Reports', 
    component: () => import('../modules/reports/views/Reports.vue') 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
