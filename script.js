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
      const response = await fetch('https://sivuyilemtwetwe.github.io/modernstaff-techhr-hub/');
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
    return { 
      username: '', 
      password: '', 
      errorMessage: '' 
    };
  },
  methods: {
    login() {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.username === this.username && u.password === this.password);

      if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        this.$router.push(user.role === 'admin' ? '/admin-dashboard' : '/employee-dashboard');
      } else {
        this.errorMessage = 'Invalid credentials';
      }
    }
  },
  template: `
  <div class="container">
      <!-- Left Logo Section -->
      <div class="logo-section">
      <img src="asserts/final logo .png">
          <h1>ModernTech HR</h1>
          <p>Clientele centered</p>
      </div>

      <!-- Right Form Section -->
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

              <button type="submit">Sign In</button>
              
              <p v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</p>
          </form>
      </div>
  </div>
  `,
  styles: `
  <style>
      body {
          margin: 0;
          height: 100vh;
          background: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
      }

      .container {
          display: flex;
          width: 200%;
          height: 600px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          border-radius: 10px;
      }

      /* Left Section: Logo */
      .logo-section {
          width: 120%;
          background-color: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
      }

      .logo-section h1 {
          font-size: 32px;
          color: #003366;
          font-weight: bold;
          margin-bottom: 10px;
      }

      .logo-section p {
          font-size: 14px;
          color: #555555;
      }

      /* Right Section: Diagonal Form Section */
      .form-section {
          position: relative;
          width: 174%;
          background-color: #003366;
          clip-path: polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
      }

      form {
          width: 70%;
          background-color: rgba(255, 255, 255, 0.95);
          padding: 60px;
          border-radius: 3px;
          box-shadow: 0 5px 10px rgba(0, 0, 0.2, 0.2);
      }

      form label {
          font-size: 14px;
          font-weight: bold;
          color: #003366;
          margin-bottom: 5px;
          display: block;
      }

      form input:not([type="checkbox"]) {
          width: 100%;
          padding: 12px;
          margin-bottom: 30px;
          border: 1px solid #ccc;
          border-radius: 5px;
      }

      .options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #555555;
      }

      .options a {
          color: #1e90ff;
          text-decoration: none;
      }

      button {
          width: 100%;
          padding: 12px;
          background-color: #1e90ff;
          border: none;
          border-radius: 5px;
          color: white;
          font-size: 16px;
          cursor: pointer;
      }

      button:hover {
          background-color: #0056b3;
      }
  </style>
  `
};

