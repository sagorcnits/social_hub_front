import { Show } from 'solid-js'
import { useNavigate } from '@tanstack/solid-router'
import Avatar from '~/components/shared/Avatar'
import { timeAgo } from '~/lib/time'
import type { Notification, NotificationType } from '../types'

const VERB: Record<NotificationType, string> = {
  LIKE: 'liked your post',
  COMMENT: 'commented on your post',
  REPLY: 'replied to your comment',
  COMMENT_LIKE: 'liked your comment',
}

export default function NotifItem(props: {
  notification: Notification
  onRead: (id: string) => void
}) {
  const navigate = useNavigate()
  const n = () => props.notification

  function activate() {
    if (!n().isRead) props.onRead(n().id)
    if (n().postId) {
      navigate({ to: '/dashboard/post/$postId', params: { postId: n().postId! } })
    }
  }

  return (
    <button
      type="button"
      onClick={activate}
      class="flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-black/5"
      style={{
        background: n().isRead
          ? 'transparent'
          : 'color-mix(in oklab, var(--lagoon) 10%, transparent)',
      }}
    >
      <Avatar
        name={n().sender.profile.firstName}
        src={n().sender.profile.avatar}
        size={40}
      />
      <div class="min-w-0 flex-1">
        <p class="text-sm leading-snug">
          <span class="font-bold">{n().sender.profile.firstName}</span>{' '}
          {VERB[n().type]}
        </p>
        <p class="text-xs" style={{ color: 'var(--lagoon-deep)' }}>
          {timeAgo(n().createdAt)}
        </p>
      </div>
      <Show when={!n().isRead}>
        <span
          class="mt-2 h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ background: 'var(--lagoon)' }}
        />
      </Show>
    </button>
  )
}
