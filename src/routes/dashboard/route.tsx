import { createFileRoute, Outlet } from '@tanstack/solid-router'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1>Navbar</h1>
      <Outlet />
      <h1>Footer</h1>
    </div>
  )
}