const NavigationHeader = {
  methods: {
      goBack() {
          this.$router.go(-1);
      },
      logout() {
          localStorage.removeItem('loggedInUser');
          this.$router.push('/');
      }
  },
  template: `
      <div class="d-flex justify-content-between align-items-center p-3 bg-light mb-4">
          <button @click="goBack" class="btn btn-secondary">
              <i class="bi bi-arrow-left"></i> Back
          </button>
          <button @click="logout" class="btn btn-danger">
              <i class="bi bi-box-arrow-right"></i> Logout
          </button>
      </div>
  `
};
const PayrollManagement = {
  components: {
    NavigationHeader
},
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
       <NavigationHeader />
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
    components: {
        NavigationHeader
    },
    data() {
        return {
            timeOffRequests: [],
            employees: JSON.parse(localStorage.getItem('employees') || '[]')
        };
    },
    created() {
        // Aggregate all leave requests from employees
        this.timeOffRequests = this.employees.reduce((requests, employee) => {
            const employeeRequests = (employee.leaveRequests || []).map(request => ({
                ...request,
                employeeName: employee.name,
                employeeId: employee.employeeId
            }));
            return [...requests, ...employeeRequests];
        }, []);
    },
    methods: {
        approveRequest(request) {
            // Find employee and update their leave request
            const employee = this.employees.find(emp => emp.employeeId === request.employeeId);
            if (employee) {
                const requestIndex = employee.leaveRequests.findIndex(req => 
                    req.date === request.date && req.reason === request.reason
                );
                if (requestIndex !== -1) {
                    employee.leaveRequests[requestIndex].status = 'Approved';
                    // Update in local storage
                    localStorage.setItem('employees', JSON.stringify(this.employees));
                    // Update in component state
                    this.timeOffRequests = this.timeOffRequests.map(req => 
                        req === request ? { ...req, status: 'Approved' } : req
                    );
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Request Approved',
                        text: 'The leave request has been approved successfully.'
                    });
                }
            }
        },
        denyRequest(request) {
            // Find employee and update their leave request
            const employee = this.employees.find(emp => emp.employeeId === request.employeeId);
            if (employee) {
                const requestIndex = employee.leaveRequests.findIndex(req => 
                    req.date === request.date && req.reason === request.reason
                );
                if (requestIndex !== -1) {
                    employee.leaveRequests[requestIndex].status = 'Rejected';
                    // Update in local storage
                    localStorage.setItem('employees', JSON.stringify(this.employees));
                    // Update in component state
                    this.timeOffRequests = this.timeOffRequests.map(req => 
                        req === request ? { ...req, status: 'Rejected' } : req
                    );
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Request Denied',
                        text: 'The leave request has been rejected.'
                    });
                }
            }
        }
    },
    template: `
        <div class="container-fluid">
            <NavigationHeader />
            <div class="card">
                <div class="card-header">
                    <h2>Time Off Requests</h2>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
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
                                <tr v-for="request in timeOffRequests" :key="request.date + request.employeeId">
                                    <td>{{ request.employeeName }}</td>
                                    <td>{{ new Date(request.date).toLocaleDateString() }}</td>
                                    <td>{{ request.reason }}</td>
                                    <td>
                                        <span :class="{
                                            'badge': true,
                                            'bg-warning': request.status === 'Pending',
                                            'bg-success': request.status === 'Approved',
                                            'bg-danger': request.status === 'Rejected'
                                        }">
                                            {{ request.status }}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            @click="approveRequest(request)" 
                                            class="btn btn-success btn-sm me-2"
                                            :disabled="request.status !== 'Pending'"
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            @click="denyRequest(request)" 
                                            class="btn btn-danger btn-sm"
                                            :disabled="request.status !== 'Pending'"
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="timeOffRequests.length === 0">
                                    <td colspan="5" class="text-center">No time off requests found.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `
};
  
  const AttendanceTracking = {
    components: {
      NavigationHeader
  },
    data() {
        return {
            employees: JSON.parse(localStorage.getItem('employees') || '[]'),
        };
    },
    computed: {
        // Group attendance data by employee
        employeesWithAttendance() {
            return this.employees.filter(emp => emp.attendance && emp.attendance.length > 0);
        }
    },
    methods: {
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString();
        },
        getStatusClass(status) {
            return {
                'badge': true,
                'bg-success': status === 'Present',
                'bg-danger': status === 'Absent',
                'bg-warning': status === 'Late'
            };
        },
        saveAttendance() {
            localStorage.setItem('employees', JSON.stringify(this.employees));
            Swal.fire({
                icon: 'success',
                title: 'Data Saved',
                text: 'Attendance data saved successfully!'
            });
        }
    },
    template: `
     <NavigationHeader />
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title">Attendance Tracking</h2>
                        </div>
                        <div class="card-body">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Employee Name</th>
                                        <th>Department</th>
                                        <th>Attendance Records</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="employee in employeesWithAttendance" :key="employee.employeeId">
                                        <td>{{ employee.name }}</td>
                                        <td>{{ employee.department }}</td>
                                        <td>
                                            <table class="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="record in employee.attendance" 
                                                        :key="record.date + employee.employeeId">
                                                        <td>{{ formatDate(record.date) }}</td>
                                                        <td>
                                                            <span :class="getStatusClass(record.status)">
                                                                {{ record.status }}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td colspan="2">
                                                            <div class="d-flex justify-content-between align-items-center">
                                                                <small>
                                                                    Total Records: {{ employee.attendance.length }}
                                                                </small>
                                                                <div>
                                                                    <small>
                                                                        Present: {{ employee.attendance.filter(a => a.status === 'Present').length }}
                                                                    </small>
                                                                    <small class="ms-2">
                                                                        Absent: {{ employee.attendance.filter(a => a.status === 'Absent').length }}
                                                                    </small>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};

const EmployeeDashboard = {
  components: {
    NavigationHeader
},
  data() {
    return {
      employee: {}, // Current logged-in employee
      timeOffReason: '',
      attendanceStatus: 'Present',
      paySlipModal: false,
      paySlipStartDate: '',
      paySlipEndDate: '',
      generatedPaySlip: null
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
        Swal.fire({
            icon: 'warning',
            title: 'Attendance Already Marked',
            text: 'Attendance for today is already marked.'
        });
        return;
    }
    
    // After marking attendance
    Swal.fire({
        icon: 'success',
        title: 'Attendance Marked',
        text: 'Attendance marked successfully!'
    });

      this.employee.attendance.push({ date: today, status: this.attendanceStatus });
      this.saveEmployeeData();
      
      // Update attendance data in localStorage
      const attendanceData = JSON.parse(localStorage.getItem('attendanceData') || '[]');
      attendanceData.push({
        employeeName: this.employee.name,
        date: today,
        status: this.attendanceStatus
      });
      // localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
      
      // alert('Attendance marked successfully!');
    },
    requestTimeOff() {
      if (!this.timeOffReason) {
        Swal.fire({
            icon: 'error',
            title: 'Incomplete Information',
            text: 'Please provide a reason for the time-off request.'
        });
        return;
    }
    
    // After submitting time off request
    Swal.fire({
        icon: 'success',
        title: 'Request Submitted',
        text: 'Time-off request submitted successfully!'
    });

      this.employee.leaveRequests.push({
        date: new Date().toISOString().split('T')[0],
        reason: this.timeOffReason,
        status: 'Pending',
      });
      this.saveEmployeeData();
      // alert('Time-off request submitted successfully!');
      this.timeOffReason = '';
    },
    saveEmployeeData() {
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      const index = employees.findIndex(emp => emp.employeeId === this.employee.employeeId);
      if (index > -1) employees[index] = this.employee;
      localStorage.setItem('employees', JSON.stringify(employees));
    },
    generatePaySlip() {
      // Validate date range
      if (!this.paySlipStartDate || !this.paySlipEndDate) {
        Swal.fire({
            icon: 'error',
            title: 'Incomplete Information',
            text: 'Please select both start and end dates'
        });
        return;
    }

      const startDate = new Date(this.paySlipStartDate);
      const endDate = new Date(this.paySlipEndDate);

      // Calculate days worked
      const attendanceInPeriod = this.employee.attendance.filter(att => {
        const attDate = new Date(att.date);
        return attDate >= startDate && attDate <= endDate && att.status === 'Present';
      });

      // Calculate working days
      const workingDays = attendanceInPeriod.length;

      // Calculate gross salary (assuming hourly rate)
      const hourlyRate = this.employee.hourlyRate || 20; // Default hourly rate
      const hoursWorked = workingDays * 8; // Assuming 8-hour workday
      const grossSalary = hoursWorked * hourlyRate;

      // Basic tax calculation (simplified)
      const taxRate = 0.2; // 20% tax rate
      const tax = grossSalary * taxRate;
      const netSalary = grossSalary - tax;

      // Generate pay slip
      this.generatedPaySlip = {
        employeeName: this.employee.name,
        employeeId: this.employee.employeeId,
        department: this.employee.department,
        position: this.employee.position,
        startDate: this.paySlipStartDate,
        endDate: this.paySlipEndDate,
        workingDays: workingDays,
        hourlyRate: hourlyRate,
        hoursWorked: hoursWorked,
        grossSalary: grossSalary.toFixed(2),
        taxRate: (taxRate * 100) + '%',
        tax: tax.toFixed(2),
        netSalary: netSalary.toFixed(2)
      };

      // Optional: Save pay slip to employee's records
      if (!this.employee.paySlips) {
        this.employee.paySlips = [];
      }
      this.employee.paySlips.push(this.generatedPaySlip);
      this.saveEmployeeData();
    },
    printPaySlip() {
      if (!this.generatedPaySlip) return;

      const printContent = `
        <html>
          <head>
            <title>Pay Slip</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
              .pay-slip { border: 1px solid #ddd; padding: 20px; }
              .header { text-align: center; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
              .details { margin-top: 20px; }
              .details div { margin-bottom: 10px; }
            </style>
          </head>
          <body>
            <div class="pay-slip">
              <div class="header">
                <h2>Pay Slip</h2>
                <p>Pay Period: ${this.generatedPaySlip.startDate} to ${this.generatedPaySlip.endDate}</p>
              </div>
              <div class="details">
                <div><strong>Name:</strong> ${this.generatedPaySlip.employeeName}</div>
                <div><strong>Employee ID:</strong> ${this.generatedPaySlip.employeeId}</div>
                <div><strong>Department:</strong> ${this.generatedPaySlip.department}</div>
                <div><strong>Position:</strong> ${this.generatedPaySlip.position}</div>
                <div><strong>Working Days:</strong> ${this.generatedPaySlip.workingDays}</div>
                <div><strong>Hourly Rate:</strong> $${this.generatedPaySlip.hourlyRate}</div>
                <div><strong>Hours Worked:</strong> ${this.generatedPaySlip.hoursWorked}</div>
                <div><strong>Gross Salary:</strong> $${this.generatedPaySlip.grossSalary}</div>
                <div><strong>Tax Rate:</strong> ${this.generatedPaySlip.taxRate}</div>
                <div><strong>Tax Amount:</strong> $${this.generatedPaySlip.tax}</div>
                <div><strong>Net Salary:</strong> $${this.generatedPaySlip.netSalary}</div>
              </div>
            </div>
          </body>
        </html>
      `;

      const printWindow = window.open('', '', 'height=500, width=500');
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
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
        <button @click="markAttendance" class="btn btn-primary mt-2">Mark Attendance</button>
      </div>

      <div class="mt-4">
        <h3>Request Time Off</h3>
        <textarea v-model="timeOffReason" class="form-control" placeholder="Reason for time-off"></textarea>
        <button @click="requestTimeOff" class="btn btn-primary mt-2">Submit Request</button>
      </div>

      <div class="mt-4">
        <h3>Generate Pay Slip</h3>
        <div class="row">
          <div class="col-md-6">
            <label>Start Date</label>
            <input type="date" v-model="paySlipStartDate" class="form-control">
          </div>
          <div class="col-md-6">
            <label>End Date</label>
            <input type="date" v-model="paySlipEndDate" class="form-control">
          </div>
        </div>
        <button @click="generatePaySlip" class="btn btn-success mt-2">Generate Pay Slip</button>
      </div>

      <!-- Pay Slip Preview -->
      <div v-if="generatedPaySlip" class="mt-4 card">
        <div class="card-header">Pay Slip Preview</div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <strong>Name:</strong> {{ generatedPaySlip.employeeName }}
            </div>
            <div class="col-md-6">
              <strong>Period:</strong> {{ generatedPaySlip.startDate }} to {{ generatedPaySlip.endDate }}
            </div>
            <div class="col-md-6">
              <strong>Working Days:</strong> {{ generatedPaySlip.workingDays }}
            </div>
            <div class="col-md-6">
              <strong>Gross Salary:</strong> {{ generatedPaySlip.grossSalary }}
            </div>
            <div class="col-md-6">
              <strong>Net Salary:</strong> {{ generatedPaySlip.netSalary }}
            </div>
          </div>
          <button @click="printPaySlip" class="btn btn-primary mt-3">Print Pay Slip</button>
        </div>
      </div>
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
    components: {
      NavigationHeader
  },
    data() {
        return {
            employees: JSON.parse(localStorage.getItem('employees') || '[]'),
            navigationCards: [
                { 
                    title: 'Employee Management',
                    route: '/employees',
                    icon: 'users',
                    description: 'Manage employee records, add new employees, and update information'
                },
                { 
                    title: 'Payroll',
                    route: '/payroll',
                    icon: 'credit-card',
                    description: 'Process payroll and manage salary information'
                },
                { 
                    title: 'Attendance',
                    route: '/attendance',
                    icon: 'clock',
                    description: 'Track and monitor employee attendance'
                },
                { 
                    title: 'Leave Requests',
                    route: '/time-off',
                    icon: 'calendar',
                    description: 'Manage employee leave requests and approvals'
                },
                { 
                    title: 'Salary Analytics',
                    route: '/salary-visualization',
                    icon: 'bar-chart',
                    description: 'View salary distribution and analytics'
                },
                { 
                    title: 'Attendance Trends',
                    route: '/attendance-trends',
                    icon: 'trending-up',
                    description: 'Analyze attendance patterns and trends'
                },
                { 
                    title: 'Leave Status Overview',
                    route: '/leave-status',
                    icon: 'pie-chart',
                    description: 'View overall leave request statistics'
                }
            ]
        };
    },
    computed: {
        employeesWithRequests() {
            return this.employees.filter(emp => emp.leaveRequests && emp.leaveRequests.length > 0);
        }
    },
    methods: {
        navigateTo(route) {
            this.$router.push(route);
        },
        
    },
    template: `
    <NavigationHeader />
        <div class="container-fluid p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>Admin Dashboard</h2>
            </div>

            <!-- Navigation Cards Grid -->
            <div class="row g-4">
                <div v-for="card in navigationCards" 
                     :key="card.route" 
                     class="col-md-6 col-lg-4">
                    <div class="card h-100 shadow-sm hover-card" 
                         @click="navigateTo(card.route)"
                         style="cursor: pointer;">
                        <div class="card-body d-flex flex-column">
                            <div class="d-flex align-items-center mb-3">
                                <i :class="'bi bi-' + card.icon" 
                                   style="font-size: 1.5rem; margin-right: 10px;"></i>
                                <h5 class="card-title mb-0">{{ card.title }}</h5>
                            </div>
                            <p class="card-text text-muted">{{ card.description }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Stats Section -->
            <div class="row mt-4">
                <div class="col-md-4">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h6 class="card-title">Total Employees</h6>
                            <h3>{{ employees.length }}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h6 class="card-title">Pending Leave Requests</h6>
                            <h3>{{ employees.reduce((acc, emp) => 
                                acc + emp.leaveRequests.filter(req => req.status === 'Pending').length, 0) 
                            }}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h6 class="card-title">Departments</h6>
                            <h3>{{ new Set(employees.map(emp => emp.department)).size }}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    // Add custom styles
    style: `
        <style>
        .hover-card {
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .hover-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
        }
        </style>
    `
};
  
  

// Employee Management Component (Admin)
const EmployeeManagement = {
  components: {
    NavigationHeader
},
    data() {
        return {
            employees: JSON.parse(localStorage.getItem('employees') || '[]'),
            newEmployee: {
                name: '',
                position: '',
                department: '',
                salary: '',
                employeeId: '',
                username: '',
                password: '',
                attendance: [],
                leaveRequests: []
            }
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
        this.saveEmployees(users);
    
        // Use SweetAlert2 for notification
        Swal.fire({
            icon: 'success',
            title: 'Credentials Updated',
            text: `New Password: ${password}`,
            footer: 'Please ensure the employee changes this password'
        });
    },
    addEmployee() {
        // Validate input
        if (!this.newEmployee.name || !this.newEmployee.position || !this.newEmployee.department) {
            Swal.fire({
                icon: 'error',
                title: 'Incomplete Information',
                text: 'Please fill in all required fields'
            });
            return;
        }
    
        // Generate unique employee ID
        const employeeId = Date.now().toString();
        
        // Generate username and password
        const username = this.newEmployee.name.toLowerCase().replace(/\s+/g, '.') + '.' + employeeId;
        const password = 'emp' + Math.floor(1000 + Math.random() * 9000);
    
        // Create full employee object
        const employeeToAdd = {
            ...this.newEmployee,
            employeeId,
            username,
            password,
            attendance: [],
            leaveRequests: []
        };
    
        // Add to employees array
        this.employees.push(employeeToAdd);
    
        // Add to users for login
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push({
            username,
            password,
            role: 'employee',
            employeeId
        });
    
        // Save to localStorage
        this.saveEmployees(users);
    
        // Reset form
        this.newEmployee = {
            name: '',
            position: '',
            department: '',
            salary: '',
            employeeId: '',
            username: '',
            password: ''
        };
    
        // Use SweetAlert2 for success notification
        Swal.fire({
            icon: 'success',
            title: 'Employee Added Successfully!',
            html: `
                <p>Username: ${username}</p>
                <p>Password: ${password}</p>
            `,
            footer: 'Please share credentials securely with the employee'
        });
    },
   deleteEmployee(employeeId) {
    // Use SweetAlert2 for confirmation and notification
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            // Remove from employees array
            this.employees = this.employees.filter(emp => emp.employeeId !== employeeId);

            // Remove from users array
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const updatedUsers = users.filter(user => user.employeeId !== employeeId);

            // Save updated data to localStorage
            this.saveEmployees(updatedUsers);

            // Show success message
            Swal.fire({
                title: "Deleted!",
                text: "Employee has been deleted.",
                icon: "success"
            });
        }
    });
},
        saveEmployees(users) {
            localStorage.setItem('employees', JSON.stringify(this.employees));
            if (users) {
                localStorage.setItem('users', JSON.stringify(users));
            }
        }
    },
    template: `
        <div>
        <NavigationHeader />
            <h2>Employee Management</h2>
            
            <!-- Add Employee Form -->
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
                            <input v-model="newEmployee.salary" type="number" class="form-control" placeholder="Salary">
                        </div>
                    </div>
                    <button @click="addEmployee" class="btn btn-primary mt-3">Add Employee</button>
                </div>
            </div>

            <!-- Employees Table -->
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Department</th>
                        <th>Salary</th>
                        <th>Username</th>
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
                        <td>
                            <button @click="regenerateCredentials(employee)" class="btn btn-sm btn-warning me-2">Reset Password</button>
                            <button @click="deleteEmployee(employee.employeeId)" class="btn btn-sm btn-danger">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `
};

