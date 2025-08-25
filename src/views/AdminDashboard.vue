<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- Header -->
    <header class="bg-white shadow-lg border-b border-gray-100">
      <div class="max-w-8xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <img
              class="w-8 h-8"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Coat_of_arms_of_Jakarta.svg/640px-Coat_of_arms_of_Jakarta.svg.png"
              alt=""
            />

            <div>
              <h1 class="text-2xl font-bold text-gray-900">SIREMON APP</h1>
              <p class="text-sm text-gray-500">Sistem Informasi Remote Monitoring</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">{{ currentUser }}</p>
              <p class="text-xs text-gray-500">{{ currentTime }}</p>
            </div>
            <div
              class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center"
            >
              <span class="text-white font-semibold">{{ userInitials }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Welcome Section -->
    <main class="max-w-8xl mx-auto py-8">
      <div
        class="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl mb-8"
      >
        <div class="absolute inset-0 bg-black opacity-10"></div>
        <div class="relative px-8 py-12 sm:px-12 sm:py-16">
          <div class="text-center">
            <div class="animate-bounce mb-6">
              <div
                class="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm"
              >
                <svg
                  class="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>
            <h2 class="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              Selamat Datang di
            </h2>
            <h3
              class="text-5xl sm:text-6xl font-extrabold text-white mb-6 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent"
            >
              SIREMON APP
            </h3>
            <p class="text-xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
              Sistem Informasi Perencanaan Terintegrasi Monitoring Kegiatan
            </p>
          </div>
        </div>
        <div class="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,0 C240,120 480,120 720,60 C960,0 1200,60 1200,60 L1200,120 L0,120 Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      <!-- Features Section -->
      <div v-if="showFeatures" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div
          v-for="feature in features"
          :key="feature.id"
          class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
        >
          <div class="flex items-center mb-4">
            <div
              :class="`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mr-4`"
            >
              <i :class="feature.icon" class="text-white text-xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">{{ feature.title }}</h3>
          </div>
          <p class="text-gray-600 text-sm leading-relaxed">{{ feature.description }}</p>
        </div>
      </div>

      <!-- Quick Stats -->
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Reactive data
const showFeatures = ref(false)
const currentTime = ref('')
const currentUser = ref('Admin User')
const userInitials = ref('AU')

// Features data

// Stats data
const stats = ref([
  {
    id: 1,
    label: 'Active Devices',
    value: '24',
    change: '+12%',
    trend: 'up',
    icon: 'fas fa-microchip',
    color: 'bg-gradient-to-r from-blue-500 to-blue-600',
  },
  {
    id: 2,
    label: 'Data Points',
    value: '1.2K',
    change: '+8%',
    trend: 'up',
    icon: 'fas fa-database',
    color: 'bg-gradient-to-r from-green-500 to-green-600',
  },
  {
    id: 3,
    label: 'Uptime',
    value: '99.9%',
    change: '+0.1%',
    trend: 'up',
    icon: 'fas fa-clock',
    color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
  },
  {
    id: 4,
    label: 'Alerts',
    value: '3',
    change: '-5',
    trend: 'down',
    icon: 'fas fa-exclamation-triangle',
    color: 'bg-gradient-to-r from-red-500 to-red-600',
  },
])

// Methods
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const navigateToMonitoring = () => {
  // Navigate to monitoring page
  console.log('Navigating to monitoring page...')
  // Router navigation would go here
}

// Lifecycle
onMounted(() => {
  updateTime()
  setInterval(updateTime, 60000) // Update every minute
})
</script>

<style scoped>
/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.6s ease-out;
}

/* Font Awesome icons (you may need to include Font Awesome in your project) */
.fas {
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}
</style>
