<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <main class="max-w-8xl mx-auto px-4 py-8">
      <form @submit.prevent="handleSubmit" class="bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <!-- Article Info Section -->
        <div class="space-y-6">
          <div class="border-l-4 border-blue-500 pl-4">
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Article Information</h2>
            <p class="text-gray-600">Fill in the basic information about your article.</p>
          </div>
          <div>
            <label for="title" class="block text-sm font-semibold text-gray-700 mb-2">
              Article Title *
            </label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              required
              class="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="Enter your article title..."
            />
          </div>

          <!-- Cover Image Section -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2"> Cover Image </label>

            <!-- Upload Section -->
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
                  {{ isUploading ? 'Uploading...' : 'Upload Image' }}
                </button>

                <span class="text-sm text-gray-500"> or enter URL manually below </span>
              </div>

              <!-- Upload Status -->
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

            <!-- URL Input -->
            <div>
              <input
                id="cover_image"
                v-model="formData.cover_image"
                type="url"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="https://example.com/image.jpg (or upload file above)"
              />
              <p class="mt-1 text-sm text-gray-500">
                Upload an image file above or enter a cover image URL manually
              </p>
            </div>

            <!-- Image Preview -->
            <div v-if="formData.cover_image" class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Preview:</label>
              <div class="relative inline-block">
                <img
                  :src="formData.cover_image"
                  alt="Cover image preview"
                  class="max-w-xs max-h-48 rounded-lg shadow-md border border-gray-200"
                  @error="handleImageError"
                  @load="handleImageLoad"
                />
                <button
                  type="button"
                  @click="removeCoverImage"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                  title="Remove image"
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

          <!-- Tags -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
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
                placeholder="Add a tag..."
              />
              <button
                type="button"
                @click="addTag"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Add Tag
              </button>
            </div>
            <p class="mt-1 text-sm text-gray-500">
              Add tags to help categorize your article (press Enter to add)
            </p>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">Publication Status</label>
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
                  <div class="text-sm font-medium text-gray-900">Published</div>
                  <div class="text-xs text-gray-500">Visible to everyone</div>
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
                  <div class="text-sm font-medium text-gray-900">Draft</div>
                  <div class="text-xs text-gray-500">Save for later</div>
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
                  <div class="text-sm font-medium text-gray-900">Archived</div>
                  <div class="text-xs text-gray-500">Hidden from public</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Content Editor Section -->
        <div class="space-y-6">
          <div class="border-l-4 border-purple-500 pl-4">
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Article Content</h2>
            <p class="text-gray-600">Write your article content using HTML formatting.</p>
          </div>

          <div>
            <div class="flex items-center justify-between mb-4">
              <label for="content" class="block text-sm font-semibold text-gray-700">
                Content *
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
                  {{ showPreview ? 'Hide Preview' : 'Show Preview' }}
                </button>
              </div>
            </div>

            <!-- Editor Toolbar -->
            <div class="border border-gray-300 border-b-0 rounded-t-lg bg-gray-50 p-4">
              <div class="flex flex-wrap gap-3">
                <div class="flex gap-1">
                  <button
                    type="button"
                    @click="formatText('bold')"
                    class="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200 font-bold text-sm"
                    title="Bold (Ctrl+B)"
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    type="button"
                    @click="formatText('italic')"
                    class="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200 italic text-sm"
                    title="Italic (Ctrl+I)"
                  >
                    <em>I</em>
                  </button>
                  <button
                    type="button"
                    @click="formatText('underline')"
                    class="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200 underline text-sm"
                    title="Underline (Ctrl+U)"
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
                    title="Heading 1"
                  >
                    H1
                  </button>
                  <button
                    type="button"
                    @click="insertHeading(2)"
                    class="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200 font-bold text-sm"
                    title="Heading 2"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    @click="insertHeading(3)"
                    class="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200 font-bold text-sm"
                    title="Heading 3"
                  >
                    H3
                  </button>
                  <button
                    type="button"
                    @click="insertParagraph()"
                    class="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200 text-sm"
                    title="Paragraph"
                  >
                    P
                  </button>
                </div>
              </div>
            </div>

            <!-- Content Input Area -->
            <div class="relative">
              <!-- Content Textarea -->
              <textarea
                id="content"
                ref="contentEditor"
                v-model="formData.content"
                required
                rows="20"
                class="w-full px-4 py-4 border border-gray-300 border-t-0 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none font-mono text-sm leading-relaxed"
                :class="{ hidden: showPreview }"
                placeholder="Write your article content here... You can use HTML tags like <p>, <h1>, <h2>, <strong>, <em>, etc.

