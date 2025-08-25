<template>
  <div class="p-6">
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Tambah Sub Kegiatan</h2>
      <form @submit.prevent="createSubAction" class="space-y-4">
        <div class="flex space-x-3">
          <select
            v-model="selectedActionId"
            class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Pilih Kegiatan</option>
            <option v-for="action in actions" :key="action.id" :value="action.id">
              {{ action.name }}
            </option>
          </select>
          <input
            v-model="subActionName"
            type="text"
            placeholder="Nama sub kegiatan"
            class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            :disabled="isCreating"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ isCreating ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </form>
    </div>

    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Daftar Sub Kegiatan</h2>
        <div class="flex space-x-2">
          <select
            v-model="filterActionId"
            @change="fetchSubActions"
            class="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="">Semua Kegiatan</option>
            <option v-for="action in actions" :key="action.id" :value="action.id">
              {{ action.name }}
            </option>
          </select>
          <input
            v-model="searchQuery"
            @input="debounceSearch"
            type="text"
            placeholder="Cari sub kegiatan..."
            class="border border-gray-300 rounded px-3 py-1 text-sm w-40"
          />
        </div>
      </div>

      <div v-if="loading" class="text-gray-500 text-center py-4">Loading...</div>
      <div v-else-if="subActions.length === 0" class="text-gray-500 text-center py-8">
        Tidak ada sub kegiatan ditemukan
      </div>
      <div v-else>
        <ul class="divide-y divide-gray-200 mb-4">
          <li
            v-for="subAction in subActions"
            :key="subAction.id"
            class="py-3 flex items-center justify-between"
          >
            <div>
              <div class="font-medium text-gray-800">{{ subAction.name }}</div>
              <div class="text-sm text-gray-500">
                Kegiatan: {{ getActionName(subAction.action_id) }}
              </div>
            </div>
            <button
              @click="confirmDelete(subAction)"
              :disabled="deletingIds.includes(subAction.id)"
              class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
            >
              {{ deletingIds.includes(subAction.id) ? 'Menghapus...' : 'Hapus' }}
            </button>
          </li>
        </ul>

        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-500">Halaman {{ currentPage }} dari {{ totalPages }}</div>
          <div class="flex space-x-2">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage <= 1"
              class="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              Sebelumnya
            </button>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage >= totalPages"
              class="px-3 py-1 border rounded text-sm disabled:opacity-50"
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
const selectedActionId = ref('')
const subActionName = ref('')
const actions = ref([])

// List data
const subActions = ref([])
const filterActionId = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const limit = 5

// States
const loading = ref(false)
const isCreating = ref(false)
const deletingIds = ref([])

let searchTimeout = null

// Fetch actions for dropdown
const fetchActions = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/action/list`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page: 1, limit: 100 }, // Get all actions for dropdown
    })
    actions.value = res.data.data || []
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Gagal mengambil data kegiatan.',
    })
  }
}

// Fetch sub actions
const fetchSubActions = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit,
      search: searchQuery.value,
      uuid: filterActionId.value,
    }

    const res = await axios.get(`${baseUrl}/api/sub-action/list`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    })

    subActions.value = res.data.data || []
    totalPages.value = Math.ceil((res.data.total || 0) / limit)
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Gagal mengambil data sub kegiatan.',
    })
  } finally {
    loading.value = false
  }
}

// Create sub action
const createSubAction = async () => {
  if (!selectedActionId.value || !subActionName.value) return

  isCreating.value = true
  try {
    await axios.post(
      `${baseUrl}/api/sub-action/create`,
      {
        action_id: selectedActionId.value,
        name: subActionName.value,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Sub kegiatan berhasil ditambahkan.',
      showConfirmButton: false,
      timer: 1500,
    })

    subActionName.value = ''
    selectedActionId.value = ''
    fetchSubActions()
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Gagal menambahkan sub kegiatan.',
    })
  } finally {
    isCreating.value = false
  }
}

// Delete sub action with confirmation
const confirmDelete = async (subAction) => {
  const result = await Swal.fire({
    title: 'Konfirmasi Hapus',
    text: `Apakah Anda yakin ingin menghapus sub kegiatan "${subAction.name}"? Tindakan ini tidak dapat dibatalkan.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
  })

  if (result.isConfirmed) {
    deleteSubAction(subAction.id)
  }
}

const deleteSubAction = async (subActionId) => {
  deletingIds.value.push(subActionId)

  try {
    await axios.delete(`${baseUrl}/api/sub-action/${subActionId}/delete`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    Swal.fire({
      icon: 'success',
      title: 'Dihapus!',
      text: 'Sub kegiatan berhasil dihapus.',
      showConfirmButton: false,
      timer: 1500,
    })

    // Remove from local list for better UX
    subActions.value = subActions.value.filter((a) => a.id !== subActionId)
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Gagal menghapus sub kegiatan.',
    })
  } finally {
    deletingIds.value = deletingIds.value.filter((id) => id !== subActionId)
  }
}

// Helper functions
const getActionName = (actionId) => {
  const action = actions.value.find((a) => a.id === actionId)
  return action ? action.name : 'Unknown Action'
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchSubActions()
  }
}

const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchSubActions()
  }, 500)
}

onMounted(() => {
  fetchActions()
  fetchSubActions()
})
</script>
