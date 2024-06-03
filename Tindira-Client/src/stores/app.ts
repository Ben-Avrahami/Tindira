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
      isPricePerWholeTime: false,
      minNumberOfParkings: 0,
      minNumberOfRooms: 0,
      isAnimalFriendly: false,
      radiusInKm: undefined,
      location: null,
      isWithPorchOrGarden: false
    },
    categoryOptions: ['sublet', 'rent'],
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
        await this.getNextListingsAndReplace(5)
      }
      this.isLoading = false
    },
    async connectUser(userId: string) {
      this.connectedUser = userId
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, userId)
      await this.getNextListingsAndReplace(5);
    },
    disconnectUser() {
      this.connectedUser = null
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY)
    },
    async getNextListing(amount: number) {
      let ignoreIds=this.nextListingsArr.map(listing => listing.listingId);
//       const newListings = await API.getNextListings(
//         amount,
//         this.SelectedFilters,
//         this.getOrThrowConnectedUser,
//         ignoreIds
//       )
// return newListings;
return [];
    },
    async getNextListingsAndReplace(amount: number) {
  const newListing = await this.getNextListing(amount);
  this.nextListingsArr = newListing;
},
    async getAndPushNextListing(amount: number) {
  const newListing = await this.getNextListing(amount);
  this.nextListingsArr.push(...newListing);
},
    async updateFilters(newFilters: SelectedFilters) {
  if (JSON.stringify(this.SelectedFilters) !== JSON.stringify(newFilters)) {
    console.log('filters', JSON.stringify(newFilters))
    this.SelectedFilters = newFilters
    this.isLoading = true
    await this.getNextListingsAndReplace(5);
    this.isLoading = false
  }
}
  }
})
