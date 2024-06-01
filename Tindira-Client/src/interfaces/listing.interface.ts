import type { SavedGeoCodeGoogleLocation } from "./geolocation.interface";


interface Address {
    city: string;
    number: string;
    street: string;
  }
  
  export interface Listing {
    likedBy: string[];
    listingId: string;
    postExpireDate: Date;
    contractEndDate: Date;
    numberOfRooms: number;
    address: Address;
    coordinates:SavedGeoCodeGoogleLocation;
    parking: number;
    ownerId: string;
    contractStartingDate: string;
    isAnimalFriendly: boolean;
    isActive: boolean;
    category: string;
    images: string[];
    contractLength: string;
    description: string;
    price: number;
    title: string;
    postUploadDate: string;
  }