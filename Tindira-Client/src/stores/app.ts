import { defineStore } from 'pinia'
import type { SelectedFilters, State } from './State.interface.js'
import API from '@/api/index.js'

export const useAppStore = defineStore('app', {
  state: (): State => ({
    isLoading: false,
    connectedUser: null,
    nextListingsArr: [],
    SelectedFilters: {
      category: 'rent',
      dates: null,
      isWholeDateRangeOnly: false,
      maxPrice: null,
      minNumberOfParkings: 0,
      minNumberOfRooms: 0,
      isAnimalFriendly: false,
      city: null,
      radiusInKm: null,
      location: null,
      isWithPorchOrGarden: false
    },
    categoryOptions: ['sublet', 'rent', 'animel sublet', 'switch', 'buy']
  }),
  getters: {
    isUserConnected: (state) => state.connectedUser !== null
  },
  actions: {
    async initializeState() {
      this.isLoading = true
      this.nextListingsArr = await API.getNextListings(5, this.SelectedFilters, 'galben', [])
      this.isLoading = false
    },
    connectUser(userId: string) {
      this.connectedUser = userId
    },
    disconnectUser() {
      this.connectedUser = null
    },
    async getNextListing(amount: number) {
      const newListing = await API.getNextListings(amount, this.SelectedFilters, 'galben', [])
      this.nextListingsArr.push(...newListing)
    },
    async updateFilters(newFilters: SelectedFilters) {
      if (JSON.stringify(this.SelectedFilters) !== JSON.stringify(newFilters)) {
        console.log('filters', JSON.stringify(newFilters))
        this.SelectedFilters = newFilters
        this.isLoading = true
        this.nextListingsArr = await API.getNextListings(5, newFilters, 'galben', [])
        this.isLoading = false
      }
    }
  }
})
