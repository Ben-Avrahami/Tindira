import type { SavedGeoCodeGoogleLocation } from '@/interfaces/geolocation.interface'
import type { Listing, CategoryType } from '@/interfaces/listing.interface'

export interface State {
  isLoading: boolean
  isInitialized: boolean
  connectedUser: string | null
  connectedUserObject: SavedUser | null
  nextListingsArr: Listing[]
  SelectedFilters: SelectedFilters
}

export interface SelectedFilters {
  category: CategoryType
  dates: Date | null
  isWholeDateRangeOnly: boolean
  maxPrice: number | null
  isPricePerWholeTime: boolean
  minNumberOfParkings: number
  minNumberOfRooms: number
  isAnimalFriendly: boolean
  location: SavedGeoCodeGoogleLocation | null
  radiusInKm: number | number[] | undefined
  isWithPorchOrGarden: boolean
}

export interface SavedUser {
  username: string
  email: string
  fullName: string
  phoneNumber: string
  profileDescription: string
  profilePicture: string
  roles: string[]
}
