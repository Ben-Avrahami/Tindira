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
    },
    {
      path: '/manage',
      name: 'manage',
      component: () => import('@/views/ManageListingsView.vue')
    },
    {
      path: '/listing',
      name: 'listing',
      component: () => import('@/views/ListingFromIDView.vue')
    },
    {
      path: '/add',
      name: 'add',
      component: () => import('@/views/AddListingView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/PageNotFoundView.vue')
    }
  ]
})

const routesAllowedWithoutLogin = ['/login', '/signup', '/listing']

router.beforeResolve(async (to, _, next) => {
  const store = useAppStore()
  if (store.isInitialized === false) {
    await store.initializeState()
  }
  const isLoggedIn = store.isUserConnected

  if (!routesAllowedWithoutLogin.includes(to.path) && !isLoggedIn) {
    // Redirect to login page if user is not logged in
    next('/login')
    return
  }

  if (['/login', '/signup'].includes(to.path) && isLoggedIn) {
    // Redirect to home page if user is logged in
    next('/')
    return
  }

  next()
})

export default router
