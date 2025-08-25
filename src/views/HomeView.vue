<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Header -->
    <header class="bg-white shadow-lg border-b-2 border-blue-100">
      <div class="max-w-6xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div
              class="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
            >
              <span class="text-white font-bold text-xl">B</span>
            </div>
            <h1
              class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              Tech Blog
            </h1>
          </div>
          <nav class="hidden md:flex space-x-8">
            <router-link
              to="/login"
              href="#"
              class="bg-red-600 px-3 py-2 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
              >Sign In</router-link
            >
          </nav>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 py-8">
      <!-- Article Detail View -->
      <div v-if="selectedArticle" class="mb-8">
        <button
          @click="selectedArticle = null"
          class="mb-6 inline-flex items-center px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
          Back to Articles
        </button>

        <article class="bg-white rounded-2xl shadow-xl overflow-hidden">
          <!-- Cover Image Section - Fixed with proper image handling -->
          <div class="relative">
            <!-- Main Cover Image -->
            <div
              v-if="selectedArticle.cover_image && !imageError"
              class="h-96 relative overflow-hidden"
            >
              <img
                :src="selectedArticle.cover_image"
                :alt="selectedArticle.title || 'Cover Image'"
                class="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                @error="onImageError"
                @load="onImageLoad"
                loading="lazy"
              />

              <!-- Loading overlay -->
              <div
                v-if="imageLoading"
                class="absolute inset-0 bg-gray-200 flex items-center justify-center"
              >
                <div class="flex items-center space-x-2">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span class="text-gray-600">Loading image...</span>
                </div>
              </div>

              <!-- Gradient overlay for better text readability -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
              ></div>
            </div>

            <!-- Fallback when no image or error -->
            <div
              v-else
              class="h-96 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center relative"
            >
              <div class="text-center text-white">
                <svg
                  class="w-16 h-16 mx-auto mb-4 opacity-60"
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
                <p class="text-lg font-medium opacity-80">
                  {{ imageError ? 'Image failed to load' : 'No cover image' }}
                </p>
                <p class="text-sm opacity-60 mt-1" v-if="imageError && selectedArticle.cover_image">
                  URL: {{ selectedArticle.cover_image }}
                </p>
              </div>
              <!-- Decorative pattern -->
            </div>
          </div>

          <!-- Article Content -->
          <div class="p-8">
            <div class="mb-6">
              <!-- Tags -->
              <div class="flex flex-wrap gap-2 mb-6">
                <span
                  v-for="tag in selectedArticle.tags"
                  :key="tag"
                  class="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-full hover:bg-blue-200 transition-colors duration-200"
                >
                  {{ tag }}
                </span>
              </div>

              <!-- Title -->
              <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {{ selectedArticle.title }}
              </h1>

              <!-- Meta Information -->
              <div class="flex flex-wrap items-center text-gray-600 text-sm gap-6 mb-8">
                <div class="flex items-center">
                  <div
                    class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3 shadow-lg"
                  >
                    <span class="text-white text-sm font-semibold">{{
                      selectedArticle.name?.charAt(0) || '?'
                    }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="font-medium text-gray-900">{{ selectedArticle.name }}</span>
                    <span class="text-xs text-gray-500">Author</span>
                  </div>
                </div>

                <div class="flex items-center">
                  <svg
                    class="w-4 h-4 mr-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <span>{{ formatDate(selectedArticle.created_at) }}</span>
                </div>

                <div class="flex items-center">
                  <svg
                    class="w-4 h-4 mr-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
                  <span>{{ selectedArticle.views_count || 0 }} views</span>
                </div>
              </div>
            </div>

            <!-- Article Content -->
            <div
              class="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-strong:text-gray-900 prose-blockquote:border-blue-300 prose-blockquote:bg-blue-50 prose-blockquote:p-4 prose-blockquote:rounded-lg"
              v-html="selectedArticle.content"
            ></div>
          </div>
        </article>
      </div>

      <!-- Articles List View -->
      <div v-else>
        <!-- Search Bar -->
        <div class="mb-8">
          <div class="relative max-w-md">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                class="h-5 w-5 text-gray-400"
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
            <input
              v-model="searchQuery"
              @input="searchArticles"
              type="text"
              class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              placeholder="Search articles..."
            />
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
          ></div>
          <p class="mt-4 text-gray-600">Loading articles...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center"
          >
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Failed to load articles</h3>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button
            @click="fetchArticles"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>

        <!-- Articles Grid -->
        <div v-else-if="articles.length > 0" class="space-y-8">
          <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <article
              v-for="article in articles"
              :key="article.id"
              class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer group"
              @click="viewArticle(article.slug)"
            >
              <!-- Article Card Image -->
              <div class="h-48 relative overflow-hidden">
                <img
                  v-if="article.cover_image"
                  :src="article.cover_image"
                  :alt="article.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  @error="(e) => handleCardImageError(e, article.id)"
                  loading="lazy"
                />
                <!-- Fallback for card images -->
                <div
                  v-else
                  class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 group-hover:from-blue-600 group-hover:to-purple-700 transition-all duration-300 flex items-center justify-center"
                >
                  <svg
                    class="w-12 h-12 text-white opacity-60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 011 1l4 4v9a2 2 0 01-2 2z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 2v6h6"
                    ></path>
                  </svg>
                </div>
              </div>

              <div class="p-6">
                <!-- Tags -->
                <div class="flex flex-wrap gap-2 mb-3">
                  <span
                    v-for="tag in article.tags.slice(0, 2)"
                    :key="tag"
                    class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                  >
                    {{ tag }}
                  </span>
                  <span
                    v-if="article.tags.length > 2"
                    class="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
                  >
                    +{{ article.tags.length - 2 }}
                  </span>
                </div>

                <!-- Title -->
                <h2
                  class="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200"
                >
                  {{ article.title }}
                </h2>

                <!-- Excerpt -->
                <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                  {{ article.excerpt || 'No excerpt available' }}
                </p>

                <!-- Meta -->
                <div class="flex items-center justify-between text-xs text-gray-500">
                  <div class="flex items-center">
                    <div
                      class="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-2"
                    >
                      <span class="text-white text-xs font-semibold">{{
                        article.name?.charAt(0) || '?'
                      }}</span>
                    </div>
                    <span class="font-medium">{{ article.name || 'Unknown' }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span>{{ formatDate(article.created_at) }}</span>
                    <span>•</span>
                    <span>{{ article.views_count || 0 }} views</span>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <!-- Pagination -->
          <div v-if="pagination.total_page > 1" class="flex justify-center mt-12">
            <nav class="flex items-center space-x-2">
              <button
                @click="changePage(pagination.current_page - 1)"
                :disabled="pagination.current_page <= 1"
                class="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Previous
              </button>

              <span
                v-for="page in getPageNumbers()"
                :key="page"
                @click="changePage(page)"
                :class="[
                  'px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors duration-200',
                  page === pagination.current_page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50',
                ]"
              >
                {{ page }}
              </span>

              <button
                @click="changePage(pagination.current_page + 1)"
                :disabled="pagination.current_page >= pagination.total_page"
                class="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
              </button>
            </nav>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-8 h-8 text-gray-400"
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
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
          <p class="text-gray-600">
            Try adjusting your search terms or check back later for new content.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Reactive data
const articles = ref([])
const selectedArticle = ref(null)
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const imageLoading = ref(true)
const imageError = ref(false)
const cardImageErrors = ref(new Set())

const pagination = ref({
  current_page: 1,
  total_page: 1,
  filtered_result: 0,
  total_result: 0,
})

// API base URL
const API_BASE_URL = 'https://bitwisi.cloud/ranwal/api'

// Image handling methods
const onImageError = (event) => {
  console.error('Cover image failed to load:', selectedArticle.value?.cover_image)
  imageError.value = true
  imageLoading.value = false
  // Hide the broken image
  event.target.style.display = 'none'
}

const onImageLoad = (event) => {
  console.log('Cover image loaded successfully:', selectedArticle.value?.cover_image)
  imageLoading.value = false
  imageError.value = false
}

const handleCardImageError = (event, articleId) => {
  console.error('Card image failed to load for article:', articleId)
  cardImageErrors.value.add(articleId)
  // Hide the broken image and show fallback
  event.target.style.display = 'none'
}

// Fetch articles from API
const fetchArticles = async (page = 1, search = '') => {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch(
      `${API_BASE_URL}/article/list?page=${page}&limit=6&search=${encodeURIComponent(search)}`,
    )
    const data = await response.json()

    if (data.status === 200) {
      articles.value = data.data || []
      pagination.value = data.filter || {
        current_page: 1,
        total_page: 1,
        filtered_result: 0,
        total_result: 0,
      }
    } else {
      error.value = data.message || 'Failed to fetch articles'
      articles.value = []
    }
  } catch (err) {
    error.value = 'Network error: Unable to connect to the server'
    articles.value = []
    console.error('Fetch error:', err)
  } finally {
    loading.value = false
  }
}

