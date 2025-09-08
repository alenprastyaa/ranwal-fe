import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import UserDashboard from '@/views/UserDashboard.vue'
import ProgramPage from '@/views/Admin/ProgramPage.vue'
import KegiatanPage from '@/views/Admin/KegiatanPage.vue'
import SubKegiatan from '@/views/Admin/SubKegiatan.vue'
import AktifitasPage from '@/views/Admin/AktifitasPage.vue'
import SubtitlePage from '@/views/Admin/SubtitlePage.vue'
import RekeningPage from '@/views/Admin/RekeningPage.vue'
import PengampuPage from '@/views/Admin/PengampuPage.vue'
import LaporanPage from '@/views/Admin/LaporanPage.vue'
import HomeView from '@/views/HomeView.vue'
import ArticlePage from '@/views/Admin/ArticlePage.vue'
import ListArtikel from '@/views/Admin/ListArtikel.vue'
import UserManagement from '@/views/Admin/UserManagement.vue'

import axios from 'axios'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: false, isPublic: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false, isPublic: true },
  },
  {
    path: '/admin-dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin-program',
    name: 'admin-program',
    component: ProgramPage,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin-kegiatan',
    name: 'admin-kegiatan',
    component: KegiatanPage,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin-sub-kegiatan',
    name: 'admin-sub-kegiatan',
    component: SubKegiatan,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin-aktifitas',
    name: 'admin-aktifitas',
    component: AktifitasPage,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin-subtitle',
    name: 'admin-subtitle',
    component: SubtitlePage,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin-rekening',
    name: 'admin-rekening',
    component: RekeningPage,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin-pengampu',
    name: 'admin-pengampu',
    component: PengampuPage,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin-laporan',
    name: 'admin-laporan',
    component: LaporanPage,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin-artikel',
    name: 'admin-artikel',
    component: ArticlePage,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin-list-artikel',
    name: 'admin-list artikel',
    component: ListArtikel,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin-user-management',
    name: 'admin user management',
    component: UserManagement,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/user-dashboard',
    name: 'UserDashboard',
    component: UserDashboard,
    meta: { requiresAuth: true, role: 'user' },
  },
  {
    path: '/dashboard',
    redirect: (to) => {
      const userRole = localStorage.getItem('userRole')
      const token = localStorage.getItem('token')

      if (token && userRole === 'admin') {
        return '/admin-dashboard'
      } else if (token && userRole === 'user') {
        return '/user-dashboard'
      }
      return '/login'
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      if (status === 401 && data.message === 'Token Invalid') {
        localStorage.removeItem('token')
        localStorage.removeItem('userRole')
        router.push('/login')
      }
    }
    return Promise.reject(error)
  },
)

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')

  if (to.meta.isPublic) {
    if (token && to.path === '/login') {
      const dashboardPath = userRole === 'admin' ? '/admin-dashboard' : '/user-dashboard'
      return next(dashboardPath)
    }
    return next()
  }

  if (to.meta.requiresAuth) {
    if (!token) {
      localStorage.removeItem('token')
      localStorage.removeItem('userRole')
      return next('/login')
    }

    if (to.meta.role && to.meta.role !== userRole) {
      const correctDashboard = userRole === 'admin' ? '/admin-dashboard' : '/user-dashboard'
      return next(correctDashboard)
    }

    return next()
  }

  next()
})

export default router
