// Initialize Data from JSON File
const initDataFromJSON = async () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    users.push({ role: "admin", password: "123admin!123", username: "HRAdmin" })
    // Add admin credentials
    if (!users.some(u => u.role === 'admin')) {
   ;
      localStorage.setItem('users', JSON.stringify(users));
    }
  
    // Skip loading from JSON if employees already exist
    if (employees.length > 0) return;
  
    try {
      const response = await fetch('data/employeeData.json');
      if (!response.ok) throw new Error(`Failed to fetch employee data: ${response.status}`);
  
      const data = await response.json();
      const loadedEmployees = data.employeeData.map(employee => {
        const username = employee.name.toLowerCase().replace(/\s+/g, '.') + '.' + employee.employeeId;
        const password = 'emp' + Math.floor(1000 + Math.random() * 9000);
        users.push({ username, password, role: 'employee', employeeId: employee.employeeId });
  
        return {
          ...employee,
          username,
          password,
          attendance: employee.attendance || [], // Initialize attendance if missing
          leaveRequests: employee.leaveRequests || [], // Initialize leave requests if missing
        };
      });
  
      localStorage.setItem('employees', JSON.stringify(loadedEmployees));
      localStorage.setItem('users', JSON.stringify(users));
      console.log('Employee data initialized from JSON.');
    } catch (error) {
      console.error('Error initializing employee data:', error);
    }
  };
  

// Login Component
const Login = {
    data() {
      return { username: '', password: '', errorMessage: '' };
    },
    methods: {
      login() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === this.username && u.password === this.password);
  
        if (user) {
          localStorage.setItem('loggedInUser', JSON.stringify(user));
          this.$router.push(user.role === 'admin' ? '/employees' : '/employee-dashboard');
        } else {
          this.errorMessage = 'Invalid credentials';
        }
      }
    },
    template: `
      <div class="mt-5">
        <h2>Login</h2>
        <form @submit.prevent="login">
          <div class="mb-3">
            <input v-model="username" type="text" placeholder="Username" class="form-control" required />
          </div>
          <div class="mb-3">
            <input v-model="password" type="password" placeholder="Password" class="form-control" required />
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
        <p class="text-danger mt-2">{{ errorMessage }}</p>
      </div>
    `,
  };
  
