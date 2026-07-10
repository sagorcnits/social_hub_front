// Central HTTP client. Injects the bearer token on protected calls and, on a
// `401`, transparently refreshes the access token once and retries the request.

import { API_BASE } from '~/config'
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from './tokens'

/** Standard response envelope from the backend. */
export type Envelope<T> = {
  success: boolean
  message: string
  meta?: { page: number; limit: number; total: number }
  data: T
}

export type ApiOptions = Omit<RequestInit, 'body'> & {
  /** Attach `Authorization: Bearer <token>`. */
  auth?: boolean
  /** JSON body (serialized) or a FormData (sent raw — browser sets boundary). */
  body?: unknown
}

/** Thrown for any non-2xx response; carries the HTTP status + server message. */
export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// Single in-flight refresh shared by concurrent 401s, so we only mint one token.
let refreshing: Promise<boolean> | null = null

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false

  refreshing ??= (async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })
      if (!res.ok) return false
      const body = (await res.json().catch(() => null)) as Envelope<{
        accessToken: string
      }> | null
      const next = body?.data.accessToken
      if (!next) return false
      setAccessToken(next)
      return true
    } catch {
      return false
    } finally {
      refreshing = null
    }
  })()

  return refreshing
}

function buildRequest(opts: ApiOptions): RequestInit {
  const headers = new Headers(opts.headers)
  const isForm = opts.body instanceof FormData

  // Never set Content-Type for FormData — the browser adds the multipart boundary.
  if (!isForm && opts.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (opts.auth) {
    const token = getAccessToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  const body =
    opts.body === undefined
      ? undefined
      : isForm
        ? (opts.body as FormData)
        : JSON.stringify(opts.body)

  return { ...opts, headers, body }
}

/**
 * Perform a request and return the full envelope. On a `401` for an
 * authenticated call, refresh the token once and retry before giving up.
 */
export async function api<T = unknown>(
  path: string,
  opts: ApiOptions = {},
): Promise<Envelope<T>> {
  const send = () => fetch(API_BASE + path, buildRequest(opts))

  let res = await send()
  if (res.status === 401 && opts.auth) {
    const ok = await refreshAccessToken()
    if (ok) {
      res = await send()
    } else {
      clearTokens()
    }
  }

  const body = (await res.json().catch(() => null)) as Envelope<T> | null
  if (!res.ok || !body?.success) {
    throw new ApiError(res.status, body?.message || `HTTP ${res.status}`)
  }
  return body
}
