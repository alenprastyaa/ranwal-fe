<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <main class="max-w-8xl mx-auto px-4 py-8">
      <form @submit.prevent="handleSubmit" class="bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <div class="space-y-6">
          <div class="border-l-4 border-blue-500 pl-4">
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Informasi Artikel</h2>
            <p class="text-gray-600">Isi informasi dasar tentang artikel Anda.</p>
          </div>
          <div>
            <label for="title" class="block text-sm font-semibold text-gray-700 mb-2">
              Judul Artikel *
            </label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              required
              class="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="Masukkan judul artikel Anda..."
            />
          </div>

          <div>
            <label for="category" class="block text-sm font-semibold text-gray-700 mb-2">
              Kategori *
            </label>
            <select
              id="category"
              v-model="formData.category"
              required
              class="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 appearance-none"
            >
              <option disabled value="">Pilih Kategori</option>
              <option value="Tindak Lanjut Hasil Musrenbang">Tindak Lanjut Hasil Musrenbang</option>
              <option value="Usulan Reses DPRD">Usulan Reses DPRD</option>
              <option value="Usulan Langsung Warga Masyarakat">
                Usulan Langsung Warga Masyarakat
              </option>
              <option value="Kegiatan Rutin">Kegiatan Rutin</option>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
            >
              <svg
                class="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.293 12.95l.707.707L15.646 7.354a.5.5 0 00-.708-.708L10 11.293 4.354 6.646a.5.5 0 00-.708.708l5.793 5.793z"
                />
              </svg>
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2"> Gambar Sampul </label>

            <div class="mb-4">
              <div class="flex items-center gap-4">
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleFileUpload"
                  class="hidden"
                />
                <button
                  type="button"
                  @click="$refs.fileInput.click()"
                  :disabled="isUploading"
                  class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                >
                  <svg
                    v-if="!isUploading"
                    class="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <svg v-else class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
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
                  {{ isUploading ? 'Mengunggah...' : 'Unggah Gambar' }}
                </button>
              </div>

              <div
                v-if="uploadMessage"
                :class="[
                  'mt-2 p-3 rounded-lg text-sm',
                  uploadMessage.includes('Error')
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-green-50 text-green-700 border border-green-200',
                ]"
              >
                {{ uploadMessage }}
              </div>
            </div>
            <div v-if="formData.cover_image" class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Pratinjau:</label>
              <div class="relative inline-block">
                <img
                  :src="formData.cover_image"
                  alt="Pratinjau gambar sampul"
                  class="max-w-xs max-h-48 rounded-lg shadow-md border border-gray-200"
                  @error="handleImageError"
                  @load="handleImageLoad"
                />
                <button
                  type="button"
                  @click="removeCoverImage"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                  title="Hapus gambar"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Tag</label>
            <div class="flex flex-wrap gap-2 mb-3" v-if="formData.tags.length > 0">
              <span
                v-for="(tag, index) in formData.tags"
                :key="index"
                class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full"
              >
                {{ tag }}
                <button
                  type="button"
                  @click="removeTag(index)"
                  class="ml-2 text-blue-500 hover:text-blue-700 transition-colors duration-200"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </span>
            </div>
            <div class="flex gap-2">
              <input
                v-model="newTag"
                @keyup.enter="addTag"
                type="text"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="Tambahkan tag..."
              />
              <button
                type="button"
                @click="addTag"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Tambah Tag
              </button>
            </div>
            <p class="mt-1 text-sm text-gray-500">
              Tambahkan tag untuk membantu mengkategorikan artikel Anda (tekan Enter untuk menambah)
            </p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">Status Publikasi</label>
            <div class="grid grid-cols-3 gap-4">
              <label
                class="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              >
                <input
                  v-model="formData.status"
                  type="radio"
                  value="published"
                  class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">Dipublikasikan</div>
                  <div class="text-xs text-gray-500">Terlihat oleh semua orang</div>
                </div>
              </label>
              <label
                class="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              >
                <input
                  v-model="formData.status"
                  type="radio"
                  value="draft"
                  class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">Draf</div>
                  <div class="text-xs text-gray-500">Simpan untuk nanti</div>
                </div>
              </label>
              <label
                class="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              >
                <input
                  v-model="formData.status"
                  type="radio"
                  value="archived"
                  class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">Diarsipkan</div>
                  <div class="text-xs text-gray-500">Disembunyikan dari publik</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="border-l-4 border-purple-500 pl-4">
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Konten Artikel</h2>
            <p class="text-gray-600">Tulis konten artikel Anda menggunakan format HTML.</p>
          </div>

          <div>
            <div class="flex items-center justify-between mb-4">
              <label for="content" class="block text-sm font-semibold text-gray-700">
                Konten *
              </label>
              <div class="flex gap-2">
                <button
                  type="button"
                  @click="togglePreview"
                  class="inline-flex items-center px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  {{ showPreview ? 'Sembunyikan Pratinjau' : 'Tampilkan Pratinjau' }}
                </button>
              </div>
            </div>

            <div class="border border-gray-300 border-b-0 rounded-t-lg bg-gray-50 p-4">
              <div class="flex flex-wrap gap-3">
                <div class="flex gap-1">
                  <button
                    type="button"
                    @click="formatText('bold')"
                    class="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200 font-bold text-sm"
                    title="Tebal (Ctrl+B)"
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    type="button"
                    @click="formatText('italic')"
                    class="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200 italic text-sm"
                    title="Miring (Ctrl+I)"
                  >
                    <em>I</em>
                  </button>
                  <button
                    type="button"
                    @click="formatText('underline')"
                    class="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200 underline text-sm"
                    title="Garis Bawah (Ctrl+U)"
                  >
                    U
                  </button>
                </div>

                <div class="w-px h-8 bg-gray-300"></div>

                <div class="flex gap-1">
                  <button
                    type="button"
                    @click="insertHeading(1)"
                    class="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200 font-bold text-sm"
                    title="Judul 1"
                  >
                    H1
                  </button>
                  <button
                    type="button"
                    @click="insertHeading(2)"
                    class="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200 font-bold text-sm"
                    title="Judul 2"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    @click="insertHeading(3)"
                    class="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200 font-bold text-sm"
                    title="Judul 3"
                  >
                    H3
                  </button>
                  <button
                    type="button"
                    @click="insertParagraph()"
                    class="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200 text-sm"
                    title="Paragraf"
                  >
                    P
                  </button>
                </div>
              </div>
            </div>

            <div class="relative">
              <textarea
                id="content"
                ref="contentEditor"
                v-model="formData.content"
                required
                rows="20"
                class="w-full px-4 py-4 border border-gray-300 border-t-0 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none font-mono text-sm leading-relaxed"
                :class="{ hidden: showPreview }"
                placeholder="Tulis konten artikel Anda di sini... Anda bisa menggunakan tag HTML seperti <p>, <h1>, <h2>, <strong>, <em>, dll.
