import type { SavedGeoCodeGoogleLocation } from '@/interfaces/geolocation.interface'
import type { Listing, CategoryType } from '@/interfaces/listing.interface'
import type { SavedUser } from '@/interfaces/user.interface'

export interface State {
  isLoading: boolean
  isInitialized: boolean
  connectedUser: string | null
  connectedUserObject: SavedUser | null
  connectedUserListings: Listing[]
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
