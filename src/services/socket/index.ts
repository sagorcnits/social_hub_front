// Realtime notification socket. One connection per session; pushes live
// `notification` events into the notifications store. Reconnects on drop
// (exponential backoff) and rebinds when the access token is refreshed.

import { USE_MOCKS, WS_BASE } from '~/config'
import { getAccessToken, onTokenChange } from '~/services/api/tokens'
import { pushNotification } from '~/features/notifications/store'
import type { Notification } from '~/features/notifications/types'

let socket: WebSocket | null = null
let manualClose = false
let backoff = 1000
let tokenBound = false

function open(token: string) {
  // Drop any existing socket without triggering its reconnect handler.
  if (socket) {
    socket.onclose = null
    socket.close()
  }

  const ws = new WebSocket(`${WS_BASE}?token=${encodeURIComponent(token)}`)
  socket = ws

  ws.onopen = () => {
    backoff = 1000
  }

  ws.onmessage = (e) => {
    try {
      const { event, data } = JSON.parse(e.data)
      if (event === 'notification') pushNotification(data as Notification)
    } catch {
      // ignore malformed frames
    }
  }

  ws.onclose = () => {
    if (manualClose) return
    setTimeout(() => {
      const t = getAccessToken()
      if (!manualClose && t) open(t)
    }, backoff)
    backoff = Math.min(backoff * 2, 15_000)
  }
}

/** Open the notification socket for the current access token. */
export function connectSocket() {
  if (USE_MOCKS || typeof window === 'undefined') return
  const token = getAccessToken()
  if (!token) return
  manualClose = false
  open(token)

  // Rebind once on token refresh — the old token no longer authenticates the WS.
  if (!tokenBound) {
    tokenBound = true
    onTokenChange((next) => {
      if (next && !manualClose) open(next)
    })
  }
}

/** Close the socket and stop reconnecting (on logout). */
export function disconnectSocket() {
  manualClose = true
  if (socket) {
    socket.onclose = null
    socket.close()
    socket = null
  }
}
