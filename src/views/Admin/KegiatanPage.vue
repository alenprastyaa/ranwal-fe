<template>
  <div class="p-6">
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Tambah Kegiatan</h2>
      <form @submit.prevent="createAction" class="space-y-4">
        <div class="flex space-x-3">
          <select
            v-model="selectedProgramId"
            class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Pilih Program</option>
            <option v-for="program in programs" :key="program.id" :value="program.id">
              {{ program.name }}
            </option>
          </select>
          <input
            v-model="actionName"
            type="text"
            placeholder="Nama kegiatan"
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
        <h2 class="text-xl font-semibold">Daftar Kegiatan</h2>
        <div class="flex space-x-2">
          <select
            v-model="filterProgramId"
            @change="fetchActions"
            class="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="">Semua Program</option>
            <option v-for="program in programs" :key="program.id" :value="program.id">
              {{ program.name }}
            </option>
          </select>
          <input
            v-model="searchQuery"
            @input="debounceSearch"
            type="text"
            placeholder="Cari kegiatan..."
            class="border border-gray-300 rounded px-3 py-1 text-sm w-40"
          />
        </div>
      </div>

      <div v-if="loading" class="text-gray-500 text-center py-4">Loading...</div>
      <div v-else-if="actions.length === 0" class="text-gray-500 text-center py-8">
        Tidak ada kegiatan ditemukan
      </div>
      <div v-else>
        <ul class="divide-y divide-gray-200 mb-4">
          <li
            v-for="action in actions"
            :key="action.id"
            class="py-3 flex items-center justify-between"
          >
            <div>
              <div class="font-medium text-gray-800">{{ action.name }}</div>
              <div class="text-sm text-gray-500">
                Program: {{ getProgramName(action.program_id) }}
              </div>
            </div>
            <button
              @click="confirmDelete(action)"
              :disabled="deletingIds.includes(action.id)"
              class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
            >
              {{ deletingIds.includes(action.id) ? 'Menghapus...' : 'Hapus' }}
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
const baseUrl = 'http://localhost:5002'

// Form data
const selectedProgramId = ref('')
const actionName = ref('')
const programs = ref([])

// List data
const actions = ref([])
const filterProgramId = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const limit = 5

// States
const loading = ref(false)
const isCreating = ref(false)
const deletingIds = ref([])

let searchTimeout = null

// Fetch programs for dropdown
const fetchPrograms = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/program/list`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    programs.value = res.data.data || []
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Gagal mengambil data program.',
    })
  }
}

// Fetch actions
const fetchActions = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit,
      search: searchQuery.value,
      uuid: filterProgramId.value,
    }

    const res = await axios.get(`${baseUrl}/api/action/list`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    })

    actions.value = res.data.data || []
    totalPages.value = Math.ceil((res.data.total || 0) / limit)
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Gagal mengambil data kegiatan.',
    })
  } finally {
    loading.value = false
  }
}

// Create action
const createAction = async () => {
  if (!selectedProgramId.value || !actionName.value) return

  isCreating.value = true
  try {
    await axios.post(
      `${baseUrl}/api/action/create`,
      {
        program_id: selectedProgramId.value,
        name: actionName.value,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Kegiatan berhasil ditambahkan.',
      showConfirmButton: false,
      timer: 1500,
    })

    actionName.value = ''
    selectedProgramId.value = ''
    fetchActions()
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Gagal menambahkan kegiatan.',
    })
  } finally {
    isCreating.value = false
  }
}

// Delete action with confirmation
const confirmDelete = async (action) => {
  const result = await Swal.fire({
    title: 'Konfirmasi Hapus',
    text: `Apakah Anda yakin ingin menghapus kegiatan "${action.name}"? Tindakan ini tidak dapat dibatalkan.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
  })

  if (result.isConfirmed) {
    deleteAction(action.id)
  }
}

const deleteAction = async (actionId) => {
  deletingIds.value.push(actionId)

  try {
    await axios.delete(`${baseUrl}/api/action/${actionId}/delete`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    Swal.fire({
      icon: 'success',
      title: 'Dihapus!',
      text: 'Kegiatan berhasil dihapus.',
      showConfirmButton: false,
      timer: 1500,
    })

    // Remove from local list for better UX
    actions.value = actions.value.filter((a) => a.id !== actionId)
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Gagal menghapus kegiatan.',
    })
  } finally {
    deletingIds.value = deletingIds.value.filter((id) => id !== actionId)
  }
}

// Helper functions
const getProgramName = (programId) => {
  const program = programs.value.find((p) => p.id === programId)
  return program ? program.name : 'Unknown Program'
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchActions()
  }
}

const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchActions()
  }, 500)
}

onMounted(() => {
  fetchPrograms()
  fetchActions()
})
</script>
