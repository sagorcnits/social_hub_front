// Token storage — the single source of truth for the JWT pair.
// SSR-safe: every localStorage touch is guarded (no `window` on the server).

import { TOKEN_KEYS } from '~/config'

const isBrowser = typeof window !== 'undefined'

export type Tokens = { accessToken: string; refreshToken: string }

type Listener = (accessToken: string | null) => void
const listeners = new Set<Listener>()

/** Subscribe to access-token changes (e.g. the socket rebinds on refresh). */
export function onTokenChange(fn: Listener): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function emit(accessToken: string | null) {
  for (const fn of listeners) fn(accessToken)
}

export function getAccessToken(): string | null {
  if (!isBrowser) return null
  return localStorage.getItem(TOKEN_KEYS.access)
}

export function getRefreshToken(): string | null {
  if (!isBrowser) return null
  return localStorage.getItem(TOKEN_KEYS.refresh)
}

export function setTokens(t: Tokens) {
  if (isBrowser) {
    localStorage.setItem(TOKEN_KEYS.access, t.accessToken)
    localStorage.setItem(TOKEN_KEYS.refresh, t.refreshToken)
  }
  emit(t.accessToken)
}

/** Replace only the access token (after a refresh); keep the refresh token. */
export function setAccessToken(accessToken: string) {
  if (isBrowser) localStorage.setItem(TOKEN_KEYS.access, accessToken)
  emit(accessToken)
}

export function clearTokens() {
  if (isBrowser) {
    localStorage.removeItem(TOKEN_KEYS.access)
    localStorage.removeItem(TOKEN_KEYS.refresh)
  }
  emit(null)
}
