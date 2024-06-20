import { uploadImagesToS3 } from '@/functions/aws'

export const MIN_USERNAME_LENGTH = 4
export const MAX_DESCRIPTION_LENGTH = 500
export const DEFAULT_AVATAR = 'https://tindira.s3.us-east-2.amazonaws.com/avatar-placeholder.png'

export const isPhoneValid = (phone: string): boolean => {
  return !!phone && phone.trim().length === 12
}

export const isNameValid = (name: string): boolean => {
  return !!name && name.trim().split(/\s+/).length === 2
}

export const isUsernameValid = (username: string): boolean => {
  return (
    !!username &&
    !username.includes(' ') &&
    !(username.trim().length < MIN_USERNAME_LENGTH) &&
    !(username.length > 20) &&
    !!/^[a-z0-9_]*$/.test(username)
  )
}

export const validateUsername = (username: string): string | undefined => {
  if (!username) {
    return 'Please enter a username'
  }
  if (username.includes(' ')) {
    return 'Username must not include spaces'
  }
  if (username.length < MIN_USERNAME_LENGTH) {
    return `Username must be at least ${MIN_USERNAME_LENGTH} characters`
  }
  if (username.length > 20) {
    return 'Username must be at most 20 characters'
  }
  if (!/^[a-z0-9_]*$/.test(username)) {
    return 'Username must only include small letters, numbers, and underscores'
  }
  return
}

export const isEmailValid = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return regex.test(email)
}

export const isPasswordStrong = (password: string): boolean => {
  // At least one lowercase, one uppercase, one digit, and minimum 8 characters
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&]{8,}$/
  // Note: The regex above does not exactly match PrimeVue's regex, which can cause buggy behavior
  return regex.test(password)
}

export const uploadProfilePicture = async (file: File, username: string) => {
  const path = `users/${username}`
  const { urls, errors } = await uploadImagesToS3([file], path)
  if (errors.length > 0) {
    return { url: DEFAULT_AVATAR, error: errors[0] }
  }

  return { url: urls[0] }
}