Example:
<h1>Main Title</h1>
<p>Your paragraph content goes here...</p>
<h2>Subtitle</h2>
<p>More content with <strong>bold</strong> and <em>italic</em> text.</p>"
              ></textarea>

              <!-- Preview -->
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
                  Preview will appear here as you write...
                </div>
              </div>
            </div>

            <p class="mt-2 text-sm text-gray-500">
              Use HTML tags to format your content. Click the toolbar buttons to insert common
              formatting.
            </p>
          </div>
        </div>

        <!-- Submit Section -->
        <div class="border-t border-gray-200 pt-8">
          <div class="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              @click="handleCancel"
              class="px-8 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium order-2 sm:order-1"
            >
              Cancel
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
                Publishing...
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
                {{ formData.status === 'published' ? 'Publish Article' : 'Save Article' }}
              </span>
            </button>
          </div>

          <!-- Success/Error Messages -->
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

// Props
const props = defineProps({
  apiBaseUrl: {
    type: String,
    default: 'https://bitwisi.cloud/ranwal/api',
  },
})

// Emits
const emit = defineEmits(['cancel', 'success'])

// Reactive data
const formData = ref({
  title: '',
  content: '',
  cover_image: '',
  tags: [],
  status: 'published',
})

const newTag = ref('')
const isSubmitting = ref(false)
const submitMessage = ref('')
const showPreview = ref(false)
const contentEditor = ref(null)
const fileInput = ref(null)
const token = localStorage.getItem('token')
// File upload related
const isUploading = ref(false)
const uploadMessage = ref('')

// Methods
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

  // Validate file type
  if (!file.type.startsWith('image/')) {
    uploadMessage.value = 'Error: Please select an image file'
    return
  }

  // Validate file size (5MB limit)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    uploadMessage.value = 'Error: File size must be less than 5MB'
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
      uploadMessage.value = 'Image uploaded successfully!'

      // Clear success message after 3 seconds
      setTimeout(() => {
        uploadMessage.value = ''
      }, 3000)
    } else {
      uploadMessage.value = `Error: ${data.message || 'Failed to upload file'}`
    }
  } catch (error) {
    console.error('Upload error:', error)
    uploadMessage.value = 'Error: Network error - Unable to upload file'
  } finally {
    isUploading.value = false
    // Clear file input
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
  // Handle broken image URL
  console.log('Image failed to load')
}

const handleImageLoad = () => {
  // Handle successful image load
  console.log('Image loaded successfully')
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
          : '<strong>Bold text</strong>'
        break
      case 'italic':
        replacement = selectedText ? `<em>${selectedText}</em>` : '<em>Italic text</em>'
        break
      case 'underline':
        replacement = selectedText ? `<u>${selectedText}</u>` : '<u>Underlined text</u>'
        break
    }

    if (replacement) {
      const newContent =
        formData.value.content.substring(0, start) +
        replacement +
        formData.value.content.substring(end)
      formData.value.content = newContent

      // Set cursor position after the inserted text
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
    const selectedText = editor.value.substring(start, end) || `Heading ${level}`

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
    const selectedText = editor.value.substring(start, end) || 'Your paragraph text here.'

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
    submitMessage.value = 'Error: Title and content are required'
    return
  }

  isSubmitting.value = true
  submitMessage.value = ''

  try {
    const response = await fetch(`${props.apiBaseUrl}/article/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // tambahkan token
      },
      body: JSON.stringify(formData.value),
    })

    const data = await response.json()

    if (data.status === 200 || data.status === 201) {
      submitMessage.value = `Article ${formData.value.status === 'published' ? 'published' : 'saved'} successfully!`

      // Emit success event and redirect after delay
      setTimeout(() => {
        emit('success', data.data)
      }, 1500)
    } else {
      submitMessage.value = `Error: ${data.message || 'Failed to save article'}`
    }
  } catch (err) {
    submitMessage.value = 'Error: Network error - Unable to connect to server'
    console.error('Submit error:', err)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  // Reset form
  formData.value = {
    title: '',
    content: '',
    cover_image: '',
    tags: [],
    status: 'published',
  }
  newTag.value = ''
  submitMessage.value = ''
  uploadMessage.value = ''
  showPreview.value = false

  // Emit cancel event
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

/* Custom scrollbar */
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
