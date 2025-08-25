<template>
  <div class="w-64 bg-gray-900 text-white flex flex-col min-h-screen">
    <!-- Logo/Brand -->
    <div class="p-6 border-b border-gray-700">
      <div class="flex items-center space-x-3">
        <img
          class="w-7 h-7"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Coat_of_arms_of_Jakarta.svg/640px-Coat_of_arms_of_Jakarta.svg.png"
          alt=""
        />
        <div>
          <h2 class="text-xl font-bold">Admin Panel</h2>
          <p class="text-xs text-gray-400">Management System</p>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 px-4 py-6 space-y-2">
      <router-link
        to="/dashboard"
        :class="[
          'flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200',
          $route.path === '/dashboard'
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white',
        ]"
      >
        <i class="fas fa-tachometer-alt w-5"></i>
        <span>Dashboard</span>
      </router-link>
      <router-link
        to="/admin-user-management"
        :class="[
          'flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200',
          $route.path === '/dashboard'
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white',
        ]"
      >
        <i class="fas fa-tachometer-alt w-5"></i>
        <span>User Management</span>
      </router-link>

      <router-link
        to="/admin-program"
        :class="[
          'flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200',
          $route.path === '/admin-program'
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white',
        ]"
      >
        <i class="fas fa-sitemap w-5"></i>
        <span>Program</span>
      </router-link>

      <router-link
        to="/admin-kegiatan"
        :class="[
          'flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200',
          $route.path === '/kegiatan'
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white',
        ]"
      >
        <i class="fas fa-calendar-alt w-5"></i>
        <span>Kegiatan</span>
      </router-link>

      <router-link
        to="/admin-sub-kegiatan"
        :class="[
          'flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200',
          $route.path === '/sub-kegiatan'
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white',
        ]"
      >
        <i class="fas fa-stream w-5"></i>
        <span>Sub Kegiatan</span>
      </router-link>

      <router-link
        to="/admin-aktifitas"
        :class="[
          'flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200',
          $route.path === '/aktifitas'
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white',
        ]"
      >
        <i class="fas fa-running w-5"></i>
        <span>Aktifitas</span>
      </router-link>

      <router-link
        to="/admin-subtitle"
        :class="[
          'flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200',
          $route.path === '/subtitle'
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white',
        ]"
      >
        <i class="fas fa-heading w-5"></i>
        <span>Subtitle</span>
      </router-link>

      <router-link
        to="/admin-rekening"
        :class="[
          'flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200',
          $route.path === '/kode-rekening'
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white',
        ]"
      >
        <i class="fas fa-hashtag w-5"></i>
        <span>Kode Rekening</span>
      </router-link>

      <router-link
        to="/admin-pengampu"
        :class="[
          'flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200',
          $route.path === '/nama-rekening'
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white',
        ]"
      >
        <i class="fas fa-user-graduate w-5"></i>
        <span>Pengampu</span>
      </router-link>

      <router-link
        to="/admin-laporan"
        :class="[
          'flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200',
          $route.path === '/nama-rekening'
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white',
        ]"
      >
        <i class="fas fa-chart-line w-5"></i>
        <span>Laporan</span>
      </router-link>

      <router-link
        to="/admin-artikel"
        :class="[
          'flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200',
          $route.path === '/nama-rekening'
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white',
        ]"
      >
        <i class="fas fa-pen-alt w-5"></i>
        <span>Buat Artikel</span>
      </router-link>

      <router-link
        to="/admin-list-artikel"
        :class="[
          'flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200',
          $route.path === '/nama-rekening'
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white',
        ]"
      >
        <i class="fas fa-list-alt w-5"></i>
        <span>List Artikel</span>
      </router-link>
    </nav>

    <!-- User Profile & Logout -->
    <div class="p-4 border-t border-gray-700">
      <div class="flex items-center space-x-3 mb-4">
        <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <i class="fas fa-user-shield text-sm"></i>
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium">{{ userName }}</p>
          <p class="text-xs text-gray-400">Administrator</p>
        </div>
      </div>

      <button
        @click="handleLogout"
        class="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition duration-200"
      >
        <i class="fas fa-sign-out-alt w-5"></i>
        <span>Logout</span>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'AdminSidebar',
  emits: ['logout'],
  setup(props, { emit }) {
    const userName = ref('')

    onMounted(() => {
      userName.value = localStorage.getItem('userName') || 'Admin'
    })

    const handleLogout = () => {
      emit('logout')
    }

    return {
      userName,
      handleLogout,
    }
  },
}
</script>
