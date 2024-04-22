import type { Listing } from "@/interfaces/listing.interface"

export interface State {
  isLoading: boolean
  nextListingsArr: Listing[]
  SelectedFilters: SelectedFilters
  
}

export interface SelectedFilters {
  category: "sublet" | "rent" | "animel sublet" | "switch" | "buy";
  dates: Date | null;
  price: number | null;
  parkings: number;
  numberOfRooms: number;
  isAnimalFriendly: boolean;
  selectedCategory: string;
  selectedCity: string | null;
}
