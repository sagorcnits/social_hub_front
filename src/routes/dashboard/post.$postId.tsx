import { createFileRoute } from '@tanstack/solid-router'
import PostDetailPage from '~/features/posts/pages/PostDetailPage'

export const Route = createFileRoute('/dashboard/post/$postId')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()
  return <PostDetailPage postId={params().postId} />
}