const LeaveStatusChart = {
  components: {
    NavigationHeader
},
  mounted() {
      const ctx = document.getElementById('leaveStatusChart').getContext('2d');
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      const leaveStatuses = { Approved: 0, Pending: 0, Rejected: 0 };

      employees.forEach(emp => {
          emp.leaveRequests.forEach(req => {
              leaveStatuses[req.status] += 1;
          });
      });

      new Chart(ctx, {
          type: 'pie',
          data: {
              labels: Object.keys(leaveStatuses),
              datasets: [{
                  data: Object.values(leaveStatuses),
                  backgroundColor: ['#4caf50', '#ff9800', '#f44336']
              }]
          },
          options: {
              responsive: true
          }
      });
  },
  template: `
      <div>
      <NavigationHeader />
          <h2>Leave Request Status</h2>
          <canvas id="leaveStatusChart"></canvas>
      </div>
  `
};

const AttendanceTrendChart = {
  components: {
    NavigationHeader
},
  mounted() {
      const ctx = document.getElementById('attendanceTrendChart').getContext('2d');
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      const attendanceCounts = { Present: 0, Absent: 0 };

      employees.forEach(emp => {
          emp.attendance.forEach(att => {
              attendanceCounts[att.status] += 1;
          });
      });

      new Chart(ctx, {
          type: 'line',
          data: {
              labels: Object.keys(attendanceCounts),
              datasets: [{
                  label: 'Attendance Trend',
                  data: Object.values(attendanceCounts),
                  backgroundColor: 'rgba(75,192,192,0.4)',
                  borderColor: 'rgba(75,192,192,1)',
                  fill: true
              }]
          },
          options: {
              responsive: true,
              scales: {
                  y: {
                      beginAtZero: true
                  }
              }
          }
      });
  },
  template: `
      <div>
      <NavigationHeader />
          <h2>Attendance Trends</h2>
          <canvas id="attendanceTrendChart"></canvas>
      </div>
  `
};

