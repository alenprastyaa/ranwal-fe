<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <div v-if="showSidebar" class="flex">
      <div>
        <AdminSidebar @logout="handleLogout" />
      </div>
      <div class="flex-1 p-6 overflow-y-auto">
        <router-view />
      </div>
    </div>
    <div v-else class="min-h-screen">
      <router-view />
    </div>
  </div>
</template>

<script>
import AdminSidebar from '@/components/AdminSidebar.vue'

export default {
  name: 'App',
  components: {
    AdminSidebar,
  },
  computed: {
    showSidebar() {
      const routesWithoutSidebar = ['/login']
      const requiresAuth = this.$route.meta?.requiresAuth
      const isLoginPage = this.$route.path === '/login'
      const userRole = localStorage.getItem('userRole')

      // Jangan tampilkan sidebar jika:
      // - Di halaman login
      // - Route tidak memerlukan auth
      // - User role adalah 'user'
      return requiresAuth && !isLoginPage && userRole !== 'user'
    },
  },
  methods: {
    handleLogout() {
      // Clear semua data dari localStorage
      localStorage.clear()
      this.$router.push('/login')
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
