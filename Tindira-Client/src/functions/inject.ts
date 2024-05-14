import { inject } from 'vue'
import type { ToastServiceMethods } from 'primevue/toastservice'

export const injectToast = (): ToastServiceMethods => {
  const toast = inject<ToastServiceMethods>('toast')
  if (!toast) {
    console.warn('Toast service not found!')
  }
  return toast!
}
