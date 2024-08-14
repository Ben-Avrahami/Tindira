import axios, { type AxiosInstance } from 'axios'
import { isListingInterface, type Listing } from '@/interfaces/listing.interface'
import type { SelectedFilters } from '@/stores/State.interface'
import { type SavedUser, savedUserFields } from '@/interfaces/user.interface'

type OptionalField = keyof SavedUser | 'history' | 'listings' | 'reviews'

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

  async checkHealth() {
    return await this.service.get('/health')
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
    return response.data
  }

  async tagListing(listingId: string, username: string, isLike: boolean) {
    const response = await this.service.put(
      `/listings/tag?username=${username}&listingId=${listingId}&isLike=${isLike.toString()}`
    )
    return response.data
  }

  async getListingLikedBy(listingId: string, page: number = 1, items: number = 10) {
    const response = await this.service.get(
      `/user/getListingLikedBy?listingId=${listingId}&page=${page.toString()}&items=${items.toString()}`
    )
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
    return response.data
  }

  async getUsersByUserName(usernames: string[], optionalFields: OptionalField[] = []) {
    const usernamesString = usernames.join(',')
    const optionalFieldsString = optionalFields.join(',')
    const response = await this.service.get(
      `/user?username=${usernamesString}&fields=${optionalFieldsString}`
    )
    return response.data
  }

  async getUser(username: string) {
    const users = await this.getUsersByUserName([username], savedUserFields)
    return users[0]
  }

  async updateUser(username: string, payload: Partial<SavedUser>) {
    return await this.service.put(`/user?username=${username}`, payload)
  }

  async deleteUser(username: string) {
    return await this.service.delete(`/user?username=${username}`)
    // TODO: delete user bucket from S3
  }

  async getListingsById(ids: string[]): Promise<Listing[]> {
    if (ids.length === 0) return []
    const idsString = ids.join(',')
    const response = await this.service.get(`listings?id=${idsString}`)
    const listings = response.data.filter(isListingInterface)
    return listings
  }

  async isUsernameTaken(username: string) {
    const response = await this.service.get(`/user/check?username=${username}`)
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
    return await this.service.post('/register', {
      username: username,
      email: email,
      fullName: fullName,
      password: password,
      phoneNumber: phoneNumber,
      roles: roles,
      profilePicture: profilePicture,
      profileDescription: profileDescription
    })
  }

  async loginUser(username: string, password: string) {
    return await this.service.post('/login', {
      username: username,
      password: password
    })
  }

  async postListing(payload: Listing, username: string) {
    return await this.service.post(`/listings?username=${username}`, payload)
  }

  async updateListing(listingId: string, payload: Partial<Listing>) {
    return await this.service.put(`/listings?listingId=${listingId}`, payload)
  }

  async deleteListing(listingId: string, username: string) {
    return await this.service.delete(`/listings?listingId=${listingId}&username=${username}`)
    // TODO: delete listing bucket from S3
  }
}

const API = new _API()

export default API
