
// Initialize Dummy Data
const initDummyData = () => {
    if (!localStorage.getItem('users')) {
        const users = [
            { username: 'admin', password: 'admin123', role: 'admin' }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    }

    if (!localStorage.getItem('employees')) {
        localStorage.setItem('employees', JSON.stringify([]));
    }

    if (!localStorage.getItem('timeOffRequests')) {
        localStorage.setItem('timeOffRequests', JSON.stringify([]));
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
    `
};

// Employee Management Component (Admin)
const EmployeeManagement = {
    data() {
        return {
            employees: JSON.parse(localStorage.getItem('employees') || '[]'),
            newEmployee: { name: '', department: '', salary: '' }
        };
    },
    methods: {
        addEmployee() {
            const username = this.newEmployee.name.toLowerCase().replace(/\s+/g, '');
            const password = 'emp' + Math.floor(1000 + Math.random() * 9000);
            const employee = { ...this.newEmployee, id: Date.now(), username, password, role: 'employee', timeOffBalance: 15 };

            this.employees.push(employee);
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            users.push({ username, password, role: 'employee' });
            localStorage.setItem('employees', JSON.stringify(this.employees));
            localStorage.setItem('users', JSON.stringify(users));

            alert(`Employee added successfully. Login: ${username}, Password: ${password}`);
            this.newEmployee = { name: '', department: '', salary: '' };
        }
    },
    template: `
        <div>
            <h2>Employee Management</h2>
            <form @submit.prevent="addEmployee" class="mb-4">
                <div class="mb-3">
                    <input v-model="newEmployee.name" type="text" placeholder="Name" class="form-control" required />
                </div>
                <div class="mb-3">
                    <input v-model="newEmployee.department" type="text" placeholder="Department" class="form-control" required />
                </div>
                <div class="mb-3">
                    <input v-model="newEmployee.salary" type="number" placeholder="Salary" class="form-control" required />
                </div>
                <button type="submit" class="btn btn-primary">Add Employee</button>
            </form>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Salary</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="employee in employees" :key="employee.id">
                        <td>{{ employee.name }}</td>
                        <td>{{ employee.department }}</td>
                        <td>{{ employee.salary }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `
};

// Time-Off Management Component (Admin)
const TimeOffManagement = {
data() {
return {
    timeOffRequests: JSON.parse(localStorage.getItem('timeOffRequests') || '[]')
};
},
methods: {
approveRequest(request) {
    request.status = 'Approved';
    localStorage.setItem('timeOffRequests', JSON.stringify(this.timeOffRequests));
    alert(`Time-off request from ${request.employeeName} approved.`);
},
rejectRequest(request) {
    request.status = 'Rejected';
    localStorage.setItem('timeOffRequests', JSON.stringify(this.timeOffRequests));
    alert(`Time-off request from ${request.employeeName} rejected.`);
}
},
template: `
<div>
    <h2>Time-Off Requests</h2>
    <table class="table table-striped">
        <thead>
            <tr>
                <th>Employee Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="request in timeOffRequests" :key="request.id">
                <td>{{ request.employeeName }}</td>
                <td>{{ request.startDate }}</td>
                <td>{{ request.endDate }}</td>
                <td>{{ request.type }}</td>
                <td>{{ request.status }}</td>
                <td v-if="request.status === 'Pending'">
                    <button @click="approveRequest(request)" class="btn btn-sm btn-success me-1">Approve</button>
                    <button @click="rejectRequest(request)" class="btn btn-sm btn-danger">Reject</button>
                </td>
                <td v-else>-</td>
            </tr>
        </tbody>
    </table>
</div>
`
};


// Employee Dashboard Component
const EmployeeDashboard = {
data() {
return {
    user: JSON.parse(localStorage.getItem('loggedInUser') || '{}'),
    timeOffRequests: JSON.parse(localStorage.getItem('timeOffRequests') || '[]'),
    newTimeOffRequest: {
        startDate: '',
        endDate: '',
        type: 'Vacation'
    }
};
},
computed: {
myRequests() {
    return this.timeOffRequests.filter(req => req.employeeId === this.user.id);
}
},
methods: {
submitTimeOffRequest() {
    const request = {
        ...this.newTimeOffRequest,
        id: Date.now(),
        employeeId: this.user.id,
        employeeName: this.user.username, 
        status: 'Pending'
    };
    this.timeOffRequests.push(request);
    localStorage.setItem('timeOffRequests', JSON.stringify(this.timeOffRequests));
    this.newTimeOffRequest = { startDate: '', endDate: '', type: 'Vacation' };
    alert('Time-off request submitted successfully!');
}
},
template: `
<div>
    <h2>Welcome, {{ user.username }}</h2>
    <div class="row">
        <div class="col-md-6">
            <h3>Submit Time-Off Request</h3>
            <form @submit.prevent="submitTimeOffRequest">
                <div class="mb-3">
                    <label>Start Date</label>
                    <input v-model="newTimeOffRequest.startDate" type="date" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label>End Date</label>
                    <input v-model="newTimeOffRequest.endDate" type="date" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label>Type</label>
                    <select v-model="newTimeOffRequest.type" class="form-control">
                        <option>Vacation</option>
                        <option>Sick Leave</option>
                        <option>Personal Leave</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Submit Request</button>
            </form>
        </div>
        <div class="col-md-6">
            <h3>My Time-Off Requests</h3>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Type</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="request in myRequests" :key="request.id">
                        <td>{{ request.startDate }}</td>
                        <td>{{ request.endDate }}</td>
                        <td>{{ request.type }}</td>
                        <td>{{ request.status }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
`
};

// Router Configuration
const routes = [
    { path: '/', component: Login },
    { path: '/employees', component: EmployeeManagement, meta: { role: 'admin' } },
    { path: '/time-off', component: TimeOffManagement, meta: { role: 'admin' } },
    { path: '/employee-dashboard', component: EmployeeDashboard, meta: { role: 'employee' } }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    if (to.meta.role && to.meta.role !== user.role) {
        next('/');
    } else {
        next();
    }
});

const app = Vue.createApp({
    data() {
        return { user: JSON.parse(localStorage.getItem('loggedInUser') || '{}') };
    },
    computed: {
        isLoggedIn() {
            return !!this.user.username;
        }
    },
    methods: {
        logout() {
            localStorage.removeItem('loggedInUser');
            this.user = {};
            this.$router.push('/');
        }
    }
});

app.use(router);

initDummyData();
app.mount('#app');