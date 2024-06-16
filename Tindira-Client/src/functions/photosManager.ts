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

  removePhoto(url: string): boolean {
    const index = this.photosRef.value.findIndex((photo) => photo.url === url)
    if (index !== -1) {
      this.photosRef.value.splice(index, 1)
      return true
    }
    return false
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
