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
    coordinates:SavedGeoCodeGoogleLocation;
    parkingSpaces: number;
    ownerId: string;
    contractStartDate: string;
    isWithGardenOrPorch:boolean;
    isAnimalFriendly: boolean;
    isPricePerWholeTime:boolean;
    pricePerMonth:number;
    pricePerWholeTime:number;
    isActive: boolean;
    category: string;
    images: string[];
    description: string;
    title: string;
    postUploadDate: string;
  }