<template>
  <div class="p-6">
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Tambah Kode Rekening</h2>
      <form @submit.prevent="createAccount" class="space-y-4">
        <div class="flex flex-col md:flex-row md:space-x-3 space-y-3 md:space-y-0">
          <select
            v-model="selectedSubtitleId"
            class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            required
          >
            <option value="">Pilih Subtitle</option>
            <option v-for="subtitle in subtitles" :key="subtitle.id" :value="subtitle.id">
              {{ subtitle.name }}
            </option>
          </select>
          <input
            v-model="accountCode"
            type="text"
            placeholder="Kode rekening"
            class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            required
          />
          <input
            v-model="accountName"
            type="text"
            placeholder="Nama kode rekening"
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
        <h2 class="text-xl font-semibold text-gray-800">Daftar Kode Rekening</h2>
        <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
          <select
            v-model="filterSubtitleId"
            @change="fetchAccounts"
            class="border border-gray-300 rounded px-3 py-2 text-sm w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            <option value="">Semua Subtitle</option>
            <option v-for="subtitle in subtitles" :key="subtitle.id" :value="subtitle.id">
              {{ subtitle.name }}
            </option>
          </select>
          <input
            v-model="searchQuery"
            @input="debounceSearch"
            type="text"
            placeholder="Cari kode rekening..."
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
      <div v-else-if="accounts.length === 0" class="text-gray-500 text-center py-8">
        Tidak ada kode rekening ditemukan
      </div>
      <div v-else>
        <ul class="divide-y divide-gray-200">
          <li
            v-for="account in accounts"
            :key="account.id"
            class="py-4 flex flex-col md:flex-row items-start md:items-center justify-between"
          >
            <div class="mb-2 md:mb-0">
              <div class="font-medium text-gray-800">{{ account.code }} - {{ account.name }}</div>
              <div class="text-sm text-gray-500">
                Subtitle: {{ getSubtitleName(account.subtitle_id) }}
              </div>
            </div>
            <button
              @click="confirmDelete(account)"
              :disabled="deletingIds.includes(account.id)"
              class="bg-red-600 text-white px-3 py-1 rounded-full text-sm hover:bg-red-700 disabled:opacity-50 transition duration-200"
            >
              {{ deletingIds.includes(account.id) ? 'Menghapus...' : 'Hapus' }}
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
const baseUrl = 'http://localhost:5002'

// Form data
const selectedSubtitleId = ref('')
const accountCode = ref('')
const accountName = ref('')
const subtitles = ref([])

// List data
const accounts = ref([])
const filterSubtitleId = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const limit = 5

// States
const loading = ref(false)
const isCreating = ref(false)
const deletingIds = ref([])

let searchTimeout = null

// Fetch subtitles for dropdown
const fetchSubtitles = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/subtitle/list`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page: 1, limit: 100 },
    })
    subtitles.value = res.data.data || []
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Gagal mengambil data subtitle.',
    })
  }
}

// Fetch accounts
const fetchAccounts = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit,
      search: searchQuery.value,
      uuid: filterSubtitleId.value,
    }
    const res = await axios.get(`${baseUrl}/api/account/list`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    })
    accounts.value = res.data.data || []
    totalPages.value = Math.ceil((res.data.total || 0) / limit)
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Gagal mengambil data kode rekening.',
    })
  } finally {
    loading.value = false
  }
}

// Create account
const createAccount = async () => {
  if (!selectedSubtitleId.value || !accountCode.value || !accountName.value) {
    return Swal.fire({
      icon: 'warning',
      title: 'Input Tidak Lengkap',
      text: 'Harap lengkapi semua bidang.',
    })
  }

  isCreating.value = true
  try {
    await axios.post(
      `${baseUrl}/api/account/create`,
      {
        subtitle_id: selectedSubtitleId.value,
        code: accountCode.value,
        name: accountName.value,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Kode rekening berhasil ditambahkan.',
      showConfirmButton: false,
      timer: 1500,
    })
    accountCode.value = ''
    accountName.value = ''
    selectedSubtitleId.value = ''
    fetchAccounts()
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Gagal menambahkan kode rekening.',
    })
  } finally {
    isCreating.value = false
  }
}

// Delete account with confirmation
const confirmDelete = async (account) => {
  const result = await Swal.fire({
    title: 'Konfirmasi Hapus',
    text: `Apakah Anda yakin ingin menghapus kode rekening "${account.code} - ${account.name}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
  })

  if (result.isConfirmed) {
    deleteAccount(account.id)
  }
}

const deleteAccount = async (accountId) => {
  deletingIds.value.push(accountId)
  try {
    await axios.delete(`${baseUrl}/api/account/${accountId}/delete`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    Swal.fire({
      icon: 'success',
      title: 'Dihapus!',
      text: 'Kode rekening berhasil dihapus.',
      showConfirmButton: false,
      timer: 1500,
    })
    accounts.value = accounts.value.filter((a) => a.id !== accountId)
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Gagal menghapus kode rekening.',
    })
  } finally {
    deletingIds.value = deletingIds.value.filter((id) => id !== accountId)
  }
}

// Helper functions
const getSubtitleName = (subtitleId) => {
  const subtitle = subtitles.value.find((s) => s.id === subtitleId)
  return subtitle ? subtitle.name : 'Unknown Subtitle'
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchAccounts()
  }
}

const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchAccounts()
  }, 500)
}

onMounted(() => {
  fetchSubtitles()
  fetchAccounts()
})
</script>
