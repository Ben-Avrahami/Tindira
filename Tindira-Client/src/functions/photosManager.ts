import type { Ref } from 'vue'
import { uploadImageToS3 } from '@/functions/user'
import { DEFAULT_AVATAR } from '@/functions/user'
import { deleteImagesFromS3 } from '@/functions/aws'
import { arraysEqual } from '@/functions/util'
import { uploadPhotosToS3 } from './listing'

export type Photo = {
  file?: File
  url: string
}

export class PhotosManager {
  private photosRef: Ref<Photo[]>
  private rollbackUrls: string[] = []
  private filesToUpload: File[] = []

  constructor(photosRef: Ref<Photo[]>, urls: string[] = []) {
    this.photosRef = photosRef
    this.photosRef.value = urls.map((url) => ({ url }))
    this.rollbackUrls = this.photosRef.value.map((photo) => photo.url)
  }

  /**
   * @returns an error string if occurred
   */
  async reset(urls: string[] = []): Promise<string> {
    if (arraysEqual(this.rollbackUrls, urls) && arraysEqual(this.get(), urls)) {
      return ''
    }

    // Reset photosRef with new URLs
    this.photosRef.value = urls.map((url) => ({ url }))

    // Delete old photos from S3 if necessary
    const urlsToDelete = this.rollbackUrls.filter((url) => !urls.includes(url))
    const errors = await deleteImagesFromS3(urlsToDelete)
    if (errors.length) {
      console.error('Failed to delete old photos:', errors)
      return 'An unexpected error occurred'
    }

    return ''
  }

  async add(file: File): Promise<void> {
    const tempUrl = URL.createObjectURL(file)
    this.photosRef.value.push({ file, url: tempUrl })
    this.filesToUpload.push(file)
  }

  private rollback(): void {
    this.photosRef.value = this.rollbackUrls.map((url) => ({ url }))
    this.filesToUpload = []
  }

  remove(urls: string[]): void {
    this.photosRef.value = this.photosRef.value.filter((photo) => !urls.includes(photo.url))
    this.filesToUpload = this.filesToUpload.filter(
      (file) => !this.photosRef.value.some((photo) => photo.file === file)
    )
  }

  // getOldPhotosUrls(): string[] {
  //   // Return URLs of photos not recently added
  // }

  get(): string[] {
    return this.photosRef.value.map((photo) => photo.url)
  }

  // getFiles(): File[] {
  //   // Return all File objects from photos
  // }

  async save(listingId: string) {
    if (!this.filesToUpload.length) {
      return { errors: [], urls: [] }
    }

    try {
      const response = await uploadPhotosToS3(this.filesToUpload, listingId)
      if (!response.urls.length) {
        this.rollback()
        console.error('Failed to upload photos:', response.errors)
        return { errors: response.errors, urls: [] }
      }
      if (response.errors.length) {
        console.error('Failed to upload some photos:', response.errors)
      }
      this.photosRef.value = response.urls.map((url) => ({ url }))
      console.log('images uploaded successfully!', response.urls)
      const errors = await this.deletePreviousImages()
      return { errors, urls: response.urls }
    } catch (error) {
      this.rollback()
      console.error('Failed to upload photos:', error)
      return { errors: [error], urls: [] }
    }
  }

  private async deletePreviousImages(): Promise<string[]> {
    if (!this.rollbackUrls.length) {
      return []
    }

    return await deleteImagesFromS3(this.rollbackUrls)
  }
}

export class ProfilePictureManager {
  private photoRef: Ref<Photo>
  private fileToUpload: File | null = null // set on "replace", used on "save"
  private rollbackUrl: string = DEFAULT_AVATAR // set on c'tor, used on "reset"

  constructor(photoRef: Ref<Photo>) {
    this.photoRef = photoRef
    if (!this.photoRef.value.url) {
      this.photoRef.value = { url: DEFAULT_AVATAR }
    }
    this.rollbackUrl = this.photoRef.value.url
  }

  /**
   * @returns an error string if occurred
   */
  async reset(url: string = DEFAULT_AVATAR): Promise<string> {
    if (url === this.rollbackUrl && this.rollbackUrl === this.photoRef.value.url) {
      return ''
    }

    // set the new photo URL
    this.photoRef.value = { url }

    // delete the old photo from S3
    if (this.rollbackUrl !== DEFAULT_AVATAR) {
      const errors = await deleteImagesFromS3([this.rollbackUrl])
      if (errors.length) {
        console.error('Failed to delete old photo:', errors[0])
        return 'An unexpected error occurred'
      }
    }

    return ''
  }

  replace(file: File): void {
    const tempUrl = URL.createObjectURL(file)
    this.photoRef.value = { file, url: tempUrl }
    this.fileToUpload = file
  }

  private rollback() {
    this.photoRef.value = { url: this.rollbackUrl }
    this.fileToUpload = null
  }

  isEmpty(): boolean {
    return this.photoRef.value.url === DEFAULT_AVATAR
  }

  get(): string {
    return this.photoRef.value.url
  }

  /**
   * @returns an error string if occurred
   */
  async save(username: string) {
    if (!this.fileToUpload) {
      return { error: '', url: this.photoRef.value.url }
    }

    try {
      const response = await uploadImageToS3(this.fileToUpload, username)
      if (!response.url) {
        this.rollback()
        return { error: response.error || 'An unexpected error occurred' }
      } else {
        this.photoRef.value = { url: response.url }
        console.log('image uploaded successfully!', response.url)
        const error = await this.deletePreviousImage()
        return { error, url: response.url }
      }
    } catch (error) {
      this.rollback()
      console.error('Failed to upload photo:', error)
      return { error: 'An unexpected error occurred' }
    }
  }

  // To be used in the "save" method
  private async deletePreviousImage(): Promise<string> {
    if (this.rollbackUrl === DEFAULT_AVATAR) {
      return ''
    }

    const errors = await deleteImagesFromS3([this.rollbackUrl])
    if (errors.length) {
      console.error('Failed to delete old photo:', errors[0])
    } else {
      this.rollbackUrl = this.photoRef.value.url
    }

    return errors[0] || ''
  }
}
