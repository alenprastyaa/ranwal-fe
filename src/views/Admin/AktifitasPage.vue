<template>
  <div class="p-6">
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Tambah Aktivitas</h2>
      <form @submit.prevent="createActivity" class="space-y-4">
        <select
          v-model="selectedSubActionId"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          required
        >
          <option value="">Pilih Sub Kegiatan</option>
          <option v-for="subAction in subActions" :key="subAction.id" :value="subAction.id">
            {{ subAction.name }}
          </option>
        </select>

        <div class="flex flex-col md:flex-row md:space-x-3 space-y-3 md:space-y-0">
          <input
            v-model="activityName"
            type="text"
            placeholder="Nama aktivitas"
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
        <h2 class="text-xl font-semibold text-gray-800">Daftar Aktivitas</h2>
        <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
          <select
            v-model="filterSubActionId"
            @change="fetchActivities"
            class="border border-gray-300 rounded px-3 py-2 text-sm w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            <option value="">Semua Sub Kegiatan</option>
            <option v-for="subAction in subActions" :key="subAction.id" :value="subAction.id">
              {{ subAction.name }}
            </option>
          </select>
          <input
            v-model="searchQuery"
            @input="debounceSearch"
            type="text"
            placeholder="Cari aktivitas..."
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
      <div v-else-if="activities.length === 0" class="text-gray-500 text-center py-8">
        Tidak ada aktivitas ditemukan
      </div>
      <div v-else>
        <ul class="divide-y divide-gray-200">
          <li
            v-for="activity in activities"
            :key="activity.id"
            class="py-4 flex flex-col md:flex-row items-start md:items-center justify-between"
          >
            <div class="mb-2 md:mb-0">
              <div class="font-medium text-gray-800">{{ activity.name }}</div>
              <div class="text-sm text-gray-500">
                Sub Kegiatan: {{ getSubActionName(activity.sub_action_id) }}
              </div>
            </div>
            <div class="flex space-x-2">
              <button
                @click="startEdit(activity)"
                class="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition duration-200"
              >
                Edit
              </button>
              <button
                @click="confirmDelete(activity)"
                :disabled="deletingIds.includes(activity.id)"
                class="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 transition duration-200"
              >
                {{ deletingIds.includes(activity.id) ? 'Menghapus...' : 'Hapus' }}
              </button>
            </div>
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

    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-xl transform transition-all">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">Edit Aktivitas</h2>
        <form @submit.prevent="updateActivity" class="space-y-4">
          <select
            v-model="editedSubActionId"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Pilih Sub Kegiatan</option>
            <option v-for="subAction in subActions" :key="subAction.id" :value="subAction.id">
              {{ subAction.name }}
            </option>
          </select>
          <input
            v-model="editedName"
            type="text"
            placeholder="Nama aktivitas"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div class="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              @click="cancelEdit"
              class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
            >
              Batal
            </button>
            <button
              type="submit"
              class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
            >
              Perbarui
            </button>
          </div>
        </form>
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
const selectedSubActionId = ref('')
const activityName = ref('')
const subActions = ref([])

// List data
const activities = ref([])
const filterSubActionId = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const limit = 5

// States
const loading = ref(false)
const isCreating = ref(false)
const deletingIds = ref([])

// Edit modal states
const showEditModal = ref(false)
const editActivity = ref(null)
const editedName = ref('')
const editedSubActionId = ref('')

let searchTimeout = null

// Fetch sub actions for dropdown
const fetchSubActions = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/sub-action/list`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page: 1, limit: 100 },
    })
    subActions.value = res.data.data || []
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Gagal mengambil data sub kegiatan.',
    })
  }
}

// Fetch activities
const fetchActivities = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit,
      search: searchQuery.value,
      uuid: filterSubActionId.value,
    }
    const res = await axios.get(`${baseUrl}/api/activity/list`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    })
    activities.value = res.data.data || []
    totalPages.value = res.data.filter ? res.data.filter.total_page : 1
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Gagal mengambil data aktivitas.',
    })
  } finally {
    loading.value = false
  }
}

// Create activity
const createActivity = async () => {
  if (!selectedSubActionId.value || !activityName.value) {
    return Swal.fire({
      icon: 'warning',
      title: 'Input Tidak Lengkap',
      text: 'Harap lengkapi semua bidang.',
    })
  }

  isCreating.value = true
  try {
    await axios.post(
      `${baseUrl}/api/activity/create`,
      {
        sub_action_id: selectedSubActionId.value,
        name: activityName.value,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Aktivitas berhasil ditambahkan.',
      showConfirmButton: false,
      timer: 1500,
    })
    activityName.value = ''
    selectedSubActionId.value = ''
    fetchActivities()
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Gagal menambahkan aktivitas.',
    })
  } finally {
    isCreating.value = false
  }
}

// Start edit process
const startEdit = (activity) => {
  editActivity.value = activity
  editedName.value = activity.name
  editedSubActionId.value = activity.sub_action_id
  showEditModal.value = true
}

// Update activity
const updateActivity = async () => {
  if (!editActivity.value || !editedName.value || !editedSubActionId.value) {
    return Swal.fire({
      icon: 'warning',
      title: 'Input Tidak Lengkap',
      text: 'Harap lengkapi semua bidang.',
    })
  }

  try {
    await axios.put(
      `${baseUrl}/api/activity/${editActivity.value.id}/update`,
      {
        name: editedName.value,
        sub_action_id: editedSubActionId.value,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )

    Swal.fire({
      icon: 'success',
      title: 'Diperbarui!',
      text: 'Aktivitas berhasil diperbarui.',
      showConfirmButton: false,
      timer: 1500,
    })

    cancelEdit()
    fetchActivities()
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Gagal memperbarui aktivitas.',
    })
  }
}

// Cancel edit
const cancelEdit = () => {
  showEditModal.value = false
  editActivity.value = null
  editedName.value = ''
  editedSubActionId.value = ''
}

// Delete activity with confirmation
const confirmDelete = async (activity) => {
  const result = await Swal.fire({
    title: 'Konfirmasi Hapus',
    text: `Apakah Anda yakin ingin menghapus aktivitas "${activity.name}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
  })

  if (result.isConfirmed) {
    deleteActivity(activity.id)
  }
}

const deleteActivity = async (activityId) => {
  deletingIds.value.push(activityId)
  try {
    await axios.delete(`${baseUrl}/api/activity/${activityId}/delete`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    Swal.fire({
      icon: 'success',
      title: 'Dihapus!',
      text: 'Aktivitas berhasil dihapus.',
      showConfirmButton: false,
      timer: 1500,
    })
    activities.value = activities.value.filter((a) => a.id !== activityId)
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Gagal menghapus aktivitas.',
    })
  } finally {
    deletingIds.value = deletingIds.value.filter((id) => id !== activityId)
  }
}

// Helper functions
const getSubActionName = (subActionId) => {
  const subAction = subActions.value.find((sa) => sa.id === subActionId)
  return subAction ? subAction.name : 'Unknown Sub Action'
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchActivities()
  }
}

const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchActivities()
  }, 500)
}

onMounted(() => {
  fetchSubActions()
  fetchActivities()
})
</script>