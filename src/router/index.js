import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from '@/views/UserLogin.vue';
import EmployeeList from '@/views/employee/EmployeeList.vue';
import PayrollDashboard from '@/modules/payroll/PayrollDashboard.vue';
import { auth } from '@/stores/authStore';
import MainDashboard from '@/views/MainDashboard.vue';
const routes = [
  { path: '/', name: 'Login', component: UserLogin }, 
  { path: '/dashboard', name: 'Dashboard', component: MainDashboard},
  { path: '/employees', name: 'EmployeeList', component: EmployeeList },
  { path: '/payroll', name: 'PayrollDashboard', component: PayrollDashboard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !auth.isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;