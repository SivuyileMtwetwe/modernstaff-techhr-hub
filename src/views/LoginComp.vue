
<template>
    <div class="container">
      <LoaderOverlay v-if="isLoading" />
      <div class="logo-section">
        <img src="@/assets/final-logo.png">
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
          <!-- ... rest of the form -->
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  import LoaderOverlay from '@/components/common/LoaderOverlay.vue'
  
  export default {
    name: 'LoginComp',
    components: {
      LoaderOverlay
    },
    setup() {
      const router = useRouter()
      const store = useStore()
      const username = ref('')
      const password = ref('')
      const errorMessage = ref('')
      const isLoading = ref(false)
  
      const login = async () => {
        isLoading.value = true
        try {
          await store.dispatch('auth/login', {
            username: username.value,
            password: password.value
          })
          const user = store.state.auth.user
          router.push(user.role === 'admin' ? '/admin-dashboard' : '/employee-dashboard')
        } catch (error) {
          errorMessage.value = error.message
        } finally {
          isLoading.value = false
        }
      }
  
      return {
        username,
        password,
        errorMessage,
        isLoading,
        login
      }
    }
  }
  </script>
  
  <style scoped>
  /* ... Login component styles ... */
  </style>