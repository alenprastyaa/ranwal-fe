<template>
  <div class="container mx-auto px-4 max-w-8xl py-8">
    <h1 class="text-3xl font-bold my-6 text-center">Manajemen Pengguna</h1>

    <div
      v-if="successMessage"
      class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-md"
      role="alert"
    >
      <p class="font-bold">Berhasil!</p>
      <p>{{ successMessage }}</p>
    </div>
    <div
      v-if="errorMessage"
      class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md"
      role="alert"
    >
      <p class="font-bold">Gagal!</p>
      <p>{{ errorMessage }}</p>
    </div>

    <div class="flex justify-end mb-4">
      <button
        @click="showCreateModal = true"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        + Tambah Pengguna
      </button>
    </div>

    <div v-if="loading" class="text-center text-lg">Memuat data...</div>
    <div v-else class="bg-white shadow-lg rounded-lg p-6">
      <div v-if="users && users.length > 0">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nama
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.role }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <button @click="editUser(user)" class="text-indigo-600 hover:text-indigo-900 mr-2">
                  Edit
                </button>
                <button @click="deleteUser(user.id)" class="text-red-600 hover:text-red-900">
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center text-gray-500">Tidak ada data pengguna yang tersedia.</div>
    </div>

    <div v-if="showCreateModal || showEditModal" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 text-center">
        <div class="fixed inset-0 transition-opacity" @click="closeModal">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div
          class="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all max-w-lg w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              {{ isEditing ? 'Edit Pengguna' : 'Buat Pengguna Baru' }}
            </h3>
            <form @submit.prevent="isEditing ? updateUser() : createNewUser()">
              <div class="mb-4">
                <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Nama</label>
                <input
                  v-model="form.name"
                  type="text"
                  id="name"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div class="mb-4">
                <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  id="email"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div class="mb-4">
                <label for="role" class="block text-gray-700 text-sm font-bold mb-2">Role</label>
                <select
                  v-model="form.role"
                  id="role"
                  class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div class="mb-6" v-if="!isEditing">
                <label for="password" class="block text-gray-700 text-sm font-bold mb-2"
                  >Password</label
                >
                <input
                  v-model="form.password"
                  type="password"
                  id="password"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div class="flex justify-end">
                <button
                  type="button"
                  @click="closeModal"
                  class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  :disabled="isSubmitting"
                >
                  {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'

// Variabel Reaktif - Initialize users as empty array
const users = ref([])
const loading = ref(true)
const isSubmitting = ref(false)
const isEditing = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const form = reactive({
  id: null,
  name: '',
  email: '',
  role: 'user',
  password: '',
})
const successMessage = ref('')
const errorMessage = ref('')
const url = 'https://bitwisi.cloud/ranwal' // Ganti dengan URL dasar API Anda

// Fungsi Bantuan
const getToken = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    setNotification('Token tidak ditemukan. Silakan login.', 'error')
    return null
  }
  return token
}

const setNotification = (message, type) => {
  if (type === 'success') {
    successMessage.value = message
    errorMessage.value = ''
  } else {
    errorMessage.value = message
    successMessage.value = ''
  }
  setTimeout(() => {
    successMessage.value = ''
    errorMessage.value = ''
  }, 5000)
}

const resetForm = () => {
  form.id = null
  form.name = ''
  form.email = ''
  form.role = 'user'
  form.password = ''
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  isEditing.value = false
  resetForm()
}

// Metode CRUD
const fetchUsers = async () => {
  loading.value = true
  const token = getToken()
  if (!token) {
    loading.value = false
    return
  }

  try {
    const response = await axios.get(`${url}/api/user/list`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    // Ensure users is always an array - API returns data in response.data.data
    users.value = Array.isArray(response.data.data) ? response.data.data : []
  } catch (error) {
    setNotification('Gagal mengambil data pengguna.', 'error')
    console.error('Gagal mengambil data pengguna:', error)
    // Set empty array on error
    users.value = []
  } finally {
    loading.value = false
  }
}

const createNewUser = async () => {
  isSubmitting.value = true
  const token = getToken()
  if (!token) {
    isSubmitting.value = false
    return
  }

  try {
    await axios.post(`${url}/api/user/create`, form, {
      headers: { Authorization: `Bearer ${token}` },
    })
    setNotification('Pengguna berhasil dibuat!', 'success')
    closeModal()
    fetchUsers()
  } catch (error) {
    setNotification('Gagal membuat pengguna. Periksa data yang Anda masukkan.', 'error')
    console.error('Gagal membuat pengguna:', error.response ? error.response.data : error.message)
  } finally {
    isSubmitting.value = false
  }
}

const editUser = (user) => {
  isEditing.value = true
  showEditModal.value = true
  Object.assign(form, user) // Mengisi form dengan data user
  form.password = '' // Jangan kirim password
}

const updateUser = async () => {
  isSubmitting.value = true
  const token = getToken()
  if (!token) {
    isSubmitting.value = false
    return
  }

  try {
    const { id, password, ...dataToUpdate } = form
    await axios.put(`${url}/api/user/${id}/update`, dataToUpdate, {
      headers: { Authorization: `Bearer ${token}` },
    })
    setNotification('Pengguna berhasil diperbarui!', 'success')
    closeModal()
    fetchUsers()
  } catch (error) {
    setNotification('Gagal memperbarui pengguna.', 'error')
    console.error('Gagal memperbarui pengguna:', error)
  } finally {
    isSubmitting.value = false
  }
}

const deleteUser = async (userId) => {
  const isConfirmed = confirm('Apakah Anda yakin ingin menghapus pengguna ini?')
  if (!isConfirmed) return

  const token = getToken()
  if (!token) return

  try {
    await axios.delete(`${url}/api/user/${userId}/delete`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    setNotification('Pengguna berhasil dihapus!', 'success')
    fetchUsers()
  } catch (error) {
    setNotification('Gagal menghapus pengguna.', 'error')
    console.error('Gagal menghapus pengguna:', error)
  }
}

// Hook Siklus Hidup
onMounted(() => {
  fetchUsers()
})
</script>
