import { defineStore } from 'pinia'
import type { State } from './State.interface.js'
import API from '@/api/index.js'

export const useAppStore = defineStore('app', {
  state: (): State => ({
    isLoading: false,
    category: "sublet",
    nextListingsArr: []
  }),
  getters: {},
  actions: {
    async initializeState() {
      this.isLoading = true;
      this.nextListingsArr = await API.getNextListings(5, "rent", {}, "galben", []);
      this.isLoading = false;
    },
    async changeCategory(newCategory: "sublet" | "rent" | "animel sublet" | "switch" | "buy") {
      this.category = newCategory;
      this.isLoading = true;
      this.nextListingsArr = await API.getNextListings(5, newCategory, {}, "galben", []);
      this.isLoading = false;
    }

  }
})
