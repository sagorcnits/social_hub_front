import { createFileRoute, Outlet } from '@tanstack/solid-router'

import Header from '../../components/shared/Header'

export const Route = createFileRoute('/_public')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
