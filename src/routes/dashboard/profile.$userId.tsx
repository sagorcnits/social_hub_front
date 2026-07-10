import { createFileRoute } from '@tanstack/solid-router'
import ProfilePage from '~/features/profile/pages/ProfilePage'

export const Route = createFileRoute('/dashboard/profile/$userId')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()
  return <ProfilePage userId={params().userId} />
}