"
              ></textarea>

              <div
                v-if="showPreview"
                class="border border-gray-300 border-t-0 rounded-b-lg p-6 min-h-[500px] bg-white prose prose-blue prose-lg max-w-none"
              >
                <div v-if="formData.content" v-html="formData.content"></div>
                <div v-else class="text-gray-400 italic text-center py-20">
                  <svg
                    class="w-12 h-12 mx-auto mb-4 opacity-50"
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
                  Pratinjau akan muncul di sini saat Anda menulis...
                </div>
              </div>
            </div>

            <p class="mt-2 text-sm text-gray-500">
              Gunakan tag HTML untuk memformat konten Anda. Klik tombol toolbar untuk menyisipkan
              format umum.
            </p>
          </div>
        </div>

        <div class="border-t border-gray-200 pt-8">
          <div class="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              @click="handleCancel"
              class="px-8 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium order-2 sm:order-1"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="isSubmitting || !formData.title.trim() || !formData.content.trim()"
              class="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl order-1 sm:order-2"
            >
              <span v-if="isSubmitting" class="flex items-center justify-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                Mempublikasikan...
              </span>
              <span v-else class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  ></path>
                </svg>
                {{ formData.status === 'published' ? 'Publikasikan Artikel' : 'Simpan Artikel' }}
              </span>
            </button>
          </div>

          <div
            v-if="submitMessage"
            :class="[
              'mt-6 p-4 rounded-lg transition-all duration-300',
              submitMessage.includes('Error')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200',
            ]"
          >
            <div class="flex items-center">
              <svg
                v-if="!submitMessage.includes('Error')"
                class="w-5 h-5 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <svg
                v-else
                class="w-5 h-5 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span class="font-medium">{{ submitMessage }}</span>
            </div>
          </div>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue'
