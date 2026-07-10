// Auth domain types — mirror the backend `/auth/*` payloads.

export type Profile = {
  username: string
  firstName: string
  lastName?: string | null
  avatar?: string | null
  bio?: string | null
}

export type User = {
  id: string
  email: string
  role: 'USER' | 'ADMIN'
  profile: Profile
}

export type AuthPayload = {
  user: User
  accessToken: string
  refreshToken: string
}

export type LoginInput = {
  email: string
  password: string
}

export type RegisterInput = {
  email: string
  password: string
  firstName: string
  lastName?: string
  username: string
}
