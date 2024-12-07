<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-sm p-6 space-y-4 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold text-center">Login</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <input
            v-model="username"
            type="text"
            id="username"
            class="block w-full px-4 py-2 mt-1 text-sm border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Username"
            required
          />
        </div>

        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="block w-full px-4 py-2 mt-1 text-sm border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Password"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full py-2 mt-4 text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 focus:outline-none"
          :disabled="loading"
        >
          <span v-if="loading" class="animate-spin">🔄</span>
          <span v-else>Login</span>
        </button>
      </form>

      <p v-if="errorMessage" class="mt-4 text-sm text-red-500 text-center">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import { auth } from '@/stores/authStore';

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
      loading: false,
    };
  },
  methods: {
    async login() {
      this.loading = true;
      if (auth.login(this.username, this.password)) {
        this.$router.push('/dashboard');
      } else {
        this.errorMessage = 'Invalid credentials!';
      }
      this.loading = false;
    },
  },
};
</script>

<style scoped>
/* Custom styles can be added here */
</style>