import { useRouter } from 'vue-router' // Import useRouter

// Inisialisasi router
const router = useRouter()

// Props
const props = defineProps({
  apiBaseUrl: {
    type: String,
    default: 'https://bitwisi.cloud/ranwal/api',
  },
})

// Emits
const emit = defineEmits(['cancel', 'success'])

// Data reaktif
const formData = ref({
  title: '',
  content: '',
  cover_image: '',
  tags: [],
  status: 'published',
  category: '', // Ditambahkan field category
})

const newTag = ref('')
const isSubmitting = ref(false)
const submitMessage = ref('')
const showPreview = ref(false)
const contentEditor = ref(null)
const fileInput = ref(null)
const token = localStorage.getItem('token')
// Terkait unggah file
const isUploading = ref(false)
const uploadMessage = ref('')

// Metode
const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !formData.value.tags.includes(tag)) {
    formData.value.tags.push(tag)
    newTag.value = ''
  }
}

const removeTag = (index) => {
  formData.value.tags.splice(index, 1)
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validasi tipe file
  if (!file.type.startsWith('image/')) {
    uploadMessage.value = 'Error: Silakan pilih file gambar'
    return
  }

  // Validasi ukuran file (batas 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    uploadMessage.value = 'Error: Ukuran file harus kurang dari 5MB'
    return
  }

  isUploading.value = true
  uploadMessage.value = ''

  try {
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)

    const response = await fetch('https://invitations.my.id/api/upload-file', {
      method: 'POST',
      body: uploadFormData,
    })

    const data = await response.json()

    if (data.status === 200 && data.data && data.data.path) {
      formData.value.cover_image = data.data.path
      uploadMessage.value = 'Gambar berhasil diunggah!'

      // Hapus pesan sukses setelah 3 detik
      setTimeout(() => {
        uploadMessage.value = ''
      }, 3000)
    } else {
      uploadMessage.value = `Error: ${data.message || 'Gagal mengunggah file'}`
    }
  } catch (error) {
    console.error('Error unggah:', error)
    uploadMessage.value = 'Error: Error jaringan - Tidak dapat mengunggah file'
  } finally {
    isUploading.value = false
    // Bersihkan input file
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const removeCoverImage = () => {
  formData.value.cover_image = ''
  uploadMessage.value = ''
}

const handleImageError = () => {
  // Tangani URL gambar yang rusak
  console.log('Gambar gagal dimuat')
}

const handleImageLoad = () => {
  // Tangani gambar yang berhasil dimuat
  console.log('Gambar berhasil dimuat')
}

const formatText = (command) => {
  const editor = contentEditor.value
  if (editor) {
    const start = editor.selectionStart
    const end = editor.selectionEnd
    const selectedText = editor.value.substring(start, end)

    let replacement = ''
    switch (command) {
      case 'bold':
        replacement = selectedText
          ? `<strong>${selectedText}</strong>`
          : '<strong>Teks tebal</strong>'
        break
      case 'italic':
        replacement = selectedText ? `<em>${selectedText}</em>` : '<em>Teks miring</em>'
        break
      case 'underline':
        replacement = selectedText ? `<u>${selectedText}</u>` : '<u>Teks bergaris bawah</u>'
        break
    }

    if (replacement) {
      const newContent =
        formData.value.content.substring(0, start) +
        replacement +
        formData.value.content.substring(end)
      formData.value.content = newContent

      // Atur posisi kursor setelah teks yang disisipkan
      setTimeout(() => {
        const newPosition = start + replacement.length
        editor.setSelectionRange(newPosition, newPosition)
        editor.focus()
      }, 0)
    }
  }
}

const insertHeading = (level = 2) => {
  const editor = contentEditor.value
  if (editor) {
    const start = editor.selectionStart
    const end = editor.selectionEnd
    const selectedText = editor.value.substring(start, end) || `Judul ${level}`

    const replacement = `<h${level}>${selectedText}</h${level}>`
    const newContent =
      formData.value.content.substring(0, start) +
      replacement +
      formData.value.content.substring(end)
    formData.value.content = newContent

    setTimeout(() => {
      const newPosition = start + replacement.length
      editor.setSelectionRange(newPosition, newPosition)
      editor.focus()
    }, 0)
  }
}

const insertParagraph = () => {
  const editor = contentEditor.value
  if (editor) {
    const start = editor.selectionStart
    const end = editor.selectionEnd
    const selectedText = editor.value.substring(start, end) || 'Teks paragraf Anda di sini.'

    const replacement = `<p>${selectedText}</p>`
    const newContent =
      formData.value.content.substring(0, start) +
      replacement +
      formData.value.content.substring(end)
    formData.value.content = newContent

    setTimeout(() => {
      const newPosition = start + replacement.length
      editor.setSelectionRange(newPosition, newPosition)
      editor.focus()
    }, 0)
  }
}

const togglePreview = () => {
  showPreview.value = !showPreview.value
}

const handleSubmit = async () => {
  if (!formData.value.title.trim() || !formData.value.content.trim()) {
    submitMessage.value = 'Error: Judul dan konten wajib diisi'
    return
  }

  // Validasi tambahan untuk kategori
  if (!formData.value.category) {
    submitMessage.value = 'Error: Kategori wajib dipilih'
    return
  }

  isSubmitting.value = true
  submitMessage.value = ''

  try {
    const response = await fetch(`${props.apiBaseUrl}/article/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData.value),
    })

    const data = await response.json()

    if (data.status === 200 || data.status === 201) {
      submitMessage.value = `Artikel berhasil ${formData.value.status === 'published' ? 'dipublikasikan' : 'disimpan'}!`
      
      // Arahkan ke halaman admin-list-artikel
      setTimeout(() => {
        router.push({ name: 'admin-list artikel' })
      }, 1500)
      
    } else {
      submitMessage.value = `Error: ${data.message || 'Gagal menyimpan artikel'}`
    }
  } catch (err) {
    submitMessage.value = 'Error: Error jaringan - Tidak dapat terhubung ke server'
    console.error('Error pengiriman:', err)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  // Atur ulang formulir
  formData.value = {
    title: '',
    content: '',
    cover_image: '',
    tags: [],
    status: 'published',
    category: '', // Reset field category juga
  }
  newTag.value = ''
  submitMessage.value = ''
  uploadMessage.value = ''
  showPreview.value = false

  // Kirim event batal
  emit('cancel')
}
</script>

<style scoped>
.prose {
  max-width: none;
}

.prose p {
  margin-bottom: 1rem;
  line-height: 1.7;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
  line-height: 1.25;
}

.prose h1 {
  font-size: 2.25rem;
  color: #1f2937;
}

.prose h2 {
  font-size: 1.875rem;
  color: #374151;
}

.prose h3 {
  font-size: 1.5rem;
  color: #374151;
}

.prose strong {
  font-weight: 600;
  color: #111827;
}

.prose em {
  font-style: italic;
}

.prose u {
  text-decoration: underline;
}

.prose blockquote {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  font-style: italic;
  color: #6b7280;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-family: 'Monaco', 'Menlo', monospace;
}

.prose ul,
.prose ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.prose li {
  margin: 0.5rem 0;
}

/* Scrollbar kustom */
textarea::-webkit-scrollbar {
  width: 8px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>