import type { SelectedFilters } from '@/stores/State.interface'
import axios, { AxiosError, type AxiosInstance, type AxiosResponse } from 'axios'

type OptionalField =
  | 'firstName'
  | 'history'
  | 'lastName'
  | 'listings'
  | 'phoneNumber'
  | 'profileDescription'
  | 'profilePicture'
  | 'reviews'
  | 'roles'

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
    const response = await this.service.get(
      `/listings/getNext?username=${username}&amount=${amount.toString()}&category=${
        filters.category
      }&listingId=0`
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
  async getCategoryHistory(
    category: string,
    username: string,
    showLikes: boolean,
    page: number = 1,
    items: number = 10
  ) {
    const response = await this.service.get(
      `/user/getHistory?username=galben&category=${category}&showLikes=${showLikes.toString()}&page=${page.toString()}&items=${items.toString()}`
    )
    console.log(response)
    return response.data
  }

  async getUsersByUserName(usernames: string[], optionalFields: OptionalField[] = []) {
    let usernamesString = usernames.join(',')
    let optionalFieldsString = optionalFields.join(',')
    const response = await this.service.get(`/user?username=${usernamesString}`)
    console.log(response)
    return response.data
  }
  async getListingsById(ids: string[]) {
    let idsString = ids.join(',')
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
}

const API = new _API()

export default API
