import type { GeoCodeGoogleLocation } from '@/interfaces/geolocation.interface'
import type { Listing } from '@/interfaces/listing.interface'

export interface State {
  isLoading: boolean
  connectedUser: string | null
  nextListingsArr: Listing[]
  SelectedFilters: SelectedFilters
  categoryOptions: SelectedFilters['category'][]
}

export interface SelectedFilters {
  category: 'sublet' | 'rent' | 'animel sublet' | 'switch' | 'buy'
  dates: Date | null
  isWholeDateRangeOnly: boolean
  maxPrice: number | null
  minNumberOfParkings: number
  minNumberOfRooms: number
  isAnimalFriendly: boolean
  city: string | null
  location: GeoCodeGoogleLocation | null
  radiusInKm: number | number[] | undefined
  isWithPorchOrGarden: boolean
}

