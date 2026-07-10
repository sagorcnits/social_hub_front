import { createFileRoute, redirect } from '@tanstack/solid-router'
import { canAccessApp } from '~/features/auth/store'
import DashboardShell from '~/features/dashboard/components/DashboardShell'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => {
    // No access (no token, and not in mock mode) → bounce to login.
    if (typeof window !== 'undefined' && !canAccessApp()) {
      throw redirect({ to: '/login' })
    }
  },
  component: DashboardShell,
})
