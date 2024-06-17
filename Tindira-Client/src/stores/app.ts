import { defineStore } from 'pinia'
import { type SavedUser, type SelectedFilters, type State } from './State.interface'
import API from '@/api/index.js'

const LOCAL_STORAGE_USER_KEY = 'connectedUser'

export const useAppStore = defineStore('app', {
  state: (): State => ({
    isLoading: false,
    isInitialized: false,
    connectedUserObject: null,
    connectedUserListings: [],
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
    }
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
        await this.connectUser(userId)
      }
      this.isLoading = false
      this.isInitialized = true
    },
    async connectUser(userId: string, userObject: SavedUser | null = null) {
      if (userObject) {
        this.connectedUserObject = userObject
      } else {
        const user = await API.getUser(userId)
        this.connectedUserObject = user
        API.getListingsById(user.listings).then((listings) => {
          this.connectedUserListings = listings
        }) // lazy load
      }
      this.connectedUser = userId
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, userId)
      await this.getNextListingsAndReplace(5)
    },
    disconnectUser() {
      this.connectedUser = null
      this.connectedUserObject = null
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY)
    },
    async getNextListing(amount: number) {
      const ignoreIds = this.nextListingsArr.map((listing) => listing.listingId)
      const newListings = await API.getNextListings(
        amount,
        this.SelectedFilters,
        this.getOrThrowConnectedUser,
        ignoreIds
      )
      return newListings
    },
    async getNextListingsAndReplace(amount: number) {
      const newListing = await this.getNextListing(amount)
      this.nextListingsArr = newListing
    },
    async getAndPushNextListing(amount: number) {
      const newListing = await this.getNextListing(amount)
      this.nextListingsArr.push(...newListing)
    },
    async updateFilters(newFilters: SelectedFilters) {
      if (JSON.stringify(this.SelectedFilters) !== JSON.stringify(newFilters)) {
        this.nextListingsArr = []
        this.SelectedFilters = newFilters
        this.isLoading = true
        await this.getNextListingsAndReplace(5)
        this.isLoading = false
      }
    },
    async performAsyncAction(callback: () => Promise<void>) {
      this.isLoading = true
      try {
        await callback()
      } finally {
        this.isLoading = false
      }
    }
  }
})
