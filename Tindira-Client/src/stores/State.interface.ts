import type { Listing } from "@/interfaces/listing.interface"

export interface State {
  isLoading: boolean
  nextListingsArr: Listing[]
  SelectedFilters: SelectedFilters

}

export interface SelectedFilters {
  category: "sublet" | "rent" | "animel sublet" | "switch" | "buy";
  dates: Date | null;
  isWholeDateRangeOnly: boolean;
  maxPrice: number | null;
  minNumberOfParkings: number;
  minNumberOfRooms: number;
  isAnimalFriendly: boolean;
  city: string | null;
  location: Location | null;
  radiusInKm: number | null;
  isWithPorchOrGarden:boolean;

}

export interface Location {
  description: string;
  matched_substrings: { length: number; offset: number } [];
  place_id: string;
  reference: string;
  structured_formatting: {
    main_text: string;
    main_text_matched_substrings: { length: number; offset: number } [];
    secondary_text: string;
  };
  terms: { offset: number; value: string } [];
  types: string[];
};
