import { createFileRoute } from '@tanstack/solid-router'
import FeedPage from '~/features/posts/pages/FeedPage'

export const Route = createFileRoute('/dashboard/')({
  component: FeedPage,
})
