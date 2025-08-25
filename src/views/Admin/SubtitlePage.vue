<template>
  <div class="p-6">
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Tambah Subtitle</h2>
      <form @submit.prevent="createSubtitle" class="space-y-4">
        <div class="flex flex-col md:flex-row md:space-x-3 space-y-3 md:space-y-0">
          <select
            v-model="selectedActivityId"
            class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            required
          >
            <option value="">Pilih Aktivitas</option>
            <option v-for="activity in activities" :key="activity.id" :value="activity.id">
              {{ activity.name }}
            </option>
          </select>
          <input
            v-model="subtitleName"
            type="text"
            placeholder="Nama subtitle"
            class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            required
          />
          <button
            type="submit"
            :disabled="isCreating"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition duration-200"
          >
            {{ isCreating ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </form>
    </div>

    <div class="bg-white shadow rounded-lg p-6">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-2 md:space-y-0"
      >
        <h2 class="text-xl font-semibold text-gray-800">Daftar Subtitle</h2>
        <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
          <select
            v-model="filterActivityId"
            @change="fetchSubtitles"
            class="border border-gray-300 rounded px-3 py-2 text-sm w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            <option value="">Semua Aktivitas</option>
            <option v-for="activity in activities" :key="activity.id" :value="activity.id">
              {{ activity.name }}
            </option>
          </select>
          <input
            v-model="searchQuery"
            @input="debounceSearch"
            type="text"
            placeholder="Cari subtitle..."
            class="border border-gray-300 rounded px-3 py-2 text-sm w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>
      </div>

      <div v-if="loading" class="text-gray-500 text-center py-4">
        <svg class="animate-spin h-5 w-5 text-gray-500 inline-block mr-2" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading...
      </div>
      <div v-else-if="subtitles.length === 0" class="text-gray-500 text-center py-8">
        Tidak ada subtitle ditemukan
      </div>
      <div v-else>
        <ul class="divide-y divide-gray-200">
          <li
            v-for="subtitle in subtitles"
            :key="subtitle.id"
            class="py-4 flex flex-col md:flex-row items-start md:items-center justify-between"
          >
            <div class="mb-2 md:mb-0">
              <div class="font-medium text-gray-800">{{ subtitle.name }}</div>
              <div class="text-sm text-gray-500">
                Aktivitas: {{ getActivityName(subtitle.activity_id) }}
              </div>
            </div>
            <button
              @click="confirmDelete(subtitle)"
              :disabled="deletingIds.includes(subtitle.id)"
              class="bg-red-600 text-white px-3 py-1 rounded-full text-sm hover:bg-red-700 disabled:opacity-50 transition duration-200"
            >
              {{ deletingIds.includes(subtitle.id) ? 'Menghapus...' : 'Hapus' }}
            </button>
          </li>
        </ul>

        <div class="flex justify-between items-center mt-6">
          <div class="text-sm text-gray-500">Halaman {{ currentPage }} dari {{ totalPages }}</div>
          <div class="flex space-x-2">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage <= 1"
              class="px-4 py-2 border rounded-full text-sm disabled:opacity-50 transition duration-200 hover:bg-gray-100"
            >
              Sebelumnya
            </button>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage >= totalPages"
              class="px-4 py-2 border rounded-full text-sm disabled:opacity-50 transition duration-200 hover:bg-gray-100"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const token = localStorage.getItem('token')
const baseUrl = 'https://bitwisi.cloud/ranwal'

// Form data
const selectedActivityId = ref('')
const subtitleName = ref('')
const activities = ref([])

// List data
const subtitles = ref([])
const filterActivityId = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const limit = 5

// States
const loading = ref(false)
const isCreating = ref(false)
const deletingIds = ref([])

let searchTimeout = null

// Fetch activities for dropdown
const fetchActivities = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/activity/list`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page: 1, limit: 100 },
    })
    activities.value = res.data.data || []
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Gagal mengambil data aktivitas.',
    })
  }
}

// Fetch subtitles
const fetchSubtitles = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit,
      search: searchQuery.value,
      uuid: filterActivityId.value,
    }
    const res = await axios.get(`${baseUrl}/api/subtitle/list`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    })
    subtitles.value = res.data.data || []
    totalPages.value = Math.ceil((res.data.total || 0) / limit)
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Gagal mengambil data subtitle.',
    })
  } finally {
    loading.value = false
  }
}

// Create subtitle
const createSubtitle = async () => {
  if (!selectedActivityId.value || !subtitleName.value) {
    return Swal.fire({
      icon: 'warning',
      title: 'Input Tidak Lengkap',
      text: 'Harap lengkapi semua bidang.',
    })
  }

  isCreating.value = true
  try {
    await axios.post(
      `${baseUrl}/api/subtitle/create`,
      {
        activity_id: selectedActivityId.value,
        name: subtitleName.value,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Subtitle berhasil ditambahkan.',
      showConfirmButton: false,
      timer: 1500,
    })
    subtitleName.value = ''
    selectedActivityId.value = ''
    fetchSubtitles()
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Gagal menambahkan subtitle.',
    })
  } finally {
    isCreating.value = false
  }
}

// Delete subtitle with confirmation
const confirmDelete = async (subtitle) => {
  const result = await Swal.fire({
    title: 'Konfirmasi Hapus',
    text: `Apakah Anda yakin ingin menghapus subtitle "${subtitle.name}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
  })

  if (result.isConfirmed) {
    deleteSubtitle(subtitle.id)
  }
}

const deleteSubtitle = async (subtitleId) => {
  deletingIds.value.push(subtitleId)
  try {
    await axios.delete(`${baseUrl}/api/subtitle/${subtitleId}/delete`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    Swal.fire({
      icon: 'success',
      title: 'Dihapus!',
      text: 'Subtitle berhasil dihapus.',
      showConfirmButton: false,
      timer: 1500,
    })
    subtitles.value = subtitles.value.filter((s) => s.id !== subtitleId)
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Gagal menghapus subtitle.',
    })
  } finally {
    deletingIds.value = deletingIds.value.filter((id) => id !== subtitleId)
  }
}

// Helper functions
const getActivityName = (activityId) => {
  const activity = activities.value.find((a) => a.id === activityId)
  return activity ? activity.name : 'Unknown Activity'
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchSubtitles()
  }
}

const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchSubtitles()
  }, 500)
}

onMounted(() => {
  fetchActivities()
  fetchSubtitles()
})
</script>
