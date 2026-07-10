// App-wide static config / constants.

/** Base REST URL for the Social-Hub backend. */
export const API_BASE = 'http://localhost:5000/api'

/** Base WebSocket URL (token appended as `?token=`). */
export const WS_BASE = 'ws://localhost:5000/ws'

/** localStorage keys for the token pair. */
export const TOKEN_KEYS = {
  access: 'accessToken',
  refresh: 'refreshToken',
} as const

/** Default page size for paginated list endpoints. */
export const PAGE_SIZE = 20

/**
 * Serve seeded fake data instead of hitting the backend. Keep `true` while the
 * API server is offline; flip to `false` to run against `API_BASE` for real.
 */
export const USE_MOCKS = false as boolean
