import { Show, createSignal } from 'solid-js'
import { Link } from '@tanstack/solid-router'
import { MessageCircle, Share2, Trash2 } from 'lucide-solid'
import Avatar from '~/components/shared/Avatar'
import LikeButton from '~/components/shared/LikeButton'
import { timeAgo } from '~/lib/time'
import { currentUser } from '~/features/auth/store'
import { deletePost, togglePostLike } from '../api'
import type { Post } from '../types'
import MediaGrid from './MediaGrid'

export default function PostCard(props: {
  post: Post
  onDeleted?: (id: string) => void
}) {
  const post = () => props.post
  const isOwn = () => currentUser()?.id === post().user.id
  const [deleting, setDeleting] = createSignal(false)

  async function onDelete() {
    setDeleting(true)
    try {
      await deletePost(post().id)
      props.onDeleted?.(post().id)
    } catch {
      setDeleting(false)
    }
  }

  return (
    <article class="demo-card rise-in">
      <header class="flex items-start gap-3">
        <Link to="/dashboard/profile/$userId" params={{ userId: post().user.id }}>
          <Avatar
            name={post().user.profile.firstName}
            src={post().user.profile.avatar}
            size={44}
          />
        </Link>
        <div class="min-w-0 flex-1">
          <Link
            to="/dashboard/profile/$userId"
            params={{ userId: post().user.id }}
            class="font-semibold no-underline"
            style={{ color: 'var(--sea-ink)' }}
          >
            {post().user.profile.firstName} {post().user.profile.lastName}
          </Link>
          <p class="demo-muted text-xs">
            @{post().user.profile.username} · {timeAgo(post().createdAt)}
          </p>
        </div>
        <Show when={isOwn()}>
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting()}
            title="Delete post"
            class="rounded-lg p-2 transition-colors hover:bg-black/5"
            style={{ color: '#9f3030' }}
          >
            <Trash2 size={16} />
          </button>
        </Show>
      </header>

      <Show when={post().content}>
        <p class="mt-3 whitespace-pre-wrap leading-relaxed">{post().content}</p>
      </Show>

      <MediaGrid media={post().media} />

      <div
        class="mt-3 flex items-center justify-between pb-1 text-xs"
        style={{ color: 'var(--sea-ink-soft)' }}
      >
        <span>
          {post().likesCount} {post().likesCount === 1 ? 'like' : 'likes'}
        </span>
        <Link
          to="/dashboard/post/$postId"
          params={{ postId: post().id }}
          class="no-underline"
          style={{ color: 'var(--sea-ink-soft)' }}
        >
          {post().commentsCount}{' '}
          {post().commentsCount === 1 ? 'comment' : 'comments'}
        </Link>
      </div>

      <div
        class="flex items-center justify-around pt-1"
        style={{ 'border-top': '1px solid var(--line)' }}
      >
        <LikeButton
          liked={post().liked}
          count={post().likesCount}
          onToggle={async () => (await togglePostLike(post().id)).data}
        />
        <Link
          to="/dashboard/post/$postId"
          params={{ postId: post().id }}
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold no-underline"
          style={{ color: 'var(--sea-ink-soft)' }}
        >
          <MessageCircle size={18} />
          Comment
        </Link>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold"
          style={{ color: 'var(--sea-ink-soft)' }}
        >
          <Share2 size={18} />
          Share
        </button>
      </div>
    </article>
  )
}
