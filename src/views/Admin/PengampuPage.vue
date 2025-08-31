<template>
  <div class="p-6">
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Tambah Pengampu</h2>
      <form @submit.prevent="createPengampu" class="space-y-4">
        <div class="flex flex-col md:flex-row md:space-x-3 space-y-3 md:space-y-0">
          <input
            v-model="pengampuName"
            type="text"
            placeholder="Nama pengampu"
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
        <h2 class="text-xl font-semibold text-gray-800">Daftar Pengampu</h2>
        <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
          <input
            v-model="searchQuery"
            @input="debounceSearch"
            type="text"
            placeholder="Cari pengampu..."
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
      <div v-else-if="pengampus.length === 0" class="text-gray-500 text-center py-8">
        Tidak ada pengampu ditemukan
      </div>
      <div v-else>
        <ul class="divide-y divide-gray-200">
          <li
            v-for="pengampu in pengampus"
            :key="pengampu.id"
            class="py-4 flex flex-col md:flex-row items-start md:items-center justify-between"
          >
            <div class="mb-2 md:mb-0">
              <div class="font-medium text-gray-800">{{ pengampu.name }}</div>
              <div class="text-sm text-gray-500">ID: {{ pengampu.id }}</div>
            </div>
            <div class="flex space-x-2">
              <button
                @click="startEdit(pengampu)"
                class="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition duration-200"
              >
                Edit
              </button>
              <button
                @click="confirmDelete(pengampu)"
                :disabled="deletingIds.includes(pengampu.id)"
                class="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 transition duration-200"
              >
                {{ deletingIds.includes(pengampu.id) ? 'Menghapus...' : 'Hapus' }}
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
      <div class="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl transform transition-all">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">Edit Pengampu</h2>
        <form @submit.prevent="updatePengampu" class="space-y-4">
          <input
            v-model="editedName"
            type="text"
            placeholder="Nama pengampu"
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
const pengampuName = ref('')

// List data
const pengampus = ref([])
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
const editPengampu = ref(null)
const editedName = ref('')

let searchTimeout = null

// Fetch pengampus
const fetchPengampus = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit,
      search: searchQuery.value,
    }
    const res = await axios.get(`${baseUrl}/api/supporter/list`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    })
    pengampus.value = res.data.data || []
    totalPages.value = res.data.filter ? res.data.filter.total_page : 1
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Gagal mengambil data pengampu.',
    })
  } finally {
    loading.value = false
  }
}

// Create pengampu
const createPengampu = async () => {
  if (!pengampuName.value) {
    return Swal.fire({
      icon: 'warning',
      title: 'Input Tidak Lengkap',
      text: 'Nama pengampu harus diisi.',
    })
  }

  isCreating.value = true
  try {
    await axios.post(
      `${baseUrl}/api/supporter/create`,
      {
        name: pengampuName.value,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Pengampu berhasil ditambahkan.',
      showConfirmButton: false,
      timer: 1500,
    })
    pengampuName.value = ''
    fetchPengampus()
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Gagal menambahkan pengampu.',
    })
  } finally {
    isCreating.value = false
  }
}

// Start edit process
const startEdit = (pengampu) => {
  editPengampu.value = pengampu
  editedName.value = pengampu.name
  showEditModal.value = true
}

// Update pengampu
const updatePengampu = async () => {
  if (!editPengampu.value || !editedName.value) {
    return Swal.fire({
      icon: 'warning',
      title: 'Input Tidak Lengkap',
      text: 'Nama pengampu tidak boleh kosong.',
    })
  }

  try {
    await axios.put(
      `${baseUrl}/api/supporter/${editPengampu.value.id}/update`,
      {
        name: editedName.value,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )

    Swal.fire({
      icon: 'success',
      title: 'Diperbarui!',
      text: 'Pengampu berhasil diperbarui.',
      showConfirmButton: false,
      timer: 1500,
    })

    cancelEdit()
    fetchPengampus()
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Gagal memperbarui pengampu.',
    })
  }
}

// Cancel edit
const cancelEdit = () => {
  showEditModal.value = false
  editPengampu.value = null
  editedName.value = ''
}

// Delete pengampu with confirmation
const confirmDelete = async (pengampu) => {
  const result = await Swal.fire({
    title: 'Konfirmasi Hapus',
    text: `Apakah Anda yakin ingin menghapus pengampu "${pengampu.name}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
  })

  if (result.isConfirmed) {
    deletePengampu(pengampu.id)
  }
}

const deletePengampu = async (pengampuId) => {
  deletingIds.value.push(pengampuId)
  try {
    await axios.delete(`${baseUrl}/api/supporter/${pengampuId}/delete`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    Swal.fire({
      icon: 'success',
      title: 'Dihapus!',
      text: 'Pengampu berhasil dihapus.',
      showConfirmButton: false,
      timer: 1500,
    })
    pengampus.value = pengampus.value.filter((p) => p.id !== pengampuId)
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Gagal menghapus pengampu.',
    })
  } finally {
    deletingIds.value = deletingIds.value.filter((id) => id !== pengampuId)
  }
}

// Helper functions
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchPengampus()
  }
}

const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchPengampus()
  }, 500)
}

onMounted(() => {
  fetchPengampus()
})
</script>