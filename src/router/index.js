
import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import EmployeeDashboard from '@/components/employee/EmployeeDashboard.vue'
import EmployeeManagement from '@/components/admin/EmployeeManagement.vue'
import PayrollManagement from '@/components/admin/PayrollManagement.vue'
import TimeOffRequests from '@/components/admin/TimeOffRequests.vue'
import AttendanceTracking from '@/components/admin/AttendanceTracking.vue'
import SalaryChart from '@/components/charts/SalaryChart.vue'
import AttendanceTrendChart from '@/components/charts/AttendanceTrendChart.vue'
import LeaveStatusChart from '@/components/charts/LeaveStatusChart.vue'

const routes = [
  { path: '/', component: Login },
  { 
    path: '/admin-dashboard', 
    component: AdminDashboard,
    meta: { role: 'admin' }
  },
  { 
    path: '/employee-dashboard', 
    component: EmployeeDashboard,
    meta: { role: 'employee' }
  },
  // ... other routes
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}')
  if (to.meta.role && to.meta.role !== user.role) {
    next('/')
  } else {
    next()
  }
})

export default router