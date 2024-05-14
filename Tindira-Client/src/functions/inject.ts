import { inject } from 'vue'
import type { ToastServiceMethods } from 'primevue/toastservice'
import { useAppStore } from '@/stores/app'

export const injectToast = (): ToastServiceMethods => {
  const toast = inject<ToastServiceMethods>('toast')
  if (!toast) {
    console.warn('Toast service not found!')
  }
  return toast!
}

export const injectAppStore = (): ReturnType<typeof useAppStore> => {
  const store = inject<ReturnType<typeof useAppStore>>('appStore')
  if (!store) {
    console.warn('App store not found!')
  }
  return store!
}
