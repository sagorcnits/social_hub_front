// Auth store — a session-wide singleton built on Solid signals. Holds the
// current user and drives login/register/logout. Tokens live in the API layer
// (`services/api/tokens`); this store owns the reactive user + status.

import { createSignal } from 'solid-js'
import { USE_MOCKS } from '~/config'
import { clearTokens, getAccessToken, setTokens } from '~/services/api/tokens'
import { connectSocket, disconnectSocket } from '~/services/socket'
import { db } from '~/services/mock'
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

/**
 * Guard predicate for the dashboard: real auth needs a token, but in mock mode
 * (backend offline) the app is always accessible so the UI is demonstrable.
 */
export function canAccessApp(): boolean {
  return USE_MOCKS || hasToken()
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
  connectSocket()
  return res.data.user
}

export async function register(input: RegisterInput): Promise<User> {
  const res = await registerRequest(input)
  setTokens(res.data)
  setUser(res.data.user)
  setStatus('authenticated')
  connectSocket()
  return res.data.user
}

export function logout() {
  disconnectSocket()
  clearTokens()
  setUser(null)
  setStatus('anonymous')
}

/**
 * Patch the current user's profile locally (and, in mock mode, the seed db so
 * other views reflect it). No backend profile-update endpoint exists yet.
 */
export function updateProfile(patch: Partial<User['profile']>) {
  const u = user()
  if (!u) return
  const next = { ...u, profile: { ...u.profile, ...patch } }
  setUser(next)
  if (USE_MOCKS) {
    const seed = db.userById(u.id)
    if (seed) Object.assign(seed.profile, patch)
  }
}

/**
 * Rehydrate the session on first client load: if a token exists, fetch the
 * current user. Call once from the client (never during SSR).
 */
export async function initAuth(): Promise<void> {
  // Mock mode: seed the current user so the whole app renders without a backend.
  if (USE_MOCKS && !hasToken()) {
    setUser(db.userById(db.CURRENT_USER_ID)!)
    setStatus('authenticated')
    return
  }
  if (!hasToken()) {
    setStatus('anonymous')
    return
  }
  setStatus('loading')
  try {
    await establishSession()
    connectSocket()
  } catch {
    logout()
  }
}
