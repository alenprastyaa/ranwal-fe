<template>
  <nav class="bg-white shadow-lg border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/Brand -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
            >
              <i class="fas fa-user-circle text-white"></i>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">User Portal</h1>
              <p class="text-xs text-gray-500">Personal Dashboard</p>
            </div>
          </div>
        </div>

        <!-- Navigation Menu -->
        <div class="hidden md:flex items-center space-x-8">
          <a
            href="#"
            @click.prevent="setActiveMenu('dashboard')"
            :class="[
              'px-3 py-2 rounded-md text-sm font-medium transition duration-200',
              activeMenu === 'dashboard'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100',
            ]"
          >
            <i class="fas fa-home mr-2"></i>Dashboard
          </a>

          <a
            href="#"
            @click.prevent="setActiveMenu('tasks')"
            :class="[
              'px-3 py-2 rounded-md text-sm font-medium transition duration-200',
              activeMenu === 'tasks'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100',
            ]"
          >
            <i class="fas fa-tasks mr-2"></i>My Tasks
          </a>

          <a
            href="#"
            @click.prevent="setActiveMenu('files')"
            :class="[
              'px-3 py-2 rounded-md text-sm font-medium transition duration-200',
              activeMenu === 'files'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100',
            ]"
          >
            <i class="fas fa-folder mr-2"></i>Files
          </a>

          <a
            href="#"
            @click.prevent="setActiveMenu('profile')"
            :class="[
              'px-3 py-2 rounded-md text-sm font-medium transition duration-200',
              activeMenu === 'profile'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100',
            ]"
          >
            <i class="fas fa-user mr-2"></i>Profile
          </a>
        </div>

        <!-- User Menu -->
        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <button
            class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full relative"
          >
            <i class="fas fa-bell text-lg"></i>
            <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          <!-- Messages -->
          <button
            class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full relative"
          >
            <i class="fas fa-envelope text-lg"></i>
            <span class="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></span>
          </button>

          <!-- User Dropdown -->
          <div class="relative">
            <button
              @click="toggleDropdown"
              class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition duration-200"
            >
              <div
                class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
              >
                <i class="fas fa-user text-white text-sm"></i>
              </div>
              <div class="hidden md:block text-left">
                <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
                <p class="text-xs text-gray-500">{{ userRole }}</p>
              </div>
              <i class="fas fa-chevron-down text-gray-400 text-xs"></i>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-show="showDropdown"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50"
            >
              <div class="py-1">
                <a
                  href="#"
                  @click.prevent="setActiveMenu('profile')"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <i class="fas fa-user mr-3 text-gray-400"></i>
                  My Profile
                </a>

                <a
                  href="#"
                  @click.prevent="setActiveMenu('settings')"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <i class="fas fa-cog mr-3 text-gray-400"></i>
                  Settings
                </a>

                <div class="border-t border-gray-100"></div>

                <button
                  @click="handleLogout"
                  class="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                >
                  <i class="fas fa-sign-out-alt mr-3 text-red-400"></i>
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <i class="fas fa-bars text-lg"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-show="showMobileMenu" class="md:hidden border-t border-gray-200 py-4">
        <div class="space-y-1">
          <a
            href="#"
            @click.prevent="setActiveMenu('dashboard')"
            :class="[
              'block px-3 py-2 rounded-md text-base font-medium transition duration-200',
              activeMenu === 'dashboard'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100',
            ]"
          >
            <i class="fas fa-home mr-2"></i>Dashboard
          </a>

          <a
            href="#"
            @click.prevent="setActiveMenu('tasks')"
            :class="[
              'block px-3 py-2 rounded-md text-base font-medium transition duration-200',
              activeMenu === 'tasks'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100',
            ]"
          >
            <i class="fas fa-tasks mr-2"></i>My Tasks
          </a>

          <a
            href="#"
            @click.prevent="setActiveMenu('files')"
            :class="[
              'block px-3 py-2 rounded-md text-base font-medium transition duration-200',
              activeMenu === 'files'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100',
            ]"
          >
            <i class="fas fa-folder mr-2"></i>Files
          </a>

          <a
            href="#"
            @click.prevent="setActiveMenu('profile')"
            :class="[
              'block px-3 py-2 rounded-md text-base font-medium transition duration-200',
              activeMenu === 'profile'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100',
            ]"
          >
            <i class="fas fa-user mr-2"></i>Profile
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'UserNavbar',
  emits: ['logout'],
  setup(props, { emit }) {
    const activeMenu = ref('dashboard')
    const userName = ref('')
    const userRole = ref('')
    const showDropdown = ref(false)
    const showMobileMenu = ref(false)

    onMounted(() => {
      userName.value = localStorage.getItem('userName') || 'User'
      userRole.value = localStorage.getItem('userRole') || 'user'

      // Close dropdown when clicking outside
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    const setActiveMenu = (menu) => {
      activeMenu.value = menu
      showMobileMenu.value = false
    }

    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value
    }

    const toggleMobileMenu = () => {
      showMobileMenu.value = !showMobileMenu.value
    }

    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        showDropdown.value = false
      }
    }

    const handleLogout = () => {
      showDropdown.value = false
      emit('logout')
    }

    return {
      activeMenu,
      userName,
      userRole,
      showDropdown,
      showMobileMenu,
      setActiveMenu,
      toggleDropdown,
      toggleMobileMenu,
      handleLogout,
    }
  },
}
</script>
