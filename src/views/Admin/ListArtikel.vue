<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Manajemen Artikel</h1>
      <div class="flex justify-between items-center">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari artikel..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="debouncedSearch"
          />
          <svg
            class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <button
          @click="refreshData"
          :disabled="loading"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? 'Loading...' : 'Refresh' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-2 text-gray-600">Memuat data...</span>
    </div>

    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
    >
      <p>{{ error }}</p>
      <button @click="fetchArticles" class="mt-2 text-sm underline">Coba lagi</button>
    </div>

    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Artikel
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Author
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Views
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tanggal
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="article in articles" :key="article.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0">
                    <img
                      v-if="article.cover_image"
                      :src="article.cover_image"
                      :alt="article.title"
                      class="h-12 w-12 rounded-lg object-cover"
                    />
                    <div
                      v-else
                      class="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center"
                    >
                      <svg
                        class="h-6 w-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {{ article.title }}
                    </p>
                    <p class="text-sm text-gray-500 truncate">
                      {{ article.excerpt }}
                    </p>
                    <div class="flex flex-wrap gap-1 mt-1">
                      <span
                        v-for="tag in article.tags"
                        :key="tag"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ article.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ article.category }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'bg-green-100 text-green-800': article.status === 'published',
                    'bg-yellow-100 text-yellow-800': article.status === 'draft',
                    'bg-gray-100 text-gray-800': article.status === 'archived',
                  }"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                >
                  {{ article.status }}
                </span>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatNumber(article.views_count) }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(article.created_at) }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="viewArticle(article)"
                    class="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                    title="Lihat"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    @click="editArticle(article)"
                    class="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50"
                    title="Edit"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      ></path>
                    </svg>
                  </button>
                  <button
                    @click="deleteArticle(article)"
                    class="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                    title="Hapus"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      @click="confirmDelete(article)" :disabled="deletingIds.includes(article.id)"
                      class="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50
                      disabled:opacity-50" title="Hapus" >
                      <svg
                        v-if="!deletingIds.includes(article.id)"
                        class="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 4v12m4-12v12m-7-4h8"
                        ></path>
                      </svg>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!loading && articles.length === 0" class="text-center py-8">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          ></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada artikel</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{
            searchQuery
              ? 'Tidak ditemukan artikel yang sesuai dengan pencarian.'
              : 'Belum ada artikel yang dibuat.'
          }}
        </p>
      </div>
      <div v-if="filter.total_page > 1" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage <= 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage >= filter.total_page"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Menampilkan
                <span class="font-medium">{{ (currentPage - 1) * 5 + 1 }}</span>
                sampai
                <span class="font-medium">{{
                  Math.min(currentPage * 5, filter.total_result)
                }}</span>
                dari
                <span class="font-medium">{{ filter.total_result }}</span>
                hasil
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="changePage(currentPage - 1)"
                  :disabled="currentPage <= 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>
                <button
                  v-for="page in getPageNumbers()"
                  :key="page"
                  @click="changePage(page)"
                  :class="{
                    'bg-blue-50 border-blue-500 text-blue-600': page === currentPage,
                    'bg-white border-gray-300 text-gray-500 hover:bg-gray-50': page !== currentPage,
                  }"
                  class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  {{ page }}
                </button>
                <button
                  @click="changePage(currentPage + 1)"
                  :disabled="currentPage >= filter.total_page"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div
        class="relative top-10 mx-auto p-6 border max-w-2xl shadow-lg rounded-lg bg-white max-h-[90vh] overflow-y-auto"
      >
        <div>
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold text-gray-900">Edit Artikel</h3>
            <button
              @click="closeEditModal"
              :disabled="updating"
              class="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <form @submit.prevent="updateArticle" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Judul Artikel <span class="text-red-500">*</span>
              </label>
              <input
                v-model="editForm.title"
                type="text"
                required
                placeholder="Masukkan judul artikel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :disabled="updating"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"> Konten </label>
              <textarea
                v-model="editForm.content"
                rows="8"
                placeholder="Masukkan konten artikel (HTML diperbolehkan)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                :disabled="updating"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">
                Anda dapat menggunakan HTML tags untuk formatting
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"> Cover Image URL </label>
              <input
                v-model="editForm.cover_image"
                type="url"
                placeholder="https://example.com/image.jpg"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :disabled="updating"
              />
              <div v-if="editForm.cover_image" class="mt-2">
                <img
                  :src="editForm.cover_image"
                  alt="Cover Preview"
                  class="h-20 w-32 object-cover rounded-md border"
                  @error="imageError = true"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Kategori <span class="text-red-500">*</span>
              </label>
              <select
                v-model="editForm.category"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :disabled="updating"
              >
                <option value="" disabled>Pilih kategori</option>
                <option value="Tindak Lanjut Hasil Musrenbang">
                  Tindak Lanjut Hasil Musrenbang
                </option>
                <option value="Usulan Reses DPRD">Usulan Reses DPRD</option>
                <option value="Usulan Langsung Warga Masyarakat">
                  Usulan Langsung Warga Masyarakat
                </option>
                <option value="Kegiatan Rutin">Kegiatan Rutin</option>
              </select>
            </div>
            ======= >>>>>>> 4acd12044e27959f8bb5f375ec826a67da41225f
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Status <span class="text-red-500">*</span>
              </label>
              <select
                v-model="editForm.status"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :disabled="updating"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"> Tags </label>
              <div class="space-y-2">
                <input
                  v-model="newTag"
                  type="text"
                  placeholder="Tambah tag baru..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :disabled="updating"
                  @keyup.enter="addTag"
                />
                <div v-if="editForm.tags.length > 0" class="flex flex-wrap gap-2">
                  <span
                    v-for="(tag, index) in editForm.tags"
                    :key="index"
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {{ tag }}
                    <button
                      type="button"
                      @click="removeTag(index)"
                      :disabled="updating"
                      class="ml-2 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    >
                      <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </button>
                  </span>
                </div>
                <p class="text-xs text-gray-500">Tekan Enter untuk menambah tag</p>
              </div>
            </div>
            <div class="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                @click="closeEditModal"
                :disabled="updating"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="
                  updating || !editForm.title.trim() || !editForm.status || !editForm.category
                "
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {{ updating ? 'Menyimpan...' : 'Simpan Perubahan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div
      v-if="message.text"
      :class="{
        'bg-green-100 border-green-400 text-green-700': message.type === 'success',
        'bg-red-100 border-red-400 text-red-700': message.type === 'error',
      }"
      class="fixed top-4 right-4 border px-4 py-3 rounded z-50"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            v-if="message.type === 'success'"
            class="h-5 w-5 text-green-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <svg v-else class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm">{{ message.text }}</p>
        </div>
        <div class="ml-auto pl-3">
          <button @click="clearMessage" class="text-gray-400 hover:text-gray-600">
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Swal from 'sweetalert2'

const articles = ref([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const filter = ref({
  current_page: 1,
  total_page: 1,
  filtered_result: 0,
  total_result: 0,
})
const showEditModal = ref(false)
const updating = ref(false)
const selectedArticle = ref(null)
const editForm = reactive({
  title: '',
  content: '',
  cover_image: '',
  tags: [],
  status: 'published',
  category: '',
})
const newTag = ref('')
const imageError = ref(false)
// Delete state
const deletingIds = ref([])

// Message state

const message = reactive({
  text: '',
  type: 'success',
})
const API_BASE_URL = 'https://bitwisi.cloud/ranwal/api'
let searchTimer = null

const getAuthToken = () => {
  return localStorage.getItem('token')
}

const createHeaders = () => {
  const token = getAuthToken()
  const headers = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

const fetchArticles = async () => {
  loading.value = true
  error.value = ''
  try {
    const params = new URLSearchParams({
      page: currentPage.value,
      limit: 5,
      search: searchQuery.value,
    })
    const response = await fetch(`${API_BASE_URL}/article/list?${params}`, {
      headers: createHeaders(),
    })
    const data = await response.json()
    if (data.status === 200) {
      articles.value =
        data.data.map((article) => ({
          ...article,
          category: article.category || '',
        })) || []
      filter.value = data.filter || {}
    } else {
      throw new Error(data.message || 'Gagal mengambil data artikel')
    }
  } catch (err) {
    error.value = err.message || 'Terjadi kesalahan saat mengambil data'
    articles.value = []
  } finally {
    loading.value = false
  }
}

const debouncedSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    currentPage.value = 1
    fetchArticles()
  }, 500)
}

const changePage = (page) => {
  if (page >= 1 && page <= filter.value.total_page) {
    currentPage.value = page
    fetchArticles()
  }
}

const getPageNumbers = () => {
  const pages = []
  const totalPages = filter.value.total_page
  const current = currentPage.value
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(totalPages)
    } else if (current >= totalPages - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(totalPages)
    }
  }
  return pages.filter((p) => p !== '...')
}

