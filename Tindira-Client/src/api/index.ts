import type { SelectedFilters } from '@/stores/State.interface'
import axios, { AxiosError, type AxiosInstance, type AxiosResponse } from 'axios'
import type { SavedGeoCodeGoogleLocation } from '@/interfaces/geolocation.interface'

type OptionalField =
  | 'history'
  | 'fullName'
  | 'listings'
  | 'phoneNumber'
  | 'profileDescription'
  | 'profilePicture'
  | 'reviews'
  | 'roles'

export type ListingPayload = {
  category: string
  contractStartingDate: string
  contractEndDate: string
  postExpireDate: string
  postUploadDate: string
  description: string
  isAnimalFriendly: boolean
  ownerId: string
  price: number
  title: string
  isWithGardenOrPorch: boolean
  parkingSpaces: number
  numberOfRooms: number
  isPricePerWholeTime: boolean
  images?: string[]
  coordinates: SavedGeoCodeGoogleLocation
}

////////////////////////////////////////////////
//                API SECTION
////////////////////////////////////////////////
class _API {
  service: AxiosInstance = axios
  constructor() {
    const service = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_X_API_KEY
      }
    })
    this.service = service
  }

  handleSuccess(response: AxiosResponse) {
    return response
  }

  handleError = (error: AxiosError) => {
    console.log(error?.response?.status + 'error, the response message: ' + error.response)
    return Promise.reject(error)
  }

  redirectTo = (document: { location: any }, path: any) => {
    document.location = path
  }

  async checkHealth() {
    const response = await this.service.get('/health')
    return response
  }

  async getNextListings(
    amount: number,
    filters: SelectedFilters,
    username: string,
    ignoreIds: string[]
  ) {
    const ignoreListings = ignoreIds.length > 0 ? ignoreIds.join(',') : ''
    const response = await this.service.post(
      `/listings/getNext?username=${username}&amount=${amount.toString()}&ignoreListings=${ignoreListings}`,
      {
        filters: filters
      }
    )
    console.log(response)
    return response.data
  }

  async tagListing(listingId: string, username: string, isLike: boolean) {
    const response = await this.service.put(
      `/listings/tag?username=${username}&listingId=${listingId}&isLike=${isLike.toString()}`
    )
    console.log(response)
    return response.data
  }

  async getListingLikedBy(listingId: string, page: number = 1, items: number = 10) {
    const response = await this.service.get(
      `/user/getListingLikedBy?listingId=${listingId}&page=${page.toString()}&items=${items.toString()}`
    )
    console.log(response)
    return response.data
  }
  async getCategoryHistory(
    category: string,
    username: string,
    showLikes: boolean,
    page: number = 1,
    items: number = 10
  ) {
    const response = await this.service.get(
      `/user/getHistory?username=${username}&category=${category}&showLikes=${showLikes.toString()}&page=${page.toString()}&items=${items.toString()}`
    )
    console.log('history:', response)
    return response.data
  }

  async getUsersByUserName(usernames: string[], optionalFields: OptionalField[] = []) {
    const usernamesString = usernames.join(',')
    const optionalFieldsString = optionalFields.join(',')
    const response = await this.service.get(
      `/user?username=${usernamesString}&fields=${optionalFieldsString}`
    )
    console.log(response)
    return response.data
  }
  async getListingsById(ids: string[]) {
    const idsString = ids.join(',')
    const response = await this.service.get(`listings?id=${idsString}`)
    console.log(response)
    return response.data
  }

  async registerUser(
    username: string,
    email: string,
    fullName: string,
    password: string,
    phoneNumber: string,
    roles: string[],
    profilePicture: string,
    profileDescription: string
  ) {
    const response = await this.service.post('/register', {
      username: username,
      email: email,
      fullName: fullName,
      password: password,
      phoneNumber: phoneNumber,
      roles: roles,
      profilePicture: profilePicture,
      profileDescription: profileDescription
    })
    return response
  }

  async loginUser(username: string, password: string) {
    const response = await this.service.post('/login', {
      username: username,
      password: password
    })
    return response
  }

  async postListing(payload: ListingPayload) {
    const response = await this.service.post('/listing', payload)
    return response
  }

  async updateListing(listingId: string, payload: Partial<ListingPayload>) {
    const response = await this.service.put('/listing/', {
      listingId: listingId,
      ...payload
    })
    return response
  }

  async deleteListing(listingId: string) {
    const response = await this.service.delete(`/listing/${listingId}`)
    return response
  }
}

const API = new _API()

export default API
