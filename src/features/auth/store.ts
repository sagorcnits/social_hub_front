// Auth store — a session-wide singleton built on Solid signals. Holds the
// current user and drives login/register/logout. Tokens live in the API layer
// (`services/api/tokens`); this store owns the reactive user + status.

import { createSignal } from 'solid-js'
import { clearTokens, getAccessToken, setTokens } from '~/services/api/tokens'
import { fetchMe, loginRequest, registerRequest } from './api'
import type { LoginInput, RegisterInput, User } from './types'

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'anonymous'

const [user, setUser] = createSignal<User | null>(null)
const [status, setStatus] = createSignal<AuthStatus>('idle')

export const currentUser = user
export const authStatus = status

/** Truthy once we hold a token (synchronous — safe for route guards). */
export function hasToken(): boolean {
  return getAccessToken() !== null
}

export function isAuthenticated(): boolean {
  return user() !== null
}

async function establishSession(): Promise<User> {
  const res = await fetchMe()
  setUser(res.data)
  setStatus('authenticated')
  return res.data
}

export async function login(input: LoginInput): Promise<User> {
  const res = await loginRequest(input)
  setTokens(res.data)
  setUser(res.data.user)
  setStatus('authenticated')
  return res.data.user
}

export async function register(input: RegisterInput): Promise<User> {
  const res = await registerRequest(input)
  setTokens(res.data)
  setUser(res.data.user)
  setStatus('authenticated')
  return res.data.user
}

export function logout() {
  clearTokens()
  setUser(null)
  setStatus('anonymous')
}

/**
 * Rehydrate the session on first client load: if a token exists, fetch the
 * current user. Call once from the client (never during SSR).
 */
export async function initAuth(): Promise<void> {
  if (!hasToken()) {
    setStatus('anonymous')
    return
  }
  setStatus('loading')
  try {
    await establishSession()
  } catch {
    logout()
  }
}
