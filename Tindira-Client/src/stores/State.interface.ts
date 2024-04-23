import type { Listing } from "@/interfaces/listing.interface"

export interface State {
  isLoading: boolean
  nextListingsArr: Listing[]
  SelectedFilters: SelectedFilters
  
}

export interface SelectedFilters {
  category: "sublet" | "rent" | "animel sublet" | "switch" | "buy";
  dates: Date | null;
  isWholeDateRangeOnly:boolean;
  maxPrice: number | null;
  minNumberOfParkings: number;
  minNumberOfRooms: number;
  isAnimalFriendly: boolean;
  city: string | null;
}