const PayrollManagement = {
    data() {
      return {
        employees: JSON.parse(localStorage.getItem('employees') || '[]'),
      };
    },
    methods: {
      calculateGrossSalary(employee) {
        return (employee.hoursWorked || 0) * (employee.hourlyRate || 0);
      },
    },
    template: `
      <div>
        <h2>Payroll Management</h2>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Hours Worked</th>
              <th>Hourly Rate</th>
              <th>Gross Salary</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employees" :key="employee.employeeId">
              <td>{{ employee.name }}</td>
              <td><input type="number" v-model="employee.hoursWorked" class="form-control" /></td>
              <td><input type="number" v-model="employee.hourlyRate" class="form-control" /></td>
              <td>{{ calculateGrossSalary(employee) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
  };
  

  const TimeOffRequests = {
    data() {
      return {
        timeOffRequests: JSON.parse(localStorage.getItem('timeOffRequests') || '[]'),
      };
    },
    methods: {
      approveRequest(request) {
        request.status = 'Approved';
        this.saveRequests();
      },
      denyRequest(request) {
        request.status = 'Denied';
        this.saveRequests();
      },
      saveRequests() {
        localStorage.setItem('timeOffRequests', JSON.stringify(this.timeOffRequests));
      },
    },
    template: `
      <div>
        <h2>Time Off Requests</h2>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Request Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in timeOffRequests" :key="request.id">
              <td>{{ request.employeeName }}</td>
              <td>{{ request.date }}</td>
              <td>{{ request.reason }}</td>
              <td>{{ request.status }}</td>
              <td>
                <button @click="approveRequest(request)" class="btn btn-success btn-sm">Approve</button>
                <button @click="denyRequest(request)" class="btn btn-danger btn-sm">Deny</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
  };
  
  const AttendanceTracking = {
    data() {
      return {
        attendanceData: JSON.parse(localStorage.getItem('attendanceData') || '[]'),
      };
    },
    methods: {
      saveAttendance() {
        localStorage.setItem('attendanceData', JSON.stringify(this.attendanceData));
        alert('Attendance data saved successfully!');
      },
    },
    template: `
      <div>
        <h2>Attendance Tracking</h2>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="attendance in attendanceData" :key="attendance.id">
              <td>{{ attendance.employeeName }}</td>
              <td>{{ attendance.date }}</td>
              <td>
                <select v-model="attendance.status" class="form-control">
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <button @click="saveAttendance" class="btn btn-primary mt-3">Save Attendance</button>
      </div>
    `,
  };
  

  const DataVisualization = {
    mounted() {
      const ctx = document.getElementById('attendanceChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Present', 'Absent'],
          datasets: [
            {
              label: '# of Days',
              data: [20, 5], // Replace with dynamic data
              backgroundColor: ['#4caf50', '#f44336'],
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
    template: `
      <div>
        <h2>Attendance Report</h2>
        <canvas id="attendanceChart"></canvas>
      </div>
    `,
  };

  const AdminDashboard = {
    data() {
      return {
        employees: JSON.parse(localStorage.getItem('employees') || '[]'),
      };
    },
    methods: {
      approveTimeOff(employeeId, request) {
        request.status = 'Approved';
        this.saveEmployees();
      },
      rejectTimeOff(employeeId, request) {
        request.status = 'Rejected';
        this.saveEmployees();
      },
      saveEmployees() {
        localStorage.setItem('employees', JSON.stringify(this.employees));
      },
    },
    template: `
      <div>
        <h2>Admin Dashboard</h2>
  
        <h3>Time Off Requests</h3>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employees" :key="employee.employeeId">
              <template v-for="request in employee.leaveRequests" :key="request.date">
                  <td>{{ employee.name }}</td>
                  <td>{{ request.date }}</td>
                  <td>{{ request.reason }}</td>
                  <td>{{ request.status }}</td>
                  <td>
                    <button v-if="request.status === 'Pending'" 
                      @click="approveTimeOff(employee.employeeId, request)" class="btn btn-success btn-sm">Approve</button>
                    <button v-if="request.status === 'Pending'" 
                      @click="rejectTimeOff(employee.employeeId, request)" class="btn btn-danger btn-sm">Reject</button>
                  </td>
                </>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    `,
  };
  
  
  

// Employee Management Component (Admin)
const EmployeeManagement = {
    data() {
        return {
            employees: JSON.parse(localStorage.getItem('employees') || '[]')
        };
    },
    methods: {
        regenerateCredentials(employee) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const password = 'emp' + Math.floor(1000 + Math.random() * 9000);

            // Update credentials in the users array
            const user = users.find(u => u.employeeId === employee.employeeId);
            if (user) {
                user.password = password;
            } else {
                users.push({ username: employee.username, password, role: 'employee', employeeId: employee.employeeId });
            }

            // Update employee data
            employee.password = password;

            // Save updated data to localStorage
            localStorage.setItem('employees', JSON.stringify(this.employees));
            localStorage.setItem('users', JSON.stringify(users));

            alert(`Credentials updated. New Password: ${password}`);
        }
    },
    template: `
        <div>
            <h2>Employee Management</h2>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Department</th>
                        <th>Salary</th>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="employee in employees" :key="employee.employeeId">
                        <td>{{ employee.name }}</td>
                        <td>{{ employee.position }}</td>
                        <td>{{ employee.department }}</td>
                        <td>{{ employee.salary }}</td>
                        <td>{{ employee.username }}</td>
                        <td>{{ employee.password }}</td>
                        <td>
                            <button @click="regenerateCredentials(employee)" class="btn btn-sm btn-warning">Reset Password</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `
};

const EmployeeDashboard = {
    data() {
      return {
        employee: {}, // Current logged-in employee
        timeOffReason: '',
        attendanceStatus: 'Present',
      };
    },
    mounted() {
      const user = JSON.parse(localStorage.getItem('loggedInUser'));
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      this.employee = employees.find(emp => emp.employeeId === user.employeeId) || {};
    },
    methods: {
      markAttendance() {
        const today = new Date().toISOString().split('T')[0];
        if (this.employee.attendance.some(att => att.date === today)) {
          alert('Attendance for today is already marked.');
          return;
        }
  
        this.employee.attendance.push({ date: today, status: this.attendanceStatus });
        this.saveEmployeeData();
        alert('Attendance marked successfully!');
      },
      requestTimeOff() {
        if (!this.timeOffReason) {
          alert('Please provide a reason for the time-off request.');
          return;
        }
  
        this.employee.leaveRequests.push({
          date: new Date().toISOString().split('T')[0],
          reason: this.timeOffReason,
          status: 'Pending',
        });
        this.saveEmployeeData();
        alert('Time-off request submitted successfully!');
        this.timeOffReason = '';
      },
      saveEmployeeData() {
        const employees = JSON.parse(localStorage.getItem('employees') || '[]');
        const index = employees.findIndex(emp => emp.employeeId === this.employee.employeeId);
        if (index > -1) employees[index] = this.employee;
        localStorage.setItem('employees', JSON.stringify(employees));
      },
    },
    template: `
      <div>
        <h2>Welcome, {{ employee.name }}</h2>
        <p><strong>Position:</strong> {{ employee.position }}</p>
        <p><strong>Department:</strong> {{ employee.department }}</p>
  
        <div class="mt-4">
          <h3>Mark Attendance</h3>
          <select v-model="attendanceStatus" class="form-control">
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
          <button @click="markAttendance" class="btn btn-primary mt-2">Mark Attendance</button>
        </div>
  
        <div class="mt-4">
          <h3>Request Time Off</h3>
          <textarea v-model="timeOffReason" class="form-control" placeholder="Reason for time-off"></textarea>
          <button @click="requestTimeOff" class="btn btn-primary mt-2">Submit Request</button>
        </div>
      </div>
    `,
  };
  
  const Sidebar = {
    props: ['user'],
    methods: {
      logout() {
        localStorage.removeItem('loggedInUser');
        this.$router.push('/');
      },
    },
    template: `
      <div class="d-flex flex-column flex-shrink-0 p-3 bg-light" style="width: 250px; height: 100vh;">
        <h5 class="mb-3">ModernTech HR</h5>
        <ul class="nav nav-pills flex-column mb-auto">
          <!-- Admin Links -->
          <li v-if="user.role === 'admin'">
            <router-link to="/admin-dashboard" class="nav-link">Dashboard</router-link>
          </li>
          <li v-if="user.role === 'admin'">
            <router-link to="/employees" class="nav-link">Employees</router-link>
          </li>
          <li v-if="user.role === 'admin'">
            <router-link to="/time-off" class="nav-link">Time Off Requests</router-link>
          </li>
          <li v-if="user.role === 'admin'">
            <router-link to="/attendance" class="nav-link">Attendance</router-link>
          </li>
          <li v-if="user.role === 'admin'">
            <router-link to="/payroll" class="nav-link">Payroll</router-link>
          </li>
  
          <!-- Employee Links -->
          <li v-if="user.role === 'employee'">
            <router-link to="/employee-dashboard" class="nav-link">Dashboard</router-link>
          </li>
        </ul>
        <hr />
        <button class="btn btn-danger w-100" @click="logout">Logout</button>
      </div>
    `,
  };
  
  const Navbar = {
  props: ['user'], // Pass the logged-in user as a prop
  methods: {
    logout() {
      localStorage.removeItem('loggedInUser');
      this.$router.push('/');
    },
  },
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">ModernTech HR</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <!-- Admin Links -->
            <li class="nav-item" v-if="user.role === 'admin'">
              <router-link to="/admin-dashboard" class="nav-link">Dashboard</router-link>
            </li>
            <li class="nav-item" v-if="user.role === 'admin'">
              <router-link to="/employees" class="nav-link">Employees</router-link>
            </li>
            <li class="nav-item" v-if="user.role === 'admin'">
              <router-link to="/time-off" class="nav-link">Time Off Requests</router-link>
            </li>
            <li class="nav-item" v-if="user.role === 'admin'">
              <router-link to="/attendance" class="nav-link">Attendance</router-link>
            </li>
            <li class="nav-item" v-if="user.role === 'admin'">
              <router-link to="/payroll" class="nav-link">Payroll</router-link>
            </li>

            <!-- Employee Links -->
            <li class="nav-item" v-if="user.role === 'employee'">
              <router-link to="/employee-dashboard" class="nav-link">Dashboard</router-link>
            </li>
          </ul>
          <button class="btn btn-danger" @click="logout">Logout</button>
        </div>
      </div>
    </nav>
  `,
};

    

// Router Configuration
const routes = [
    { path: '/', component: Login },
    { path: '/employees', component: EmployeeManagement, meta: { role: 'admin' } },
    { path: '/payroll', component: PayrollManagement, meta: { role: 'admin' } },
    { path: '/time-off', component: AdminDashboard, meta: { role: 'admin' } },
    { path: '/attendance', component: AttendanceTracking, meta: { role: 'admin' } },
    { path: '/visualization', component: DataVisualization, meta: { role: 'admin' } },
    { path: '/employee-dashboard', component: EmployeeDashboard, meta: { role: 'employee' } },
    // { path: '/admin-dashboard', component: AdminDashboard, meta: { role: 'admin' } }
  ];
  
  const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
  });
  

router.beforeEach((to, from, next) => {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    if (to.meta.role && to.meta.role !== user.role) {
        next('/');
    } else {
        next();
    }
});

// Vue App
const app = Vue.createApp({
    data() {
      return { user: JSON.parse(localStorage.getItem('loggedInUser') || '{}') };
    },
    components: {
      Navbar,
      Sidebar, // Optional if you want a sidebar instead of a navbar
    },
    methods: {
      logout() {
        localStorage.removeItem('loggedInUser');
        this.user = {};
        this.$router.push('/');
      },
    },
    mounted() {
      initDataFromJSON(); // Initialize data from JSON
    },
    template: `
      <div>
        <Navbar v-if="user.username" :user="user" />
        <!-- Sidebar can replace Navbar if needed -->
        <router-view></router-view>
      </div>
    `,
  });
  

// Use Router
app.use(router);
app.mount('#app');
