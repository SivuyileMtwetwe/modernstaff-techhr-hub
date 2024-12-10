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
                if (user.role === 'admin') {
                    this.$router.push('/employees');
                } else {
                    this.$router.push('/employee-dashboard');
                }
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

const EmployeeManagement = {
    data() {
        return {
            employees: JSON.parse(localStorage.getItem('employees') || '[]'),
            newEmployee: { name: '', department: '', salary: '', hireDate: '' }
        };
    },
    methods: {
        generateLogin() {
            const username = this.newEmployee.name.toLowerCase().replace(/\s/g, '') + Date.now().toString().slice(-4);
            const password = Math.random().toString(36).substring(2, 8);
            return { username, password };
        },
        addEmployee() {
            const { username, password } = this.generateLogin();
            const employee = {
                ...this.newEmployee,
                id: Date.now(),
                username,
                password
            };
            this.employees.push(employee);
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            users.push({ username, password, role: 'employee', employeeId: employee.id });
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('employees', JSON.stringify(this.employees));
            this.newEmployee = { name: '', department: '', salary: '', hireDate: '' };
            alert(`Employee added. Username: ${username}, Password: ${password}`);
        }
    },
    template: `
        <div>
            <h2>Employee Management</h2>
            <div>
                <h3>Add New Employee</h3>
                <form @submit.prevent="addEmployee">
                    <input v-model="newEmployee.name" type="text" placeholder="Name" required />
                    <input v-model="newEmployee.department" type="text" placeholder="Department" required />
                    <input v-model="newEmployee.salary" type="number" placeholder="Salary" required />
                    <input v-model="newEmployee.hireDate" type="date" placeholder="Hire Date" required />
                    <button type="submit">Add Employee</button>
                </form>
            </div>
        </div>
    `
};

const routes = [
    { path: '/', component: Login },
    { path: '/employees', component: EmployeeManagement },
    { path: '/employee-dashboard', component: { template: '<h2>Employee Dashboard</h2>' } },
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
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