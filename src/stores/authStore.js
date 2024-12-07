import { reactive } from 'vue';

export const auth = reactive({
  isAuthenticated: false,
  login(username, password) {
    // Example: Hardcoded login credentials
    if (username === 'admin' && password === 'password') {
      this.isAuthenticated = true;
      return true;
    }
    return false;
  },
  logout() {
    this.isAuthenticated = false;
  },
});
