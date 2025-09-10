<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <header class="bg-white shadow-lg border-b-2 border-blue-100 sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2 sm:space-x-4">
            <img
              class="w-6 h-6 sm:w-8 sm:h-8"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Coat_of_arms_of_Jakarta.svg/640px-Coat_of_arms_of_Jakarta.svg.png"
              alt=""
            />
            <h1 class="text-xl sm:text-2xl md:text-3xl font-bold bg-clip-text">SIREMON</h1>
          </div>

          <nav class="hidden md:flex items-center space-x-4">
            <router-link
              to="/login"
              class="bg-blue-900 px-3 py-2 text-white text-base rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >Sign In</router-link
            >
          </nav>

          <div class="md:hidden flex items-center space-x-3">
            <div class="relative inline-block text-left">
              <button
                type="button"
                class="inline-flex justify-center items-center px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                @click="toggleCategoryMenu"
              >
                <svg
                  class="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ selectedCategory || 'Katogori' }}
              </button>

              <div
                v-if="showCategoryMenu"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 py-1"
                role="menu"
                aria-orientation="vertical"
              >
                <a
                  href="#"
                  @click.prevent="selectCategory(null)"
                  class="block px-4 py-2 text-sm hover:bg-gray-100"
                  :class="
                    selectedCategory === null
                      ? 'text-blue-600 bg-blue-50 font-medium'
                      : 'text-gray-700'
                  "
                  role="menuitem"
                >
                  Semua Katogori
                </a>
                <a
                  v-for="category in categories"
                  :key="category"
                  href="#"
                  @click.prevent="selectCategory(category)"
                  class="block px-4 py-2 text-sm hover:bg-gray-100"
                  :class="
                    selectedCategory === category
                      ? 'text-blue-600 bg-blue-50 font-medium'
                      : 'text-gray-700'
                  "
                  role="menuitem"
                >
                  {{ category }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div v-if="selectedArticle" class="mb-6 sm:mb-8">
        <button
          @click="selectedArticle = null"
          class="mb-4 sm:mb-6 inline-flex items-center px-3 py-2 sm:px-4 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 text-sm sm:text-base"
        >
          <svg
            class="w-4 h-4 sm:w-5 sm:h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
          Back to Articles
        </button>

        <article class="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
          <div class="relative">
            <div
              v-if="selectedArticle.cover_image && !imageError"
              class="h-48 sm:h-64 md:h-80 lg:h-96 relative overflow-hidden"
            >
              <img
                :src="selectedArticle.cover_image"
                :alt="selectedArticle.title || 'Cover Image'"
                class="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                @error="onImageError"
                @load="onImageLoad"
                loading="lazy"
              />

              <div
                v-if="imageLoading"
                class="absolute inset-0 bg-gray-200 flex items-center justify-center"
              >
                <div class="flex items-center space-x-2">
                  <div
                    class="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-600"
                  ></div>
                  <span class="text-gray-600 text-sm sm:text-base">Loading image...</span>
                </div>
              </div>

              <div
                class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
              ></div>
            </div>

            <div
              v-else
              class="h-48 sm:h-64 md:h-80 lg:h-96 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center relative"
            >
              <div class="text-center text-white px-4">
                <svg
                  class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-60"
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
                <p class="text-base sm:text-lg font-medium opacity-80">
                  {{ imageError ? 'Image failed to load' : 'No cover image' }}
                </p>
                <p
                  class="text-xs sm:text-sm opacity-60 mt-1 break-all"
                  v-if="imageError && selectedArticle.cover_image"
                >
                  URL: {{ selectedArticle.cover_image }}
                </p>
              </div>
            </div>
          </div>

          <div class="p-4 sm:p-6 lg:p-8">
            <div class="mb-4 sm:mb-6">
              <div class="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                <span
                  v-for="tag in selectedArticle.tags"
                  :key="tag"
                  class="px-2 py-1 sm:px-4 sm:py-2 bg-blue-100 text-blue-700 text-xs sm:text-sm font-medium rounded-full hover:bg-blue-200 transition-colors duration-200"
                >
                  {{ tag }}
                </span>
              </div>

              <div
                v-if="selectedArticle.category"
                class="flex items-center mb-4 sm:mb-6 text-sm sm:text-base text-blue-600 font-medium"
              >
                <svg
                  class="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 15L12 11L16 15"
                  ></path>
                </svg>
                {{ selectedArticle.category }}
              </div>

              <h1 class="text-2xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                {{ selectedArticle.title }}
              </h1>

              <div
                class="flex flex-col sm:flex-row sm:flex-wrap sm:items-center text-gray-600 text-xs sm:text-sm gap-3 sm:gap-6 mb-6 sm:mb-8"
              >
                <div class="flex items-center">
                  <div
                    class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3 shadow-lg"
                  >
                    <span class="text-white text-xs sm:text-sm font-semibold">{{
                      selectedArticle.name?.charAt(0) || '?'
                    }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="font-medium text-gray-900 text-sm sm:text-base">{{
                      selectedArticle.name
                    }}</span>
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

            <div
              class="prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-strong:text-gray-900 prose-blockquote:border-blue-300 prose-blockquote:bg-blue-50 prose-blockquote:p-4 prose-blockquote:rounded-lg mobile-prose"
              v-html="selectedArticle.content"
            ></div>
          </div>
        </article>
      </div>

      <div v-else>
        <!-- Featured Article Section -->
        <div v-if="featuredArticle" class="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div
            class="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <img
              :src="featuredArticle.cover_image"
              :alt="featuredArticle.title"
              class="w-full h-full object-cover"
            />
          </div>
          <div>
            <span class="text-blue-600 font-semibold">{{ featuredArticle.category }}</span>
            <h1 class="text-4xl font-bold text-gray-900 my-2">{{ featuredArticle.title }}</h1>
            <p class="text-gray-600 mb-4">{{ featuredArticle.excerpt }}</p>
            <button
              @click="viewArticle(featuredArticle.slug)"
              class="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Read More
            </button>
          </div>
        </div>

        <!-- Search and Filter Section -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
          <div class="relative w-full sm:max-w-md mb-4 sm:mb-0">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
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
              class="block w-full pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl text-sm sm:text-base leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              placeholder="Search articles..."
            />
          </div>
          <div class="hidden sm:block relative inline-block text-left w-full sm:w-auto">
            <div>
              <button
                type="button"
                class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                id="menu-button"
                aria-expanded="true"
                aria-haspopup="true"
                @click="toggleCategoryMenu"
              >
                {{ selectedCategory || 'Katogori' }}
                <svg
                  class="-mr-1 ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div
              v-if="showCategoryMenu"
              class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              tabindex="-1"
            >
              <div class="py-1" role="none">
                <a
                  href="#"
                  @click.prevent="selectCategory(null)"
                  class="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
                  :class="
                    selectedCategory === null
                      ? 'text-blue-600 bg-blue-50 font-medium'
                      : 'text-gray-700'
                  "
                  role="menuitem"
                  tabindex="-1"
                  id="menu-item-0"
                  >Semua Katogori</a
                >
                <a
                  v-for="category in categories"
                  :key="category"
                  href="#"
                  @click.prevent="selectCategory(category)"
                  class="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
                  :class="
                    selectedCategory === category
                      ? 'text-blue-600 bg-blue-50 font-medium'
                      : 'text-gray-700'
                  "
                  role="menuitem"
                  tabindex="-1"
                  >{{ category }}</a
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Articles Grid -->
        <div v-if="loading" class="text-center py-8 sm:py-12">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"
          ></div>
          <p class="mt-4 text-gray-600 text-sm sm:text-base">Loading articles...</p>
        </div>
        <div v-else-if="error" class="text-center py-8 sm:py-12 px-4">
          <div
            class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 sm:w-8 sm:h-8 text-red-600"
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
          </div>
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            Failed to load articles
          </h3>
          <p class="text-gray-600 mb-4 text-sm sm:text-base break-words">{{ error }}</p>
          <button
            @click="fetchArticles"
            class="px-4 py-2 sm:px-6 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
        <div v-else-if="articles.length > 0" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="article in articles.slice(1)"
            :key="article.id"
            class="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden cursor-pointer group"
            @click="viewArticle(article.slug)"
          >
            <div class="h-48 overflow-hidden">
              <img
                v-if="article.cover_image"
                :src="article.cover_image"
                :alt="article.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div
                v-else
                class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
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
              <span class="text-sm text-blue-600 font-semibold">{{ article.category }}</span>
              <h2
                class="text-xl font-bold text-gray-900 my-2 group-hover:text-blue-600 transition-colors duration-200"
              >
                {{ article.title }}
              </h2>
              <p class="text-gray-600 text-sm">{{ article.excerpt }}</p>
            </div>
          </article>
        </div>
        <div v-else class="text-center py-8 sm:py-12 px-4">
          <div
            class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 sm:w-8 sm:h-8 text-gray-400"
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
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
          <p class="text-gray-600 text-sm sm:text-base">
            Try adjusting your search terms or check back later for new content.
          </p>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.total_page > 1" class="flex justify-center mt-8 sm:mt-12">
          <nav class="flex items-center space-x-1 sm:space-x-2">
            <button
              @click="changePage(pagination.current_page - 1)"
              :disabled="pagination.current_page <= 1"
              class="px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md sm:rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <span class="hidden sm:inline">Previous</span>
              <span class="sm:hidden">Prev</span>
            </button>
            <div class="flex items-center space-x-1 sm:space-x-2 max-w-xs overflow-x-auto">
              <span
                v-for="page in getPageNumbers()"
                :key="page"
                @click="changePage(page)"
                :class="[
                  'px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg cursor-pointer transition-colors duration-200 whitespace-nowrap',
                  page === pagination.current_page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50',
                ]"
                >{{ page }}</span
              >
            </div>
            <button
              @click="changePage(pagination.current_page + 1)"
              :disabled="pagination.current_page >= pagination.total_page"
              class="px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md sm:rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <span class="hidden sm:inline">Next</span>
              <span class="sm:hidden">Next</span>
            </button>
          </nav>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'

const articles = ref([])
const selectedArticle = ref(null)
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const imageLoading = ref(true)
const imageError = ref(false)

const pagination = ref({
  current_page: 1,
  total_page: 1,
  filtered_result: 0,
  total_result: 0,
})

const categories = ref([
  'Tindak Lanjut Hasil Musrenbang',
  'Usulan Reses DPRD',
  'Usulan Langsung Warga Masyarakat',
  'Kegiatan Rutin',
])
const selectedCategory = ref(null)
const showCategoryMenu = ref(false)

const API_BASE_URL = 'https://bitwisi.cloud/ranwal/api'

const featuredArticle = computed(() => (articles.value.length > 0 ? articles.value[0] : null))

const onImageError = () => {
  imageError.value = true
  imageLoading.value = false
}

const onImageLoad = () => {
  imageLoading.value = false
  imageError.value = false
}

const fetchArticles = async (page = 1) => {
  loading.value = true
  error.value = ''
  const params = new URLSearchParams({
    page: page.toString(),
    limit: '7', // Fetch 7 to have 1 featured and 6 in the grid
  })
  if (searchQuery.value.trim()) {
    params.append('search', searchQuery.value.trim())
  }
  if (selectedCategory.value) {
    params.append('category', selectedCategory.value)
  }
  try {
    const response = await fetch(`${API_BASE_URL}/article/list?${params}`)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const data = await response.json()
    if (data.status === 200) {
      articles.value = Array.isArray(data.data) ? data.data : []
      pagination.value = data.filter || {
        current_page: page,
        total_page: 1,
        filtered_result: 0,
        total_result: 0,
      }
    } else {
      error.value = data.message || 'Failed to fetch articles'
      articles.value = []
    }
  } catch (err) {
    error.value = `Network error: ${err.message}`
    articles.value = []
  } finally {
    loading.value = false
  }
}

const fetchArticle = async (slug) => {
  loading.value = true
  error.value = ''
  imageLoading.value = true
  imageError.value = false
  try {
    const response = await fetch(`${API_BASE_URL}/article/${slug}/get`)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const data = await response.json()
    if (data.status === 200) {
      selectedArticle.value = data.data
      imageLoading.value = !!data.data?.cover_image
      imageError.value = false
    } else {
      error.value = data.message || 'Failed to fetch article'
      selectedArticle.value = null
    }
  } catch (err) {
    error.value = `Network error: ${err.message}`
    selectedArticle.value = null
  } finally {
    loading.value = false
  }
}

const viewArticle = (slug) => {
  if (!slug) return
  fetchArticle(slug)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

let searchTimeout = null
const searchArticles = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchArticles(1)
  }, 300)
}

const selectCategory = (category) => {
  selectedCategory.value = category
  showCategoryMenu.value = false
  fetchArticles(1)
}

const toggleCategoryMenu = () => {
  showCategoryMenu.value = !showCategoryMenu.value
}

const closeMenus = (event) => {
  if (!event.target.closest('.relative.inline-block')) {
    showCategoryMenu.value = false
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.total_page && page !== pagination.value.current_page) {
    fetchArticles(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const getPageNumbers = () => {
  const pages = []
  const current = pagination.value.current_page
  const total = pagination.value.total_page
  const maxPages = 5
  let start = Math.max(1, current - Math.floor(maxPages / 2))
  let end = Math.min(total, start + maxPages - 1)
  if (end - start < maxPages - 1) {
    start = Math.max(1, end - maxPages + 1)
  }
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
}

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown date'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid date'
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch (err) {
    return 'Invalid date'
  }
}

onMounted(() => {
  fetchArticles()
  document.addEventListener('click', closeMenus)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenus)
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
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
</style>
