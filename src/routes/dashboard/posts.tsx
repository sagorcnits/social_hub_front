import { createFileRoute } from '@tanstack/solid-router'
import MyPostsPage from '~/features/posts/pages/MyPostsPage'

export const Route = createFileRoute('/dashboard/posts')({
  component: MyPostsPage,
})
