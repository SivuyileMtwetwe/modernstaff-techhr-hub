<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="username" type="text" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit" :disabled="loading">Login</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
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
.error {
  color: red;
}
</style>
