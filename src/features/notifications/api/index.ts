import { PAGE_SIZE, USE_MOCKS } from '~/config'
import { api } from '~/services/api/client'
import { db, mockOk } from '~/services/mock'
import type { Notification } from '../types'

export async function fetchNotifications(page = 1, limit = PAGE_SIZE) {
  if (USE_MOCKS) {
    return mockOk(db.notifications, {
      page,
      limit,
      total: db.notifications.length,
    })
  }
  return api<Array<Notification>>(
    `/notifications?page=${page}&limit=${limit}`,
    { auth: true },
  )
}

export async function fetchUnreadCount() {
  if (USE_MOCKS) {
    const unread = db.notifications.filter((n) => !n.isRead).length
    return mockOk({ unread })
  }
  return api<{ unread: number }>('/notifications/unread-count', { auth: true })
}

export async function markRead(id: string) {
  if (USE_MOCKS) {
    const n = db.notifications.find((x) => x.id === id)
    if (n) n.isRead = true
    return mockOk({ id })
  }
  return api<{ id: string }>(`/notifications/${id}/read`, {
    method: 'PATCH',
    auth: true,
  })
}

export async function markAllRead() {
  if (USE_MOCKS) {
    db.notifications.forEach((n) => (n.isRead = true))
    return mockOk({ ok: true })
  }
  return api<{ ok: boolean }>('/notifications/read-all', {
    method: 'PATCH',
    auth: true,
  })
}
