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
const role = localStorage.getItem('userRole')

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

      return requiresAuth && !isLoginPage
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
