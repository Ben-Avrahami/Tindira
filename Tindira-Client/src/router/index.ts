import { useAppStore } from '@/stores/app'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/SignupView.vue')
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('@/views/SwipingHistoryView.vue')
    }
  ]
})

const routesAllowedWithoutLogin = ['/login', '/signup']

router.beforeResolve((to, _, next) => {
  const store = useAppStore()
  const isLoggedIn = store.isUserConnected

  if (!routesAllowedWithoutLogin.includes(to.path) && !isLoggedIn) {
    // Redirect to login page if user is not logged in
    next('/login')
    return
  }

  if (routesAllowedWithoutLogin.includes(to.path) && isLoggedIn) {
    // Redirect to home page if user is logged in
    next('/')
    return
  }

  next()
})

export default router
