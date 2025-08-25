import { ref, computed } from 'vue'
import axios from 'axios'

// State global untuk authentication
const user = ref(null)
const token = ref(null)
const isLoading = ref(false)
const error = ref(null)

export function useAuth() {
  // Computed properties
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isUser = computed(() => user.value?.role === 'user')

  // Initialize auth state dari localStorage
  const initializeAuth = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = {
      id: localStorage.getItem('userId'),
      name: localStorage.getItem('userName'),
      email: localStorage.getItem('userEmail'),
      role: localStorage.getItem('userRole'),
    }

    if (storedToken && storedUser.id) {
      token.value = storedToken
      user.value = storedUser
    }
  }

  // Login function
  const login = async (credentials) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await axios.post('http://localhost:5002/api/user/sign-in', credentials)

      if (response.data.status === 200) {
        const userData = response.data.data

        // Set state
        token.value = userData.token
        user.value = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
        }

        // Save to localStorage
        localStorage.setItem('token', userData.token)
        localStorage.setItem('userId', userData.id)
        localStorage.setItem('userName', userData.name)
        localStorage.setItem('userEmail', userData.email)
        localStorage.setItem('userRole', userData.role)

        return { success: true, user: user.value }
      }
    } catch (err) {
      console.error('Login error:', err)
      error.value = err.response?.data?.message || 'Login failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Logout function
  const logout = () => {
    token.value = null
    user.value = null
    error.value = null

    // Clear localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userRole')
  }

  // Setup axios interceptor untuk authentication
  const setupAxiosInterceptors = () => {
    axios.interceptors.request.use(
      (config) => {
        if (token.value) {
          config.headers.Authorization = `Bearer ${token.value}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout()
          window.location.href = '/login'
        }
        return Promise.reject(error)
      },
    )
  }

  return {
    // State
    user: computed(() => user.value),
    token: computed(() => token.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),

    // Computed
    isAuthenticated,
    isAdmin,
    isUser,

    // Methods
    login,
    logout,
    initializeAuth,
    setupAxiosInterceptors,
  }
}
