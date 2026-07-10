import { For, Show, createSignal } from 'solid-js'
import { Link } from '@tanstack/solid-router'
import { Trash2 } from 'lucide-solid'
import Avatar from '~/components/shared/Avatar'
import LikeButton from '~/components/shared/LikeButton'
import { timeAgo } from '~/lib/time'
import { currentUser } from '~/features/auth/store'
import { toggleCommentLike } from '../api'
import type { Comment } from '../types'
import { useThread } from './thread-context'
import ReplyBox from './ReplyBox'

/** One comment plus its nested replies. Recurses to unlimited depth. */
export default function CommentNode(props: { comment: Comment; depth?: number }) {
  const thread = useThread()
  const c = () => props.comment
  const depth = () => props.depth ?? 0
  const isOwn = () => currentUser()?.id === c().userId

  const [replying, setReplying] = createSignal(false)
  const [busy, setBusy] = createSignal(false)

  async function submitReply(content: string) {
    await thread.reply(c().id, content)
    setReplying(false)
  }

  async function onDelete() {
    setBusy(true)
    try {
      await thread.remove(c().id)
    } catch {
      setBusy(false)
    }
  }

  return (
    <div
      class="mt-3"
      style={
        depth() > 0
          ? {
              'margin-left': '1.25rem',
              'padding-left': '0.75rem',
              'border-left': '2px solid var(--line)',
            }
          : undefined
      }
    >
      <div class="flex items-start gap-2">
        <Link to="/dashboard/profile/$userId" params={{ userId: c().userId }}>
          <Avatar
            name={c().user.profile.firstName}
            src={c().user.profile.avatar}
            size={32}
          />
        </Link>
        <div class="min-w-0 flex-1">
          <div
            class="inline-block rounded-2xl px-3 py-2"
            style={{
              background: 'color-mix(in oklab, var(--chip-bg) 82%, transparent)',
              border: '1px solid var(--line)',
            }}
          >
            <Link
              to="/dashboard/profile/$userId"
              params={{ userId: c().userId }}
              class="text-sm font-semibold no-underline"
              style={{ color: 'var(--sea-ink)' }}
            >
              {c().user.profile.firstName}
            </Link>
            <p class="whitespace-pre-wrap text-sm leading-snug">{c().content}</p>
          </div>

          <div class="mt-1 flex items-center gap-3 pl-1 text-xs font-semibold">
            <LikeButton
              compact
              liked={c().liked}
              count={c().likesCount}
              onToggle={async () =>
                (await toggleCommentLike(thread.postId, c().id)).data
              }
            />
            <button
              type="button"
              onClick={() => setReplying(!replying())}
              style={{ color: 'var(--sea-ink-soft)' }}
            >
              Reply
            </button>
            <span class="demo-muted font-normal">{timeAgo(c().createdAt)}</span>
            <Show when={isOwn()}>
              <button
                type="button"
                onClick={onDelete}
                disabled={busy()}
                title="Delete"
                class="inline-flex items-center"
                style={{ color: '#9f3030' }}
              >
                <Trash2 size={13} />
              </button>
            </Show>
          </div>

          <Show when={replying()}>
            <div class="mt-2">
              <ReplyBox
                autofocus
                placeholder={`Reply to ${c().user.profile.firstName}…`}
                onSubmit={submitReply}
              />
            </div>
          </Show>
        </div>
      </div>

      <Show when={c().replies && c().replies!.length > 0}>
        <For each={c().replies}>
          {(child) => <CommentNode comment={child} depth={depth() + 1} />}
        </For>
      </Show>
    </div>
  )
}
