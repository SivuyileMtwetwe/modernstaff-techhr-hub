const LoaderOverlay = {
  template: `
        <div class="loader-overlay">
            <span class="loader"></span>
        </div>
    `,
};

// Initialize Data from Backend API
const initDataFromAPI = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) return;

    const response = await fetch("http://localhost:3000/api/employees", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      if (response.status === 403) {
        console.error("Access denied: User is not an admin");
        this.$router.push("/employee-dashboard");
      }
      return;
    }

    const employees = await response.json();
    localStorage.setItem("employees", JSON.stringify(employees));
  } catch (error) {
    console.error("Error initializing data:", error);
  }
};

function isTokenExpired(token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now(); // Convert to milliseconds
}

const token = localStorage.getItem("token");
if (!token || isTokenExpired(token)) {
    console.error("Token is missing or expired");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/"; // Redirect to login
}
// Add these functions to script.js
function getTokenExpiry(token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.exp * 1000; // Convert to milliseconds
}

async function refreshToken() {
  try {
      const response = await fetch("http://localhost:3000/api/auth/refresh", {
          method: "POST",
          headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
      });
      if (!response.ok) throw new Error("Token refresh failed");
      const { token: newToken } = await response.json();
      localStorage.setItem("token", newToken);
      startTokenRefreshTimer(newToken);
  } catch (error) {
      console.error("Token refresh error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
  }
}

function startTokenRefreshTimer(token) {
  const expiryTime = getTokenExpiry(token);
  const refreshTimeout = expiryTime - Date.now() - 300000; // 5 mins before expiry
  if (refreshTimeout > 0) {
      setTimeout(refreshToken, refreshTimeout);
  } else {
      refreshToken();
  }
}

// Call this after login and in app initialization
if (localStorage.getItem("token")) {
  startTokenRefreshTimer(localStorage.getItem("token"));
}


// Login Component
const Login = {
  components: {
    LoaderOverlay, // Register the component locally
  },
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
      isLoading: false,
    };
  },
  methods: {
    async login() {
      this.isLoading = true;
      try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }

        const data = await response.json();
        const { token, role, employee_id } = data;

        // Store token in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('employee_id', employee_id);

        // Redirect based on role
        if (role === 'admin') {
          this.$router.push('/admin-dashboard');
        } else {
          this.$router.push('/employee-dashboard');
        }
      } catch (error) {
        this.errorMessage = error.message || 'Login failed';
      } finally {
        this.isLoading = false;
      }
    },
  },
  template: `
    <div class="container">
      <LoaderOverlay v-if="isLoading" />
      <div class="logo-section">
        <img src="asserts/final logo .png">
        <h1>Modern Tech Solutions</h1>
        <p>Clientele centered</p>
      </div>
      <div class="form-section">
        <form @submit.prevent="login">
          <label for="email">Your Username</label>
          <input
            type="text"
            id="email"
            v-model="username"
            placeholder="Enter your username"
            required
          >
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Enter your password"
            required
          >
          <div class="options">
            <label>
              <input type="checkbox"> Remember Me
            </label>
            <a href="#">Recover Password</a>
          </div>
          <button type="submit">
            <i class="fa-solid fa-right-to-bracket"></i> Sign In
          </button>
          <p v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  `,
};

