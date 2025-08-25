<template>
  <div class="flex h-screen bg-gray-100">
    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p class="text-sm text-gray-600">Welcome back, {{ userName }}!</p>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-500">{{ currentDate }}</span>
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <i class="fas fa-user-shield text-white text-sm"></i>
                </div>
                <span class="text-sm font-medium text-gray-700">{{ userEmail }}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Dashboard Content -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-users text-blue-600 text-xl"></i>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-600">Total Users</p>
                  <p class="text-2xl font-bold text-gray-900">1,234</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-chart-line text-green-600 text-xl"></i>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-600">Revenue</p>
                  <p class="text-2xl font-bold text-gray-900">$12,345</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-shopping-cart text-yellow-600 text-xl"></i>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-600">Orders</p>
                  <p class="text-2xl font-bold text-gray-900">567</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-star text-purple-600 text-xl"></i>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-600">Rating</p>
                  <p class="text-2xl font-bold text-gray-900">4.8</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Content Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Recent Activity -->
            <div class="bg-white rounded-lg shadow-sm">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div class="p-6">
                <div class="space-y-4">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <i class="fas fa-user text-blue-600 text-sm"></i>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">New user registered</p>
                      <p class="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>

                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <i class="fas fa-shopping-bag text-green-600 text-sm"></i>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Order completed</p>
                      <p class="text-xs text-gray-500">5 minutes ago</p>
                    </div>
                  </div>

                  <div class="flex items-center space-x-3">
                    <div
                      class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center"
                    >
                      <i class="fas fa-exclamation text-yellow-600 text-sm"></i>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">System maintenance</p>
                      <p class="text-xs text-gray-500">10 minutes ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- System Status -->
            <div class="bg-white rounded-lg shadow-sm">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900">System Status</h3>
              </div>
              <div class="p-6">
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">Server Status</span>
                    <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                      >Online</span
                    >
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">Database</span>
                    <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                      >Healthy</span
                    >
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">API Response</span>
                    <span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                      >Slow</span
                    >
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">Storage</span>
                    <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                      >75% Used</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminSidebar from '../components/AdminSidebar.vue'

export default {
  name: 'AdminDashboard',
  components: {
    AdminSidebar,
  },
  setup() {
    const router = useRouter()
    const userName = ref('')
    const userEmail = ref('')
    const currentDate = ref('')

    onMounted(() => {
      userName.value = localStorage.getItem('userName') || 'Admin'
      userEmail.value = localStorage.getItem('userEmail') || 'admin@example.com'

      // Set current date
      const now = new Date()
      currentDate.value = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    })

    const handleLogout = () => {
      localStorage.clear()
      router.push('/login')
    }

    return {
      userName,
      userEmail,
      currentDate,
      handleLogout,
    }
  },
}
</script>
