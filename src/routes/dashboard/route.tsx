import { createFileRoute, redirect } from '@tanstack/solid-router'
import { hasToken } from '~/features/auth/store'
import DashboardShell from '~/features/dashboard/components/DashboardShell'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => {
    // No token → bounce to login.
    if (typeof window !== 'undefined' && !hasToken()) {
      throw redirect({ to: '/login' })
    }
  },
  component: DashboardShell,
})
