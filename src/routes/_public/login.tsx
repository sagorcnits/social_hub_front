import { createFileRoute, redirect } from '@tanstack/solid-router'
import { hasToken } from '~/features/auth/store'
import LoginPage from '~/features/auth/pages/LoginPage'

export const Route = createFileRoute('/_public/login')({
  beforeLoad: () => {
    // Already signed in → straight to the app.
    if (typeof window !== 'undefined' && hasToken()) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: LoginPage,
})
