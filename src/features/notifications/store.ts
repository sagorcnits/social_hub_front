// Notifications store — singleton so the topbar bell, the history page, and
// (later) the live WebSocket all share one list + unread count.

import { createSignal } from 'solid-js'
import {
  fetchNotifications,
  fetchUnreadCount,
  markAllRead,
  markRead,
} from './api'
import type { Notification } from './types'

const [items, setItems] = createSignal<Array<Notification>>([])
const [unread, setUnread] = createSignal(0)
const [loaded, setLoaded] = createSignal(false)

export const notifications = items
export const unreadCount = unread

/** Seed from REST once per session. */
export async function loadNotifications(force = false): Promise<void> {
  if (loaded() && !force) return
  const [list, count] = await Promise.all([
    fetchNotifications(),
    fetchUnreadCount(),
  ])
  setItems(list.data)
  setUnread(count.data.unread)
  setLoaded(true)
}

/** Prepend a live notification (WebSocket `notification` event). */
export function pushNotification(n: Notification): void {
  setItems([n, ...items()])
  if (!n.isRead) setUnread(unread() + 1)
}

export async function markOneRead(id: string): Promise<void> {
  const target = items().find((n) => n.id === id)
  if (!target || target.isRead) return
  setItems(items().map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  setUnread(Math.max(0, unread() - 1))
  try {
    await markRead(id)
  } catch {
    // best-effort; leave optimistic state
  }
}

export async function markEveryRead(): Promise<void> {
  setItems(items().map((n) => ({ ...n, isRead: true })))
  setUnread(0)
  try {
    await markAllRead()
  } catch {
    // best-effort
  }
}
