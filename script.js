// Initialize Data from JSON File
const initDataFromJSON = async () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');

    // If employees already exist in localStorage, skip loading from JSON
    if (employees.length > 0) {
        return;
    }

    try {
        const response = await fetch('data/employeeData.json'); // Replace with the actual path to your JSON file
        if (!response.ok) {
            throw new Error(`Failed to fetch employee data: ${response.status}`);
        }

        const data = await response.json();
        const loadedEmployees = data.employeeData.map(employee => {
            // Generate username and password for each employee
            const username = employee.name.toLowerCase().replace(/\s+/g, '.') + '.' + employee.employeeId;
            const password = 'emp' + Math.floor(1000 + Math.random() * 9000);

            // Add login credentials to users
            users.push({ username, password, role: 'employee', employeeId: employee.employeeId });

            // Attach generated credentials to the employee data
            return { ...employee, username, password };
        });

        // Save to localStorage
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
    `
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

// Router Configuration
const routes = [
    { path: '/', component: Login },
    { path: '/employees', component: EmployeeManagement, meta: { role: 'admin' } }
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

// Vue App
const app = Vue.createApp({
    data() {
        return { user: JSON.parse(localStorage.getItem('loggedInUser') || '{}') };
    },
    methods: {
        logout() {
            localStorage.removeItem('loggedInUser');
            this.user = {};
            this.$router.push('/');
        }
    },
    mounted() {
        initDataFromJSON(); // Initialize data from JSON
    }
});

// Use Router
app.use(router);
app.mount('#app');
