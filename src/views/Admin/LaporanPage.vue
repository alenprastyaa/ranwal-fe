<template>
  <div class="min-h-screen bg-gray-100 flex justify-center py-8">
    <div class="max-w-8xl w-full px-4 sm:px-6 lg:px-8">
      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-medium text-gray-900">Daftar Laporan Detail Program</h1>
          <div class="flex space-x-4">
            <button
              @click="downloadReport"
              :disabled="loading.download"
              class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading.download" class="flex items-center justify-center">
                <svg
                  class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
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
                Mengunduh...
              </span>
              <span v-else>Download Laporan</span>
            </button>
          </div>
        </div>

        <div v-if="reports.length === 0" class="text-center py-4 bg-gray-50 rounded-lg">
          <p class="text-gray-500">Tidak ada laporan tersedia</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full table-auto">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  No
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Komponen
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Program
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Pengampu
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Total
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Tanggal
                </th>
                <th
                  class="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(report, index) in reports" :key="report.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ index + 1 }}
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ report.component_name || report.component_code || '-' }}
                  </div>
                  <div class="text-sm text-gray-500">{{ report.component_code }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ report.program_name }}</div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  {{ report.supporter_name }}
                </td>
                <td class="px-6 py-4 text-sm font-medium text-blue-600">
                  Rp {{ formatNumber(report.total_after_tax || report.total_price) }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ formatDate(report.created_at) }}
                </td>
                <td class="px-6 py-4 text-center">
                  <div class="flex items-center justify-center space-x-2">
                    <button
                      @click="showDetail(report)"
                      class="inline-flex items-center justify-center w-8 h-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors duration-200"
                      title="Lihat Detail"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        ></path>
                      </svg>
                    </button>
                    <button
                      @click="deleteReport(report)"
                      :disabled="loading.delete === report.id"
                      class="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Hapus Laporan"
                    >
                      <svg
                        v-if="loading.delete === report.id"
                        class="animate-spin w-4 h-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
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
                      <svg
                        v-else
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Detail -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
        <div class="flex justify-between items-center p-6 border-b">
          <h2 class="text-xl font-semibold text-gray-900">Detail Laporan Program</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div v-if="selectedReport" class="p-6 space-y-4">
          <!-- Informasi Komponen -->
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold text-blue-900 mb-2">Informasi Komponen</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span class="font-medium text-gray-700">Nama Komponen:</span>
                <p class="text-gray-900">{{ selectedReport.component_name || '-' }}</p>
              </div>
              <div>
                <span class="font-medium text-gray-700">Kode Komponen:</span>
                <p class="text-gray-900">{{ selectedReport.component_code || '-' }}</p>
              </div>
            </div>
          </div>

          <!-- Hierarki Program -->
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold text-green-900 mb-2">Hierarki Program</h3>
            <div class="space-y-2 text-sm">
              <div v-if="selectedReport.program_name">
                <span class="font-medium text-gray-700">Program:</span>
                <p class="text-gray-900">{{ selectedReport.program_name }}</p>
              </div>
              <div v-if="selectedReport.action_name">
                <span class="font-medium text-gray-700">Kegiatan:</span>
                <p class="text-gray-900">{{ selectedReport.action_name }}</p>
              </div>
              <div v-if="selectedReport.sub_action_name">
                <span class="font-medium text-gray-700">Sub Kegiatan:</span>
                <p class="text-gray-900">{{ selectedReport.sub_action_name }}</p>
              </div>
              <div v-if="selectedReport.activity_name">
                <span class="font-medium text-gray-700">Aktivitas:</span>
                <p class="text-gray-900">{{ selectedReport.activity_name }}</p>
              </div>
              <div v-if="selectedReport.subtitle_name">
                <span class="font-medium text-gray-700">Sub Judul:</span>
                <p class="text-gray-900">{{ selectedReport.subtitle_name }}</p>
              </div>
            </div>
          </div>

          <!-- Informasi Keuangan -->
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h3 class="font-semibold text-yellow-900 mb-2">Informasi Keuangan</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span class="font-medium text-gray-700">Total Harga:</span>
                <p class="text-lg font-semibold text-blue-600">
                  Rp {{ formatNumber(selectedReport.total_price || 0) }}
                </p>
              </div>
              <div v-if="selectedReport.total_after_tax">
                <span class="font-medium text-gray-700">Total Setelah Pajak:</span>
                <p class="text-lg font-semibold text-green-600">
                  Rp {{ formatNumber(selectedReport.total_after_tax) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Informasi Tambahan -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-semibold text-gray-900 mb-2">Informasi Tambahan</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span class="font-medium text-gray-700">Pengampu:</span>
                <p class="text-gray-900">{{ selectedReport.supporter_name || '-' }}</p>
              </div>
              <div>
                <span class="font-medium text-gray-700">Tanggal Dibuat:</span>
                <p class="text-gray-900">{{ formatDate(selectedReport.created_at) }}</p>
              </div>
              <div v-if="selectedReport.id">
                <span class="font-medium text-gray-700">ID Laporan:</span>
                <p class="text-gray-900">{{ selectedReport.id }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end p-6 border-t">
          <button
            @click="closeModal"
            class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

const router = useRouter()
const token = localStorage.getItem('token')
const baseUrl = 'https://bitwisi.cloud/ranwal'

const reports = ref([])
const showModal = ref(false)
const selectedReport = ref(null)
const loading = reactive({
  reports: false,
  download: false,
  delete: null, // Will store the ID of the report being deleted
})

const showSuccess = (message) => {
  Swal.fire({
    icon: 'success',
    title: 'Berhasil!',
    text: message,
    showConfirmButton: false,
    timer: 2000,
    toast: true,
    position: 'top-end',
  })
}

const showError = (message) => {
  Swal.fire({
    icon: 'error',
    title: 'Gagal!',
    text: message,
    showConfirmButton: false,
    timer: 3000,
    toast: true,
    position: 'top-end',
  })
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  router.push('/login')
  showSuccess('Berhasil logout')
}

const showDetail = (report) => {
  selectedReport.value = report
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedReport.value = null
}

const api = {
  async get(endpoint, params = {}) {
    try {
      const res = await axios.get(`${baseUrl}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 100, ...params },
      })
      return res.data
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('userRole')
        router.push('/login')
      }
      throw error
    }
  },

  async delete(endpoint) {
    try {
      const res = await axios.delete(`${baseUrl}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return res.data
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('userRole')
        router.push('/login')
      }
      throw error
    }
  },
}

const fetchReports = async () => {
  loading.reports = true
  try {
    const response = await api.get('/api/detail-program/list')
    if (response.status === 200) {
      reports.value = response.data || []
    } else {
      showError('Gagal mengambil data laporan')
    }
  } catch (err) {
    showError('Gagal mengambil data laporan')
  } finally {
    loading.reports = false
  }
}

const deleteReport = async (report) => {
  // Show confirmation dialog
  const result = await Swal.fire({
    title: 'Konfirmasi Hapus',
    text: `Apakah Anda yakin ingin menghapus laporan "${report.program_name}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
    reverseButtons: true,
  })

  if (!result.isConfirmed) return

  loading.delete = report.id
  try {
    const response = await api.delete(`/api/detail-program/${report.id}/delete`)

    if (response.status === 200) {
      // Remove the deleted report from the list
      reports.value = reports.value.filter((r) => r.id !== report.id)
      showSuccess('Laporan berhasil dihapus')

      // Close modal if the deleted report was being viewed
      if (selectedReport.value?.id === report.id) {
        closeModal()
      }
    } else {
      showError('Gagal menghapus laporan')
    }
  } catch (err) {
    console.error('Delete error:', err)
    const errorMessage = err.response?.data?.message || 'Gagal menghapus laporan'
    showError(errorMessage)
  } finally {
    loading.delete = null
  }
}

const downloadReport = async () => {
  loading.download = true
  try {
    const response = await api.get('/api/detail-program/report', { year: 2025 })
    if (response.status === 200 && response.data && response.data.path) {
      const link = document.createElement('a')
      link.href = response.data.path
      link.download = response.data.originalName || response.data.filename || 'report.xlsx'
      link.target = '_blank' // Open in new tab as fallback
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      showSuccess('Berhasil mengunduh laporan')
    } else {
      showError('Gagal mengunduh laporan')
    }
  } catch (err) {
    console.error('Download error:', err)
    const errorMessage = err.response?.data?.message || 'Gagal mengunduh laporan'
    showError(errorMessage)
  } finally {
    loading.download = false
  }
}

const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(num || 0)

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

onMounted(() => {
  fetchReports()
})
</script>

<style scoped>
input:focus,
select:focus,
button:focus {
  outline: none;
  box-shadow: 0 0 0 2px #3b82f6;
}

.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

@media (max-width: 640px) {
  table {
    font-size: 14px;
  }

  th,
  td {
    padding: 8px 4px;
  }

  .modal-content {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
}

/* Modal animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
