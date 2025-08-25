<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Daftar Laporan</h1>

    <div v-if="loading" class="flex justify-center items-center h-48">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>

    <div v-else-if="error" class="text-red-500 text-center py-8">
      Terjadi kesalahan saat memuat data: {{ error }}
    </div>

    <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full leading-normal">
          <thead class="bg-gray-200">
            <tr>
              <th
                class="px-5 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Nama Program
              </th>
              <th
                class="px-5 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Nama Komponen
              </th>
              <th
                class="px-5 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Total Harga
              </th>
              <th
                class="px-5 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Tahun
              </th>
              <th
                class="px-5 py-3 border-b-2 border-gray-300 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in reports" :key="item.id" class="hover:bg-gray-100">
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p class="text-gray-900 whitespace-no-wrap">{{ item.program_name }}</p>
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p class="text-gray-900 whitespace-no-wrap">{{ item.component_name }}</p>
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p class="text-gray-900 whitespace-no-wrap">
                  Rp{{ formatNumber(item.total_after_tax) }}
                </p>
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p class="text-gray-900 whitespace-no-wrap">{{ item.year }}</p>
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                <button
                  @click="showModal(item)"
                  class="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fill-rule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
      >
        <div
          class="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl"
        >
          <div class="flex justify-between items-center pb-3">
            <h3 class="text-2xl leading-6 font-medium text-gray-900">Detail Laporan</h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div v-if="selectedReport" class="mt-2 space-y-4">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="font-semibold text-gray-600">Nama Program:</p>
                <p class="text-gray-900">{{ selectedReport.program_name }}</p>
              </div>
              <div>
                <p class="font-semibold text-gray-600">Nama Komponen:</p>
                <p class="text-gray-900">{{ selectedReport.component_name }}</p>
              </div>
              <div>
                <p class="font-semibold text-gray-600">Kode Akun:</p>
                <p class="text-gray-900">{{ selectedReport.account_code }}</p>
              </div>
              <div>
                <p class="font-semibold text-gray-600">Nama Akun:</p>
                <p class="text-gray-900">{{ selectedReport.account_name }}</p>
              </div>
              <div>
                <p class="font-semibold text-gray-600">Harga:</p>
                <p class="text-gray-900">Rp{{ formatNumber(selectedReport.price) }}</p>
              </div>
              <div>
                <p class="font-semibold text-gray-600">Volume 1:</p>
                <p class="text-gray-900">
                  {{ selectedReport.first_volume }} {{ selectedReport.unit }}
                </p>
              </div>
              <div>
                <p class="font-semibold text-gray-600">Volume 2:</p>
                <p class="text-gray-900">
                  {{ selectedReport.second_volume }} {{ selectedReport.unit }}
                </p>
              </div>
              <div>
                <p class="font-semibold text-gray-600">Volume 3:</p>
                <p class="text-gray-900">
                  {{ selectedReport.third_volume }} {{ selectedReport.unit }}
                </p>
              </div>
              <div>
                <p class="font-semibold text-gray-600">Total Harga:</p>
                <p class="text-gray-900">Rp{{ formatNumber(selectedReport.total_price) }}</p>
              </div>
              <div>
                <p class="font-semibold text-gray-600">Pajak:</p>
                <p class="text-gray-900">Rp{{ formatNumber(selectedReport.tax) }}</p>
              </div>
              <div class="col-span-2">
                <p class="font-semibold text-gray-600">Total Setelah Pajak:</p>
                <p class="text-lg font-bold text-green-600">
                  Rp{{ formatNumber(selectedReport.total_after_tax) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// State Management
const reports = ref([])
const selectedReport = ref(null)
const isModalOpen = ref(false)
const loading = ref(true)
const error = ref(null)

// Fungsi untuk mengambil data dari API
const fetchData = async () => {
  try {
    // 1. Ambil token dari localStorage
    const token = localStorage.getItem('token')

    // 2. Jika tidak ada token, berikan pesan error
    if (!token) {
      throw new Error('Tidak ada token autentikasi. Harap login terlebih dahulu.')
    }

    // 3. Konfigurasi header untuk request Axios
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    // 4. Lakukan request GET dengan Axios, sertakan konfigurasi header
    const response = await axios.get('https://bitwisi.cloud/ranwal/api/detail-program/list', config)

    // 5. Cek status respons dari API
    if (response.data.status !== 200) {
      throw new Error(response.data.message || 'Gagal memuat data.')
    }

    reports.value = response.data.data
  } catch (err) {
    // 6. Penanganan error:
    //    - Jika error dari Axios (misal status 401, 403), pesan error akan lebih informatif.
    //    - Jika error dari throw di atas, pesan error akan ditampilkan
    if (axios.isAxiosError(err)) {
      error.value = `Gagal memuat data: ${err.response?.status} - ${err.response?.statusText}`
      console.error('Axios Error:', err.response)
    } else {
      error.value = err.message
      console.error('General Error:', err)
    }
  } finally {
    loading.value = false
  }
}

// Fungsi untuk menampilkan modal detail
const showModal = (report) => {
  selectedReport.value = report
  isModalOpen.value = true
}

// Fungsi untuk menutup modal
const closeModal = () => {
  isModalOpen.value = false
  selectedReport.value = null
}

// Fungsi untuk memformat angka menjadi format mata uang
const formatNumber = (value) => {
  return new Intl.NumberFormat('id-ID').format(value)
}

// Panggil API saat komponen pertama kali dimuat
onMounted(fetchData)
</script>

<style scoped>
/* Tambahkan atau sesuaikan styling Tailwind CSS jika diperlukan */
</style>
