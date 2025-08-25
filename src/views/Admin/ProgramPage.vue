<template>
  <div class="p-6">
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Tambah Program</h2>
      <form @submit.prevent="createProgram" class="flex space-x-3">
        <input
          v-model="programName"
          type="text"
          placeholder="Masukkan nama program"
          class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          :disabled="isCreating"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isCreating ? 'Menyimpan...' : 'Simpan' }}
        </button>
      </form>
    </div>

    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">Daftar Program</h2>
      <div v-if="loading" class="text-gray-500">Loading...</div>
      <div v-else-if="programs.length === 0" class="text-gray-500 text-center py-8">
        Tidak ada program tersedia
      </div>
      <ul v-else class="divide-y divide-gray-200">
        <li
          v-for="program in programs"
          :key="program.id"
          class="py-3 flex items-center justify-between"
        >
          <div class="flex-1">
            <span class="text-gray-800 font-medium">{{ program.name }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="confirmDelete(program)"
              :disabled="deletingIds.includes(program.id)"
              class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ deletingIds.includes(program.id) ? 'Menghapus...' : 'Hapus' }}
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const token = localStorage.getItem('token')
const programName = ref('')
const programs = ref([])
const loading = ref(false)
const isCreating = ref(false)
const deletingIds = ref([])

const fetchPrograms = async () => {
  loading.value = true
  try {
    const res = await axios.get('https://bitwisi.cloud/ranwal/api/program/list', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    programs.value = res.data.data || []
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Gagal mengambil data program.',
    })
  } finally {
    loading.value = false
  }
}

const createProgram = async () => {
  if (!programName.value) return

  isCreating.value = true
  try {
    await axios.post(
      'https://bitwisi.cloud/ranwal/api/program/create',
      {
        name: programName.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Program berhasil ditambahkan.',
      showConfirmButton: false,
      timer: 1500,
    })
    programName.value = ''
    fetchPrograms() // refresh list
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Gagal menambahkan program.',
    })
  } finally {
    isCreating.value = false
  }
}

const confirmDelete = async (program) => {
  const result = await Swal.fire({
    title: 'Konfirmasi Hapus',
    text: `Apakah Anda yakin ingin menghapus program "${program.name}"? Tindakan ini tidak dapat dibatalkan.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
  })

  if (result.isConfirmed) {
    deleteProgram(program)
  }
}

const deleteProgram = async (program) => {
  const programId = program.id
  deletingIds.value.push(programId)

  try {
    await axios.delete(`https://bitwisi.cloud/ranwal/api/program/${programId}/delete`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    Swal.fire({
      icon: 'success',
      title: 'Dihapus!',
      text: `Program "${program.name}" berhasil dihapus.`,
      showConfirmButton: false,
      timer: 1500,
    })

    // Remove from local list for better UX
    programs.value = programs.value.filter((p) => p.id !== programId)
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: `Gagal menghapus program "${program.name}".`,
    })
    console.error('Delete program error:', err)
  } finally {
    deletingIds.value = deletingIds.value.filter((id) => id !== programId)
  }
}

onMounted(() => {
  fetchPrograms()
})
</script>
