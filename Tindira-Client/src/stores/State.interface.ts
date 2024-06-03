import type { GeoCodeGoogleLocation, SavedGeoCodeGoogleLocation } from '@/interfaces/geolocation.interface'
import type { Listing } from '@/interfaces/listing.interface'

export interface State {
  isLoading: boolean
  connectedUser: string | null
  nextListingsArr: Listing[]
  SelectedFilters: SelectedFilters
  categoryOptions: SelectedFilters['category'][]
}

export interface SelectedFilters {
  category: 'sublet' | 'rent'
  dates: Date | null
  isWholeDateRangeOnly: boolean
  maxPrice: number | null
  isPricePerWholeTime:boolean
  minNumberOfParkings: number
  minNumberOfRooms: number
  isAnimalFriendly: boolean
  location: SavedGeoCodeGoogleLocation | null
  radiusInKm: number | number[] | undefined
  isWithPorchOrGarden: boolean
}

