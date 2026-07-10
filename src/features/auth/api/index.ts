// Auth feature API calls — thin wrappers over the shared HTTP client.

import { api } from '~/services/api/client'
import type {
  AuthPayload,
  LoginInput,
  RegisterInput,
  User,
} from '../types'

export function loginRequest(input: LoginInput) {
  return api<AuthPayload>('/auth/login', { method: 'POST', body: input })
}

export function registerRequest(input: RegisterInput) {
  return api<AuthPayload>('/auth/register', { method: 'POST', body: input })
}

export function fetchMe() {
  return api<User>('/auth/me', { auth: true })
}
