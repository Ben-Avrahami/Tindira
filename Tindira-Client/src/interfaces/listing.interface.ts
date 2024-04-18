interface Address {
    city: string;
    number: string;
    street: string;
  }
  
  interface Coordinates {
    x_coordinate: string;
    y_coordinate: string;
  }
  
  export interface Listing {
    likedBy: string[];
    listingId: string;
    postExpireDate: Date;
    contractEndDate: Date;
    numberOfRooms: number;
    address: Address;
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
    coordinates: Coordinates;
    title: string;
    postUploadDate: string;
  }