const SalaryChart = {
  components: {
    NavigationHeader
},
  mounted() {
      const ctx = document.getElementById('salaryChart').getContext('2d');
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      const departments = employees.reduce((acc, emp) => {
          acc[emp.department] = (acc[emp.department] || 0) + emp.salary;
          return acc;
      }, {});

      new Chart(ctx, {
          type: 'bar',
          data: {
              labels: Object.keys(departments),
              datasets: [{
                  label: 'Total Salary',
                  data: Object.values(departments),
                  backgroundColor: '#4caf50'
              }]
          },
          options: {
              responsive: true,
              scales: {
                  y: {
                      beginAtZero: true
                  }
              }
          }
      });
  },
  template: `
      <div>
      <NavigationHeader />
          <h2>Department-Wise Salary</h2>
          <canvas id="salaryChart"></canvas>
      </div>
  `
};

    

// Router Configuration
const routes = [
    { path: '/', component: Login },
    { path: '/employees', component: EmployeeManagement, meta: { role: 'admin' } },
    { path: '/payroll', component: PayrollManagement, meta: { role: 'admin' } },
    { path: '/time-off', component: TimeOffRequests, meta: { role: 'admin' } },
    { path: '/attendance', component: AttendanceTracking, meta: { role: 'admin' } },
    { path: '/visualization', component: DataVisualization, meta: { role: 'admin' } },
    { path: '/employee-dashboard', component: EmployeeDashboard, meta: { role: 'employee' } },
    { path: '/salary-visualization', component: SalaryChart },
    { path: '/attendance-trends', component: AttendanceTrendChart },
    { path: '/leave-status', component: LeaveStatusChart },
    { path: '/admin-dashboard', component: AdminDashboard, meta: { role: 'admin' } }
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
    return { 
      user: JSON.parse(localStorage.getItem('loggedInUser') || '{}') 
    };
  },
  methods: {
    logout() {
      localStorage.removeItem('loggedInUser');
      this.user = {};
      this.$router.push('/');
    },
  },
  mounted() {
    initDataFromJSON();
  },
  template: `
    <div>
      <router-view></router-view>
    </div>
  `,
});

// Use Router
app.use(router);
app.mount('#app');