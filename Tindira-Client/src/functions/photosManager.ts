import type { Ref } from 'vue'

export type Photo = {
  file?: File
  url: string
}

export class PhotosManager {
  private photosRef: Ref<Photo[]>

  constructor(photosRef: Ref<Photo[]>, initialUrls: string[] = []) {
    this.photosRef = photosRef
    this.resetPhotos(initialUrls)
  }

  resetPhotos(urls: string[] = []): void {
    this.photosRef.value = urls.map((url) => ({ url }))
  }

  addPhotosUrls(urls: string[]): void {
    urls.forEach((url) => {
      this.photosRef.value.push({ url })
    })
  }

  addPhotoFile(file: File): string {
    const url = URL.createObjectURL(file)
    this.photosRef.value.push({ file, url })
    return url
  }

  removePhoto(url: string): void {
    this.photosRef.value = this.photosRef.value.filter((photo) => photo.url !== url)
  }

  removePhotos(urls: string[]): void {
    this.photosRef.value = this.photosRef.value.filter((photo) => !urls.includes(photo.url))
  }

  getOldPhotosUrls(): string[] {
    return this.photosRef.value.filter((photo) => !photo.file).map((photo) => photo.url)
  }

  getAllPhotosUrls(): string[] {
    return this.photosRef.value.map((photo) => photo.url)
  }

  getFiles(): File[] {
    return this.photosRef.value.filter((photo) => photo.file).map((photo) => photo.file!)
  }
}
