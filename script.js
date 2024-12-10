
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

        // Employee Management Component
// Employee Dashboard Component
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
                employeeName: this.user.name, // Save employee name
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
            <h2>Welcome, {{ user.name }}</h2>
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


// Add a new route for the Employee Dashboard
const routes = [
    { path: '/', component: Login },
    { path: '/employees', component: EmployeeManagement, meta: { role: 'admin' } },
    { path: '/employee-dashboard', component: EmployeeDashboard, meta: { role: 'employee' } },
    // Add additional routes like Payroll, Time Off Management for admin if needed
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
