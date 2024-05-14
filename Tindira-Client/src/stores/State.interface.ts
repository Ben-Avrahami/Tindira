import type { Listing } from "@/interfaces/listing.interface"

export interface State {
  isLoading: boolean
  nextListingsArr: Listing[]
  SelectedFilters: SelectedFilters
  categoryOptions: SelectedFilters["category"][]

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
  location: GeoCodeGoogleLocation | null;
  radiusInKm: number | null;
  isWithPorchOrGarden: boolean;

}

export interface Location {
  description: string;
  matched_substrings: { length: number; offset: number }[];
  place_id: string;
  reference: string;
  structured_formatting: {
    main_text: string;
    main_text_matched_substrings: { length: number; offset: number }[];
    secondary_text: string;
  };
  terms: { offset: number; value: string }[];
  types: string[];
};

type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type Geometry = {
  location: {
    lat: number;
    lng: number;
  };
  location_type: string;
  viewport: {
    south: number;
    west: number;
    north: number;
    east: number;
  };
};

type PlusCode = {
  compound_code: string;
  global_code: string;
};

export type GeoCodeGoogleLocation = {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  plus_code: PlusCode;
  types: string[];
};

type AddressArray = GeoCodeGoogleLocation[];