// Fetch single article
const fetchArticle = async (slug) => {
  loading.value = true
  error.value = ''
  imageLoading.value = true
  imageError.value = false

  try {
    const response = await fetch(`${API_BASE_URL}/article/${slug}/get`)
    const data = await response.json()

    if (data.status === 200) {
      selectedArticle.value = data.data
      // Reset image states when new article is loaded
      imageLoading.value = !!data.data?.cover_image
      imageError.value = false
    } else {
      error.value = data.message || 'Failed to fetch article'
      selectedArticle.value = null
    }
  } catch (err) {
    error.value = 'Network error: Unable to connect to the server'
    selectedArticle.value = null
    console.error('Fetch error:', err)
  } finally {
    loading.value = false
  }
}

// View article detail
const viewArticle = (slug) => {
  fetchArticle(slug)
  // Scroll to top when viewing article
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Search articles with debounce
let searchTimeout = null
const searchArticles = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchArticles(1, searchQuery.value)
  }, 300)
}

// Change page
const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.total_page) {
    fetchArticles(page, searchQuery.value)
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Get page numbers for pagination
const getPageNumbers = () => {
  const pages = []
  const current = pagination.value.current_page
  const total = pagination.value.total_page

  // Show up to 5 page numbers
  let start = Math.max(1, current - 2)
  let end = Math.min(total, start + 4)

  if (end - start < 4) {
    start = Math.max(1, end - 4)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'Unknown date'

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (err) {
    return 'Invalid date'
  }
}

// Initialize
onMounted(() => {
  fetchArticles()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Enhanced prose styling */
.prose {
  max-width: none;
  line-height: 1.7;
}

.prose p {
  margin-bottom: 1.5rem;
  text-align: justify;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  line-height: 1.3;
}

.prose h1 {
  font-size: 2.25rem;
}
.prose h2 {
  font-size: 1.875rem;
}
.prose h3 {
  font-size: 1.5rem;
}
.prose h4 {
  font-size: 1.25rem;
}

.prose ul,
.prose ol {
  margin: 1.5rem 0;
  padding-left: 1.5rem;
}

.prose li {
  margin: 0.5rem 0;
}

.prose blockquote {
  margin: 2rem 0;
  font-style: italic;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875em;
}

.prose pre {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
  overflow-x: auto;
}

/* Smooth transitions */
* {
  transition: all 0.2s ease;
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
