import type { SavedGeoCodeGoogleLocation } from './geolocation.interface'

export type Listing = {
  likedBy: string[]
  listingId: string
  postExpireDate: Date
  contractEndDate: Date
  numberOfRooms: number
  coordinates: SavedGeoCodeGoogleLocation
  parkingSpaces: number
  ownerId: string
  contractStartDate: string
  isWithGardenOrPorch: boolean
  isAnimalFriendly: boolean
  isPricePerWholeTime: boolean
  pricePerMonth: number
  pricePerWholeTime: number
  isActive: boolean
  category: string
  images: string[]
  description: string
  title: string
  postUploadDate: string
}

export const isListingInterface = (listing: any): listing is Listing => {
  return (
    // typeof listing.likedBy === 'object' && // history api does not return likedBy
    typeof listing.listingId === 'string' &&
    typeof listing.postExpireDate === 'string' &&
    typeof listing.contractEndDate === 'string' &&
    typeof listing.numberOfRooms === 'number' &&
    typeof listing.coordinates === 'object' &&
    typeof listing.parkingSpaces === 'number' &&
    typeof listing.ownerId === 'string' &&
    typeof listing.contractStartDate === 'string' &&
    typeof listing.isWithGardenOrPorch === 'boolean' &&
    typeof listing.isAnimalFriendly === 'boolean' &&
    typeof listing.isPricePerWholeTime === 'boolean' &&
    typeof listing.pricePerMonth === 'number' &&
    typeof listing.pricePerWholeTime === 'number' &&
    typeof listing.isActive === 'boolean' &&
    typeof listing.category === 'string' &&
    typeof listing.images === 'object' &&
    typeof listing.description === 'string' &&
    // typeof listing.postUploadDate === 'string' && // TODO: Fix this, I think that db is corrupted
    typeof listing.title === 'string'
  )
}

export const MAX_ROOMS = 10
export const MAX_PICTURES = 10
export const MAX_PARKING_SPOTS = 10
export const MAX_DESCRIPTION_LENGTH = 500
export const CATEGORIES = ['rent', 'sublet']
