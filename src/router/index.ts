import { createRouter, createWebHistory } from 'vue-router';
import { isTokenValid } from '../core/utils/auth';

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
    path: '/products',
    name: 'Products',
    component: () => import('../modules/products/views/Catalog.vue')
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

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token');

  if (to.name !== 'Login' && !isTokenValid(token)) {
    // If not on login page and token is invalid/expired, redirect to login
    localStorage.removeItem('token'); // Clear invalid token
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
