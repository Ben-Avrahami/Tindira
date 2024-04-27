import { defineStore } from 'pinia'
import { useToast } from 'primevue/usetoast'
import type { ToastMessageOptions } from 'primevue/toast'

export const useToaster = defineStore('toast', {
  state: (): { toast: ReturnType<typeof useToast> } => ({
    toast: useToast()
  }),
  actions: {
    add(message: ToastMessageOptions) {
      this.toast.add(message)
    }
  }
})

export type Toaster = ReturnType<typeof useToaster>