const viewArticle = async (article) => {
  try {
    loading.value = true
    const response = await fetch(`${API_BASE_URL}/article/${article.slug}/get`, {
      headers: createHeaders(),
    })
    const data = await response.json()
    if (data.status === 200) {
      showMessage('Detail artikel berhasil dimuat', 'success')
      console.log('Full Article data:', data.data)
    } else {
      throw new Error(data.message || 'Gagal mengambil detail artikel')
    }
  } catch (err) {
    showMessage(err.message || 'Terjadi kesalahan saat mengambil detail artikel', 'error')
  } finally {
    loading.value = false
  }
}

const editArticle = async (article) => {
  try {
    const response = await fetch(`${API_BASE_URL}/article/${article.slug}/get`, {
      headers: createHeaders(),
    })
    const data = await response.json()
    if (data.status === 200) {
      const fullArticle = data.data
      selectedArticle.value = fullArticle
      editForm.title = fullArticle.title || ''
      editForm.content = fullArticle.content || ''
      editForm.cover_image = fullArticle.cover_image || ''
      editForm.tags = [...(fullArticle.tags || [])]
      editForm.status = fullArticle.status || 'published'
      editForm.category = fullArticle.category || ''
      showEditModal.value = true
    } else {
      throw new Error(data.message || 'Gagal mengambil detail artikel')
    }
  } catch (err) {
    showMessage(err.message || 'Terjadi kesalahan saat memuat data artikel', 'error')
  }
}

