export interface SavedUser {
  username: string
  email: string
  fullName: string
  phoneNumber: string
  profileDescription: string
  profilePicture: string
  roles: string[]
  listings: string[]
}

export const savedUserFields: (keyof SavedUser)[] = [
  'username',
  'email',
  'fullName',
  'phoneNumber',
  'profileDescription',
  'profilePicture',
  'roles',
  'listings'
]

export const isUserInerface = (user: any): user is SavedUser => {
  return (
    typeof user.username === 'string' &&
    typeof user.email === 'string' &&
    typeof user.fullName === 'string' &&
    typeof user.phoneNumber === 'string' &&
    typeof user.profileDescription === 'string' &&
    typeof user.profilePicture === 'string' &&
    Array.isArray(user.roles) &&
    Array.isArray(user.listings)
  )
}
