import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../modules/auth/views/Login.vue')
  },
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
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