const deleteArticle = async (article) => {
  if (!confirm(`Apakah Anda yakin ingin menghapus artikel "${article.title}"?`)) return
  try {
    loading.value = true
    const response = await fetch(`${API_BASE_URL}/article/${article.slug}/delete`, {
      method: 'DELETE',
      headers: createHeaders(),
    })
    const data = await response.json()
    if (data.status === 200) {
      articles.value = articles.value.filter((a) => a.id !== article.id)
      showMessage('Artikel berhasil dihapus', 'success')
    } else {
      throw new Error(data.message || 'Gagal menghapus artikel')
    }
  } catch (err) {
    showMessage(err.message || 'Terjadi kesalahan saat menghapus artikel', 'error')
  } finally {
    loading.value = false
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedArticle.value = null
  editForm.title = ''
  editForm.content = ''
  editForm.cover_image = ''
  editForm.tags = []
  editForm.status = 'published'
  editForm.category = ''
  newTag.value = ''
  imageError.value = false
}

const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !editForm.tags.includes(tag)) {
    editForm.tags.push(tag)
    newTag.value = ''
  }
}

const removeTag = (index) => {
  editForm.tags.splice(index, 1)
}

const updateArticle = async () => {
  if (!selectedArticle.value || !editForm.title.trim() || !editForm.status || !editForm.category) {
    showMessage('Judul, Kategori, dan Status wajib diisi.', 'error')
    return
  }
  updating.value = true
  try {
    const requestBody = {
      title: editForm.title.trim(),
      content: editForm.content.trim(),
      cover_image: editForm.cover_image.trim(),
      tags: editForm.tags,
      status: editForm.status,
      category: editForm.category,
    }
    const response = await fetch(`${API_BASE_URL}/article/${selectedArticle.value.slug}/update`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(requestBody),
    })
    const data = await response.json()
    if (data.status === 200) {
      const index = articles.value.findIndex((a) => a.id === selectedArticle.value.id)
      if (index !== -1) {
        articles.value[index] = {
          ...articles.value[index],
          title: editForm.title.trim(),
          cover_image: editForm.cover_image.trim(),
          status: editForm.status,
          tags: [...editForm.tags],
          category: editForm.category,
        }
      }
      showMessage('Artikel berhasil diperbarui', 'success')
      closeEditModal()
    } else {
      throw new Error(data.message || 'Gagal memperbarui artikel')
    }
  } catch (err) {
    showMessage(err.message || 'Terjadi kesalahan saat memperbarui artikel', 'error')
  } finally {
    updating.value = false
  }
}

// Confirm deletion
const confirmDelete = async (article) => {
  const result = await Swal.fire({
    title: 'Konfirmasi Hapus',
    text: `Apakah Anda yakin ingin menghapus artikel "${article.title}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
  })

  if (result.isConfirmed) {
    deleteArticle(article.slug, article.id)
  }
}

const showMessage = (text, type = 'success') => {
  message.text = text
  message.type = type
  setTimeout(() => {
    clearMessage()
  }, 5000)
}

const clearMessage = () => {
  message.text = ''
  message.type = 'success'
}

const refreshData = () => {
  fetchArticles()
}

const formatNumber = (num) => {
  return parseInt(num, 10).toLocaleString('id-ID')
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

onMounted(() => {
  fetchArticles()
})
</script>
