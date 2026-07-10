import { createFileRoute } from '@tanstack/solid-router'
import SettingsPage from '~/features/settings/pages/SettingsPage'

export const Route = createFileRoute('/dashboard/settings')({
  component: SettingsPage,
})
