import type { Listing } from "@/interfaces/listing.interface"

export interface State {
  isLoading: boolean
  category: "sublet" | "rent" | "animel sublet" | "switch" | "buy"
  nextListingsArr: Listing[]
}
