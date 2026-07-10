import { Show, createResource } from 'solid-js'
import { Link, useNavigate } from '@tanstack/solid-router'
import { ArrowLeft } from 'lucide-solid'
import CommentThread from '~/features/comments/components/CommentThread'
import { fetchPost } from '../api'
import PostCard from '../components/PostCard'

export default function PostDetailPage(props: { postId: string }) {
  const navigate = useNavigate()
  const [post] = createResource(() => props.postId, fetchPost)

  return (
    <div class="flex flex-col gap-4">
      <Link
        to="/dashboard"
        class="inline-flex items-center gap-1.5 text-sm font-semibold no-underline"
        style={{ color: 'var(--sea-ink-soft)' }}
      >
        <ArrowLeft size={16} /> Back to feed
      </Link>

      <Show when={post.error}>
        <div class="demo-alert demo-alert-danger text-sm">
          This post could not be found.
        </div>
      </Show>

      <Show when={post.loading}>
        <div class="demo-card demo-muted text-center text-sm">Loading…</div>
      </Show>

      <Show when={post()}>
        {(loaded) => (
          <>
            <PostCard
              post={loaded().data}
              onDeleted={() => navigate({ to: '/dashboard' })}
            />
            <CommentThread postId={props.postId} />
          </>
        )}
      </Show>
    </div>
  )
}
