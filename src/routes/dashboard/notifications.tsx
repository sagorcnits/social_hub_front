import { createFileRoute } from '@tanstack/solid-router'
import NotificationsPage from '~/features/notifications/pages/NotificationsPage'

export const Route = createFileRoute('/dashboard/notifications')({
  component: NotificationsPage,
})
