import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { State } from './State.interface.js'
export const useAppStore = defineStore('app', {
  state: (): State => ({
    increment: 5,
  }),
  getters: {

  },
  actions: {
    AddIncrement() {
      this.increment++
    } 
  },

})