// Navigation Header Component
const NavigationHeader = {
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('employee_id');
      this.$router.push('/');
    },
  },
  template: `
    <div>
      <button @click="logout" class="btn btn-danger">
        <i class="fa-solid fa-right-from-bracket"></i> Logout
      </button>
    </div>
  `,
};
const PayrollManagement = {
  components: { NavigationHeader },
  data() {
      return { employees: [] };
  },
  async created() {
      await this.fetchEmployees();
  },
  methods: {
      async fetchEmployees() {
          try {
              const response = await fetch("http://localhost:3000/api/employees", {
                  headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`
                  }
              });
              if (!response.ok) throw new Error("Failed to fetch employees");
              this.employees = await response.json();
          } catch (error) {
              console.error("Error:", error);
          }
      },
      // ... rest of the methods
  },
  // ... template remains the same
};

const TimeOffRequests = {
  data() {
    return {
      leaveRequests: [],
    };
  },
  async mounted() {
    try {
      const response = await fetch('/api/leave', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch leave requests');
      }

      const data = await response.json();
      this.leaveRequests = data;
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  },
  methods: {
    async approveRequest(request) {
      try {
        const response = await fetch(`/api/leave/${request.leave_id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            status: 'Approved',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to approve request');
        }

        Swal.fire({
          icon: 'success',
          title: 'Request Approved',
          text: 'The leave request has been approved successfully.',
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to approve request',
        });
      }
    },
    async denyRequest(request) {
      try {
        const response = await fetch(`/api/leave/${request.leave_id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            status: 'Denied',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to deny request');
        }

        Swal.fire({
          icon: 'success',
          title: 'Request Denied',
          text: 'The leave request has been denied.',
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to deny request',
        });
      }
    },
  },
  template: `
    <div>
      <NavigationHeader />
      <h2>Time Off Requests</h2>
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
          <tr v-for="request in leaveRequests" :key="request.leave_id">
            <td>{{ request.employee_name }}</td>
            <td>{{ request.date }}</td>
            <td>{{ request.reason }}</td>
            <td>{{ request.status }}</td>
            <td>
              <button @click="approveRequest(request)" class="btn btn-success btn-sm me-2">
                <i class="fa-solid fa-check"></i> Approve
              </button>
              <button @click="denyRequest(request)" class="btn btn-danger btn-sm">
                <i class="fa-solid fa-xmark"></i> Reject
              </button>
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
      employees: [],
    };
  },
  async mounted() {
    try {
      const response = await fetch('/api/employees', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }

      const data = await response.json();
      this.employees = data;
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  },
  methods: {
    async saveAttendance(employee) {
      try {
        const response = await fetch('/api/attendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            employee_id: employee.employee_id,
            date: new Date().toISOString().split('T')[0],
            status: employee.attendanceStatus,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save attendance');
        }

        Swal.fire({
          icon: 'success',
          title: 'Attendance Saved',
          text: 'Attendance data saved successfully!',
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to save attendance',
        });
      }
    },
  },
  template: `
    <div>
      <NavigationHeader />
      <h2>Attendance Tracking</h2>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Department</th>
            <th>Attendance Records</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in employees" :key="employee.employee_id">
            <td>{{ employee.name }}</td>
            <td>{{ employee.department_name }}</td>
            <td>
              <select v-model="employee.attendanceStatus" class="form-control">
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
              <button @click="saveAttendance(employee)" class="btn btn-primary mt-2">
                <i class="fa-solid fa-save"></i> Save
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
};

const EmployeeDashboard = {
  data() {
    return {
      employee: {},
      timeOffReason: "",
      attendanceStatus: "Present",
    };
  },
  async mounted() {
    const employeeId = localStorage.getItem('employee_id');
    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch employee data');
      }

      const data = await response.json();
      this.employee = data;
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  },
  methods: {
    async markAttendance() {
      const today = new Date().toISOString().split('T')[0];
      try {
        const response = await fetch('/api/attendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            employee_id: this.employee.employee_id,
            date: today,
            status: this.attendanceStatus,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to mark attendance');
        }

        Swal.fire({
          icon: 'success',
          title: 'Attendance Marked',
          text: 'Attendance marked successfully!',
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to mark attendance',
        });
      }
    },
    async requestTimeOff() {
      if (!this.timeOffReason) {
        Swal.fire({
          icon: 'error',
          title: 'Incomplete Information',
          text: 'Please provide a reason for the time-off request.',
        });
        return;
      }
      try {
        const response = await fetch('/api/leave', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            employee_id: this.employee.employee_id,
            date: new Date().toISOString().split('T')[0],
            reason: this.timeOffReason,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to submit request');
        }

        Swal.fire({
          icon: 'success',
          title: 'Request Submitted',
          text: 'Time-off request submitted successfully!',
        });
        this.timeOffReason = '';
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to submit request',
        });
      }
    },
  },
  template: `
    <div>
      <NavigationHeader />
      <h2>Welcome, {{ employee.name }}</h2>
      <p><strong>Position:</strong> {{ employee.position }}</p>
      <p><strong>Department:</strong> {{ employee.department }}</p>
      <div class="mt-4">
        <h3>Mark Attendance</h3>
        <select v-model="attendanceStatus" class="form-control">
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
        <button @click="markAttendance" class="btn btn-primary mt-2">
          <i class="fa-solid fa-signature"></i> Mark Attendance
        </button>
      </div>
      <div class="mt-4">
        <h3>Request Time Off</h3>
        <textarea v-model="timeOffReason" class="form-control" placeholder="Reason for time-off"></textarea>
        <button @click="requestTimeOff" class="btn btn-primary mt-2">
          <i class="fa-solid fa-file-arrow-up"></i> Submit Request
        </button>
      </div>
    </div>
  `,
};
const DataVisualization = {
    mounted() {
      const ctx = document.getElementById("attendanceChart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Present", "Absent"],
          datasets: [
            {
              label: "# of Days",
              data: [20, 5],
              backgroundColor: ["#4caf50", "#f44336"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
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
          <div style="width: 400px; height: 300px; margin: 0 auto;">
            <canvas id="attendanceChart"></canvas>
          </div>
        </div>
      `,
  };

  const AdminDashboard = {
    data() {
      return {
        employees: [],
      };
    },
    async mounted() {
      try {
        const response = await fetch('/api/employees', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }
  
        const data = await response.json();
        this.employees = data;
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    },
    template: `
      <div>
        <NavigationHeader />
        <h2>Admin Dashboard</h2>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Salary</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employees" :key="employee.employee_id">
              <td>{{ employee.name }}</td>
              <td>{{ employee.position }}</td>
              <td>{{ employee.department_name }}</td>
              <td>{{ employee.salary }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
  };

// Employee Management Component (Admin)
// Employee Management Component
const EmployeeManagement = {
  components: {
    NavigationHeader,
  },
  data() {
    return {
      employees: [],
      newEmployee: {
        name: "",
        position: "",
        department: "",
        salary: "",
      },
    };
  },
  async created() {
    await this.fetchEmployees();
  },
  methods: {
    async fetchEmployees() {
      try {
        const response = await fetch("http://localhost:3000/api/employees", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch employees");
        this.employees = await response.json();
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    },
    async addEmployee() {
      try {
        const response = await fetch("http://localhost:3000/api/employees", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(this.newEmployee),
        });
        if (!response.ok) throw new Error("Failed to add employee");
        await this.fetchEmployees(); // Refresh the list
        this.newEmployee = { name: "", position: "", department: "", salary: "" };
      } catch (error) {
        console.error("Error adding employee:", error);
      }
    },
  },
  template: `
    <div>
      <NavigationHeader />
      <h2>Employee Management</h2>
      <div class="card mb-4">
        <div class="card-header">Add New Employee</div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-3">
              <input v-model="newEmployee.name" type="text" class="form-control" placeholder="Name" required>
            </div>
            <div class="col-md-3">
              <input v-model="newEmployee.position" type="text" class="form-control" placeholder="Position" required>
            </div>
            <div class="col-md-3">
              <input v-model="newEmployee.department" type="text" class="form-control" placeholder="Department" required>
            </div>
            <div class="col-md-3">
              <input v-model="newEmployee.salary" type="number" min="0" class="form-control" placeholder="Salary">
            </div>
          </div>
          <button @click="addEmployee" class="btn btn-primary mt-3">
            <i class="fa-solid fa-user-plus"></i> Add Employee
          </button>
        </div>
      </div>
      <table class="table table-striped">
        <thead>
          <tr>
            <th><i class="fa-solid fa-list-ol"></i> Name</th>
            <th><i class="fa-solid fa-briefcase"></i> Position</th>
            <th><i class="fa-solid fa-code-branch"></i> Department</th>
            <th><i class="fa-solid fa-sack-dollar"></i> Salary</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in employees" :key="employee.employeeId">
            <td>{{ employee.name }}</td>
            <td>{{ employee.position }}</td>
            <td>{{ employee.department }}</td>
            <td>{{ employee.salary }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
};


const LeaveStatusChart = {
    components: {
      NavigationHeader,
    },
    mounted() {
      const ctx = document.getElementById("leaveStatusChart").getContext("2d");
      const employees = JSON.parse(localStorage.getItem("employees") || "[]");
      const leaveStatuses = { Approved: 0, Pending: 0, Rejected: 0 };
  
      employees.forEach((emp) => {
        emp.leaveRequests.forEach((req) => {
          leaveStatuses[req.status] += 1;
        });
      });
  
      new Chart(ctx, {
        type: "pie",
        data: {
          labels: Object.keys(leaveStatuses),
          datasets: [
            {
              data: Object.values(leaveStatuses),
              backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
        },
      });
    },
    template: `
        <div>
        <NavigationHeader />
            <h2>Leave Request Status</h2>
            <div style="width: 400px; height: 300px; margin: 0 auto;">
              <canvas id="leaveStatusChart"></canvas>
            </div>
        </div>
    `,
  };

  const AttendanceTrendChart = {
    components: {
      NavigationHeader,
    },
    mounted() {
      const ctx = document.getElementById("attendanceTrendChart").getContext("2d");
      const employees = JSON.parse(localStorage.getItem("employees") || "[]");
      const attendanceCounts = { Present: 0, Absent: 0 };
  
      employees.forEach((emp) => {
        emp.attendance.forEach((att) => {
          attendanceCounts[att.status] += 1;
        });
      });
  
      new Chart(ctx, {
        type: "line",
        data: {
          labels: Object.keys(attendanceCounts),
          datasets: [
            {
              label: "Attendance Trend",
              data: Object.values(attendanceCounts),
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
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
        <NavigationHeader />
            <h2>Attendance Trends</h2>
            <div style="width: 500px; height: 300px; margin: 0 auto;">
              <canvas id="attendanceTrendChart"></canvas>
            </div>
        </div>
    `,
  };

  const SalaryChart = {
    components: {
      NavigationHeader,
    },
    mounted() {
      const ctx = document.getElementById("salaryChart").getContext("2d");
      const employees = JSON.parse(localStorage.getItem("employees") || "[]");
      const departments = employees.reduce((acc, emp) => {
        acc[emp.department] = (acc[emp.department] || 0) + emp.salary;
        return acc;
      }, {});
  
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(departments),
          datasets: [
            {
              label: "Total Salary",
              data: Object.values(departments),
              backgroundColor: "#4caf50",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
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
        <NavigationHeader />
            <h2>Department-Wise Salary</h2>
            <div style="width: 500px; height: 300px; margin: 0 auto;">
              <canvas id="salaryChart"></canvas>
            </div>
        </div>
    `,
  };

// Router Configuration
const routes = [
  { path: "/", component: Login },
  {
    path: "/employees",
    component: EmployeeManagement,
    meta: { role: "admin" },
  },
  { path: "/payroll", component: PayrollManagement, meta: { role: "admin" } },
  { path: "/time-off", component: TimeOffRequests, meta: { role: "admin" } },
  {
    path: "/attendance",
    component: AttendanceTracking,
    meta: { role: "admin" },
  },
  {
    path: "/visualization",
    component: DataVisualization,
    meta: { role: "admin" },
  },
  {
    path: "/employee-dashboard",
    component: EmployeeDashboard,
    meta: { role: "employee" },
  },
  { path: "/salary-visualization", component: SalaryChart },
  { path: "/attendance-trends", component: AttendanceTrendChart },
  { path: "/leave-status", component: LeaveStatusChart },
  {
    path: "/admin-dashboard",
    component: AdminDashboard,
    meta: { role: "admin" },
  },
];


const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  
  // 1. Redirect to login if accessing protected route without token
  if (to.meta.role && !token) {
    next("/");
    return;
  }

  // 2. Check role mismatch
  if (to.meta.role && to.meta.role !== user.role) {
    next("/");
    return;
  }

  next();
});

// Vue App
const app = Vue.createApp({
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user") || "{}"),
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.user = {};
      this.$router.push("/");
    },
  },
  mounted() {
    const token = localStorage.getItem("token");
    if (token && getTokenExpiry(token) < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }
    initDataFromAPI();
},
  template: `
    <div>
      <router-view></router-view>
    </div>
  `,
});

app.use(router);
app.mount("#app");

