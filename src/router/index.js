import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/pages/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/success',
      name: 'success',
      component: () => import('@/pages/SuccessPage.vue')
    },
    {
      path: '/repeat',
      name: 'repeat',
      component: () => import('@/pages/RepeatPage.vue')
    }
  ]
})

export default router
