import { defineStore } from 'pinia'
import type { SelectedFilters, State } from './State.interface.js'
import API from '@/api/index.js'

const LOCAL_STORAGE_USER_KEY = 'connectedUser'

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
    isUserConnected: (state) => state.connectedUser !== null,
    getOrThrowConnectedUser: (state) => {
      if (!state.connectedUser) {
        throw new Error('User not connected')
      }
      return state.connectedUser
    }
  },
  actions: {
    async initializeState() {
      this.isLoading = true
      const userId = localStorage.getItem(LOCAL_STORAGE_USER_KEY)
      if (userId) {
        this.connectedUser = userId
        this.nextListingsArr = await API.getNextListings(5, this.SelectedFilters, userId, [])
      }
      this.isLoading = false
    },
    connectUser(userId: string) {
      this.connectedUser = userId
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, userId)
    },
    disconnectUser() {
      this.connectedUser = null
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY)
    },
    async getNextListing(amount: number) {
      const newListing = await API.getNextListings(
        amount,
        this.SelectedFilters,
        this.getOrThrowConnectedUser,
        []
      )
      this.nextListingsArr.push(...newListing)
    },
    async updateFilters(newFilters: SelectedFilters) {
      if (JSON.stringify(this.SelectedFilters) !== JSON.stringify(newFilters)) {
        console.log('filters', JSON.stringify(newFilters))
        this.SelectedFilters = newFilters
        this.isLoading = true
        this.nextListingsArr = await API.getNextListings(
          5,
          newFilters,
          this.getOrThrowConnectedUser,
          []
        )
        this.isLoading = false
      }
    }
  }
})
