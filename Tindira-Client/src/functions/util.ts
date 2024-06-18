import { MAX_PICTURES } from '@/interfaces/listing.interface'
import type { PhotosManager, ProfilePictureManager } from './photosManager'

export const DEFAULT_MAX_FILE_SIZE = 5

export function arraysEqual<T>(a: T[], b: T[]): boolean {
  return a.length === b.length && [...a].sort().every((val, index) => val === [...b].sort()[index])
}

/**
 * Replaces a photo in a profile picture manager.
 * @returns an error string if occurred
 */
export const handleFileUpload = async (
  event: Event,
  profilePictureManager: ProfilePictureManager,
  maxFileSizeMB: number = DEFAULT_MAX_FILE_SIZE
) => {
  const target = event.target

  if (!(target instanceof HTMLInputElement)) {
    console.error('Event target is not an HTMLInputElement.')
    return 'Corrupted codebase detected. Please report this issue to the developer.'
  }

  const error = tryToUploadFile(target, profilePictureManager, maxFileSizeMB)

  target.value = ''

  return error
}

const tryToUploadFile = async (
  target: HTMLInputElement,
  profilePictureManager: ProfilePictureManager,
  maxFileSizeMB: number = DEFAULT_MAX_FILE_SIZE
) => {
  const file = target.files?.[0]

  if (!file) return `No file selected.`

  const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024
  if (file.size > maxFileSizeBytes) {
    return `Please upload file smaller than ${maxFileSizeMB}MB.`
  }

  profilePictureManager.replace(file)

  return ''
}

/**
 * Replaces photos in a photos manager.
 * @returns an error string if occurred
 */
export const handleFilesUpload = async (
  event: Event,
  photosManager: PhotosManager,
  maxFileSizeMB: number = DEFAULT_MAX_FILE_SIZE,
  maxNumOfFiles: number = MAX_PICTURES
) => {
  const target = event.target

  if (!(target instanceof HTMLInputElement)) {
    console.error('Event target is not an HTMLInputElement.')
    return 'Corrupted codebase detected. Please report this issue to the developer.'
  }

  const error = tryToUploadFiles(target, photosManager, maxFileSizeMB, maxNumOfFiles)

  target.value = ''

  return error
}

const tryToUploadFiles = async (
  target: HTMLInputElement,
  photosManager: PhotosManager,
  maxFileSizeMB: number = DEFAULT_MAX_FILE_SIZE,
  maxNumOfFiles: number = MAX_PICTURES
) => {
  const files = target.files

  if (!files) return `No files selected.`

  if (files.length + photosManager.get().length > maxNumOfFiles) {
    return `Please upload a maximum of ${maxNumOfFiles} photos`
  }

  let error = ''

  Array.from(files).forEach(async (file) => {
    const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024
    if (file.size > maxFileSizeBytes) {
      error = `Please upload files smaller than ${maxFileSizeMB}MB.`
    } else {
      await photosManager.add(file)
    }
  })

  return error
}
