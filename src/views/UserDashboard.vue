<template>
  <div class="min-h-screen bg-gray-100 flex justify-center py-8">
    <div class="max-w-2xl w-full px-4 sm:px-6 lg:px-8">
      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-medium text-gray-900">Sistem Manajemen Program</h1>
          <button
            @click="logout"
            class="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Program</label>
            <select
              v-model="selectedData.program"
              @change="selectProgram"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option :value="null" disabled>Pilih Program</option>
              <option v-for="program in programs" :key="program.id" :value="program">
                {{ program.name }}
              </option>
            </select>
            <p v-if="programs.length === 0" class="text-sm text-gray-500 mt-1">
              Tambahkan program pertama Anda untuk memulai
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kegiatan</label>
            <div
              v-if="!selectedData.program"
              class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3"
            >
              <p class="text-yellow-700 text-sm">Silakan pilih program terlebih dahulu.</p>
            </div>
            <select
              v-model="selectedData.action"
              @change="selectAction"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="!selectedData.program"
            >
              <option :value="null" disabled>Pilih Kegiatan</option>
              <option v-for="action in actions" :key="action.id" :value="action">
                {{ action.name }}
              </option>
            </select>
            <p
              v-if="selectedData.program && actions.length === 0"
              class="text-sm text-gray-500 mt-1"
            >
              Tidak ada kegiatan tersedia untuk program ini.
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sub Kegiatan</label>
            <div
              v-if="!selectedData.action"
              class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3"
            >
              <p class="text-yellow-700 text-sm">Silakan pilih kegiatan terlebih dahulu.</p>
            </div>
            <select
              v-model="selectedData.subAction"
              @change="selectSubAction"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="!selectedData.action"
            >
              <option :value="null" disabled>Pilih Sub Kegiatan</option>
              <option v-for="subAction in subActions" :key="subAction.id" :value="subAction">
                {{ subAction.name }}
              </option>
            </select>
            <p
              v-if="selectedData.action && subActions.length === 0"
              class="text-sm text-gray-500 mt-1"
            >
              Tidak ada sub kegiatan tersedia untuk kegiatan ini.
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Aktivitas</label>
            <div
              v-if="!selectedData.subAction"
              class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3"
            >
              <p class="text-yellow-700 text-sm">Silakan pilih sub kegiatan terlebih dahulu.</p>
            </div>
            <select
              v-model="selectedData.activity"
              @change="selectActivity"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="!selectedData.subAction"
            >
              <option :value="null" disabled>Pilih Aktivitas</option>
              <option v-for="activity in activities" :key="activity.id" :value="activity">
                {{ activity.name }}
              </option>
            </select>
            <p
              v-if="selectedData.subAction && activities.length === 0"
              class="text-sm text-gray-500 mt-1"
            >
              Tidak ada aktivitas tersedia untuk sub kegiatan ini.
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <div
              v-if="!selectedData.activity"
              class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3"
            >
              <p class="text-yellow-700 text-sm">Silakan pilih aktivitas terlebih dahulu.</p>
            </div>
            <select
              v-model="selectedData.subtitle"
              @change="selectSubtitle"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="!selectedData.activity"
            >
              <option :value="null" disabled>Pilih Subtitle</option>
              <option v-for="subtitle in subtitles" :key="subtitle.id" :value="subtitle">
                {{ subtitle.name }}
              </option>
            </select>
            <p
              v-if="selectedData.activity && subtitles.length === 0"
              class="text-sm text-gray-500 mt-1"
            >
              Tidak ada subtitle tersedia untuk aktivitas ini.
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kode Rekening</label>
            <div
              v-if="!selectedData.subtitle"
              class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3"
            >
              <p class="text-yellow-700 text-sm">Silakan pilih subtitle terlebih dahulu.</p>
            </div>
            <select
              v-model="selectedData.account"
              @change="selectAccount"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="!selectedData.subtitle"
            >
              <option :value="null" disabled>Pilih Kode Rekening</option>
              <option v-for="account in accounts" :key="account.id" :value="account">
                {{ account.code }} - {{ account.name }}
              </option>
            </select>
            <p
              v-if="selectedData.subtitle && accounts.length === 0"
              class="text-sm text-gray-500 mt-1"
            >
              Tidak ada kode rekening tersedia untuk subtitle ini.
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Pengampu</label>
            <select
              v-model="selectedData.supporter"
              @change="selectSupporter"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option :value="null" disabled>Pilih Pengampu</option>
              <option v-for="supporter in supporters" :key="supporter.id" :value="supporter">
                {{ supporter.name }}
              </option>
            </select>
            <p v-if="supporters.length === 0" class="text-sm text-gray-500 mt-1">
              Tidak ada pengampu tersedia.
            </p>
          </div>

          <div>
            <h2 class="text-lg font-medium text-gray-900 mb-3">Buat Laporan Detail Program</h2>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 class="text-base font-medium text-blue-900 mb-3">Hierarki Terpilih</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div class="bg-white rounded-lg p-2">
                  <span class="text-blue-700 font-medium">Program: </span>
                  <span class="font-medium text-gray-900">{{
                    selectedData.program?.name || 'Belum dipilih'
                  }}</span>
                </div>
                <div class="bg-white rounded-lg p-2">
                  <span class="text-blue-700 font-medium">Kegiatan: </span>
                  <span class="font-medium text-gray-900">{{
                    selectedData.action?.name || 'Belum dipilih'
                  }}</span>
                </div>
                <div class="bg-white rounded-lg p-2">
                  <span class="text-blue-700 font-medium">Sub Kegiatan: </span>
                  <span class="font-medium text-gray-900">{{
                    selectedData.subAction?.name || 'Belum dipilih'
                  }}</span>
                </div>
                <div class="bg-white rounded-lg p-2">
                  <span class="text-blue-700 font-medium">Aktivitas: </span>
                  <span class="font-medium text-gray-900">{{
                    selectedData.activity?.name || 'Belum dipilih'
                  }}</span>
                </div>
                <div class="bg-white rounded-lg p-2">
                  <span class="text-blue-700 font-medium">Subtitle: </span>
                  <span class="font-medium text-gray-900">{{
                    selectedData.subtitle?.name || 'Belum dipilih'
                  }}</span>
                </div>
                <div class="bg-white rounded-lg p-2">
                  <span class="text-blue-700 font-medium">Kode Rekening: </span>
                  <span class="font-medium text-gray-900">{{
                    selectedData.account
                      ? `${selectedData.account.code} - ${selectedData.account.name}`
                      : 'Belum dipilih'
                  }}</span>
                </div>
                <div class="bg-white rounded-lg p-2">
                  <span class="text-blue-700 font-medium">Pengampu: </span>
                  <span class="font-medium text-gray-900">{{
                    selectedData.supporter?.name || 'Belum dipilih'
                  }}</span>
                </div>
              </div>
            </div>

            <div
              v-if="!canCreateReport"
              class="bg-red-50 border border-red-200 rounded-lg p-3 mb-3"
            >
              <p class="text-red-700 text-sm">Lengkapi semua hierarki terlebih dahulu.</p>
            </div>

            <form v-if="canCreateReport" @submit.prevent="createReport" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Kode Komponen</label>
                  <input
                    v-model="reportForm.component_code"
                    type="text"
                    placeholder="Masukkan kode komponen"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nama Komponen</label>
                  <input
                    v-model="reportForm.component_name"
                    type="text"
                    placeholder="Masukkan nama komponen"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Spesifikasi</label>
                <textarea
                  v-model="reportForm.specification"
                  placeholder="Masukkan spesifikasi detail"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                ></textarea>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
                  <input
                    v-model="reportForm.unit"
                    type="text"
                    placeholder="Pcs"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Harga</label>
                  <input
                    v-model.number="reportForm.price"
                    type="number"
                    placeholder="0"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @input="calculateTotal"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Volume 1</label>
                  <input
                    v-model.number="reportForm.first_volume"
                    type="number"
                    placeholder="1"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @input="calculateTotal"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Volume 2</label>
                  <input
                    v-model.number="reportForm.second_volume"
                    type="number"
                    placeholder="1"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @input="calculateTotal"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Volume 3</label>
                  <input
                    v-model.number="reportForm.third_volume"
                    type="number"
                    placeholder="1"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @input="calculateTotal"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Total Harga</label>
                  <input
                    v-model.number="reportForm.total_price"
                    type="number"
                    placeholder="0"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                    readonly
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Pajak</label>
                  <input
                    v-model.number="reportForm.tax"
                    type="number"
                    placeholder="0"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @input="calculateAfterTax"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Total Setelah Pajak</label
                  >
                  <input
                    v-model.number="reportForm.total_after_tax"
                    type="number"
                    placeholder="0"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                    readonly
                  />
                </div>
              </div>
              <button
                type="submit"
                :disabled="loading.report"
                class="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="loading.report" class="flex items-center justify-center">
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
                  Menyimpan Laporan...
                </span>
                <span v-else>Buat Laporan</span>
              </button>
            </form>
          </div>

          <div>
            <h2 class="text-lg font-medium text-gray-900 mb-3">Daftar Laporan</h2>
            <div v-if="reports.length === 0" class="text-center py-4 bg-gray-50 rounded-lg">
              <p class="text-gray-500">Buat laporan pertama Anda menggunakan form di atas</p>
            </div>
            <div v-else class="overflow-x-auto">
              <table class="min-w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                      Komponen
                    </th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                      Hierarki
                    </th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                      Pengampu
                    </th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="report in reports" :key="report.id" class="hover:bg-gray-50">
                    <td class="px-3 py-2">
                      <div class="font-medium text-gray-900">
                        {{ report.component_name || report.component_code || '-' }}
                      </div>
                      <div class="text-sm text-gray-500">{{ report.component_code }}</div>
                    </td>
                    <td class="px-3 py-2 text-sm text-gray-500">
                      <div class="font-medium text-gray-900">
                        {{ getProgramName(report.program_id) }}
                      </div>
                      <div>{{ getActionName(report.action_id) }}</div>
                    </td>
                    <td class="px-3 py-2 text-sm font-medium text-gray-900">
                      {{ getSupporterName(report.supporter_id) }}
                    </td>
                    <td class="px-3 py-2 text-sm font-medium text-blue-600">
                      Rp {{ formatNumber(report.total_after_tax || report.total_price) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

const router = useRouter()
const token = localStorage.getItem('token')
const baseUrl = 'http://localhost:5002'

const programs = ref([])
const actions = ref([])
const subActions = ref([])
const activities = ref([])
const subtitles = ref([])
const accounts = ref([])
const supporters = ref([])
const reports = ref([])

const loading = reactive({
  program: false,
  action: false,
  subAction: false,
  activity: false,
  subtitle: false,
  account: false,
  supporter: false,
  report: false,
})

const selectedData = reactive({
  program: null,
  action: null,
  subAction: null,
  activity: null,
  subtitle: null,
  account: null,
  supporter: null,
})

const reportForm = reactive({
  component_code: '',
  component_name: '',
  specification: '',
  unit: 'Pcs',
  price: 0,
  first_volume: 1,
  second_volume: 1,
  third_volume: 1,
  total_price: 0,
  tax: 0,
  total_after_tax: 0,
  year: 2025,
})

const canCreateReport = computed(() => {
  return (
    selectedData.program &&
    selectedData.action &&
    selectedData.subAction &&
    selectedData.activity &&
    selectedData.subtitle &&
    selectedData.account &&
    selectedData.supporter
  )
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
  async post(endpoint, data) {
    try {
      const res = await axios.post(`${baseUrl}${endpoint}`, data, {
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

const fetchPrograms = async () => {
  try {
    const data = await api.get('/api/program/list')
    programs.value = data.data || []
  } catch (err) {
    showError('Gagal mengambil data program')
  }
}

const fetchActions = async () => {
  if (!selectedData.program) return
  try {
    const data = await api.get('/api/action/list', { uuid: selectedData.program.id })
    actions.value = data.data || []
  } catch (err) {
    showError('Gagal mengambil data kegiatan')
  }
}

const fetchSubActions = async () => {
  if (!selectedData.action) return
  try {
    const data = await api.get('/api/sub-action/list', { uuid: selectedData.action.id })
    subActions.value = data.data || []
  } catch (err) {
    showError('Gagal mengambil data sub kegiatan')
  }
}

const fetchActivities = async () => {
  if (!selectedData.subAction) return
  try {
    const data = await api.get('/api/activity/list', { uuid: selectedData.subAction.id })
    activities.value = data.data || []
  } catch (err) {
    showError('Gagal mengambil data aktivitas')
  }
}

const fetchSubtitles = async () => {
  if (!selectedData.activity) return
  try {
    const data = await api.get('/api/subtitle/list', { uuid: selectedData.activity.id })
    subtitles.value = data.data || []
  } catch (err) {
    showError('Gagal mengambil data subtitle')
  }
}

const fetchAccounts = async () => {
  if (!selectedData.subtitle) return
  try {
    const data = await api.get('/api/account/list', { uuid: selectedData.subtitle.id })
    accounts.value = data.data || []
  } catch (err) {
    showError('Gagal mengambil data rekening')
  }
}

const fetchSupporters = async () => {
  try {
    const data = await api.get('/api/supporter/list')
    supporters.value = data.data || []
  } catch (err) {
    showError('Gagal mengambil data pengampu')
  }
}

const fetchReports = async () => {
  try {
    const data = await api.get('/api/detail-program/list')
    reports.value = data.data || []
  } catch (err) {
    showError('Gagal mengambil data laporan')
  }
}

const selectProgram = () => {
  if (selectedData.program) {
    selectedData.action = null
    selectedData.subAction = null
    selectedData.activity = null
    selectedData.subtitle = null
    selectedData.account = null
    actions.value = []
    subActions.value = []
    activities.value = []
    subtitles.value = []
    accounts.value = []
    fetchActions()
    showSuccess(`Program "${selectedData.program.name}" berhasil dipilih`)
  }
}

const selectAction = () => {
  if (selectedData.action) {
    selectedData.subAction = null
    selectedData.activity = null
    selectedData.subtitle = null
    selectedData.account = null
    subActions.value = []
    activities.value = []
    subtitles.value = []
    accounts.value = []
    fetchSubActions()
    showSuccess(`Kegiatan "${selectedData.action.name}" berhasil dipilih`)
  }
}

const selectSubAction = () => {
  if (selectedData.subAction) {
    selectedData.activity = null
    selectedData.subtitle = null
    selectedData.account = null
    activities.value = []
    subtitles.value = []
    accounts.value = []
    fetchActivities()
    showSuccess(`Sub kegiatan "${selectedData.subAction.name}" berhasil dipilih`)
  }
}

const selectActivity = () => {
  if (selectedData.activity) {
    selectedData.subtitle = null
    selectedData.account = null
    subtitles.value = []
    accounts.value = []
    fetchSubtitles()
    showSuccess(`Aktivitas "${selectedData.activity.name}" berhasil dipilih`)
  }
}

const selectSubtitle = () => {
  if (selectedData.subtitle) {
    selectedData.account = null
    accounts.value = []
    fetchAccounts()
    showSuccess(`Subtitle "${selectedData.subtitle.name}" berhasil dipilih`)
  }
}

const selectAccount = () => {
  if (selectedData.account) {
    showSuccess(
      `Kode rekening "${selectedData.account.code} - ${selectedData.account.name}" berhasil dipilih`,
    )
  }
}

const selectSupporter = () => {
  if (selectedData.supporter) {
    showSuccess(`Pengampu "${selectedData.supporter.name}" berhasil dipilih`)
  }
}

const createReport = async () => {
  loading.report = true
  try {
    const reportData = {
      ...reportForm,
      program_id: selectedData.program.id,
      action_id: selectedData.action.id,
      sub_action_id: selectedData.subAction.id,
      activity_id: selectedData.activity.id,
      subtitle_id: selectedData.subtitle.id,
      account_id: selectedData.account.id,
      supporter_id: selectedData.supporter.id,
    }
    await api.post('/api/detail-program/create', reportData)
    showSuccess('Laporan berhasil dibuat')
    resetReportForm()
    fetchReports()
  } catch (err) {
    showError('Gagal membuat laporan')
  } finally {
    loading.report = false
  }
}

const calculateTotal = () => {
  reportForm.total_price =
    reportForm.price * reportForm.first_volume * reportForm.second_volume * reportForm.third_volume
  calculateAfterTax()
}

const calculateAfterTax = () => {
  reportForm.total_after_tax = reportForm.total_price + (reportForm.tax || 0)
}

const resetReportForm = () => {
  Object.assign(reportForm, {
    component_code: '',
    component_name: '',
    specification: '',
    unit: 'Pcs',
    price: 0,
    first_volume: 1,
    second_volume: 1,
    third_volume: 1,
    total_price: 0,
    tax: 0,
    total_after_tax: 0,
    year: 2025,
  })
}

const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(num || 0)

const getProgramName = (id) => programs.value.find((p) => p.id === id)?.name || 'Unknown'
const getActionName = (id) => actions.value.find((a) => a.id === id)?.name || 'Unknown'
const getSupporterName = (id) => supporters.value.find((s) => s.id === id)?.name || 'Unknown'

onMounted(() => {
  fetchPrograms()
  fetchSupporters()
  fetchReports()
})
</script>

<style scoped>
input:focus,
textarea:focus,
select:focus,
button:focus {
  outline: none;
  box-shadow: 0 0 0 2px #3b82f6;
}

select:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
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
    padding: 6px 2px;
  }
}
</style>
