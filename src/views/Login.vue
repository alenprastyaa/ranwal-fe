<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
        <p class="text-gray-600">Please sign in to your account</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            v-model="form.email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            v-model="form.password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your password"
          />
        </div>

        <div v-if="errorMessage" class="text-red-600 text-sm text-center">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          <i v-if="isLoading" class="fas fa-spinner fa-spin mr-2"></i>
          {{ isLoading ? 'Signing In...' : 'Sign In' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">Demo Accounts:</p>
        <div class="mt-2 text-xs text-gray-500">
          <p>Admin: admin@gmail.com</p>
          <p>User: alen@gmail.com</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const form = ref({
      email: '',
      password: '',
    })
    const errorMessage = ref('')
    const isLoading = ref(false)

    const handleLogin = async () => {
      errorMessage.value = ''
      isLoading.value = true

      try {
        const response = await axios.post('http://localhost:5002/api/user/sign-in', {
          email: form.value.email,
          password: form.value.password,
        })

        if (response.data.status === 200) {
          const userData = response.data.data

          // Simpan data ke localStorage
          localStorage.setItem('token', userData.token)
          localStorage.setItem('userId', userData.id)
          localStorage.setItem('userName', userData.name)
          localStorage.setItem('userEmail', userData.email)
          localStorage.setItem('userRole', userData.role)

          // Redirect berdasarkan role
          if (userData.role === 'admin') {
            router.push('/admin-dashboard')
          } else {
            router.push('/user-dashboard')
          }
        }
      } catch (error) {
        console.error('Login error:', error)
        if (error.response) {
          errorMessage.value = error.response.data.message || 'Login failed'
        } else if (error.request) {
          errorMessage.value = 'Network error. Please check your connection.'
        } else {
          errorMessage.value = 'An error occurred. Please try again.'
        }
      } finally {
        isLoading.value = false
      }
    }

    return {
      form,
      errorMessage,
      isLoading,
      handleLogin,
    }
  },
}
</script>
