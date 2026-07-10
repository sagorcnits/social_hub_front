import { createFileRoute, redirect } from '@tanstack/solid-router'
import { hasToken } from '~/features/auth/store'
import RegisterPage from '~/features/auth/pages/RegisterPage'

export const Route = createFileRoute('/_public/register')({
  beforeLoad: () => {
    if (typeof window !== 'undefined' && hasToken()) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: RegisterPage,
})
