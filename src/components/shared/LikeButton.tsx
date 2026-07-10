import { createSignal } from 'solid-js'
import { ThumbsUp } from 'lucide-solid'
import { cn } from '~/lib/utils'
import type { ToggleLikeResult } from '~/features/posts/types'

type LikeButtonProps = {
  liked: boolean
  count: number
  onToggle: () => Promise<ToggleLikeResult>
  /** Compact variant for comment rows. */
  compact?: boolean
}

/** Optimistic like toggle. Reconciles with the server's authoritative count. */
export default function LikeButton(props: LikeButtonProps) {
  const [liked, setLiked] = createSignal(props.liked)
  const [count, setCount] = createSignal(props.count)
  const [busy, setBusy] = createSignal(false)

  async function toggle() {
    if (busy()) return
    const prev = { liked: liked(), count: count() }
    // Optimistic flip.
    setLiked(!prev.liked)
    setCount(prev.count + (prev.liked ? -1 : 1))
    setBusy(true)
    try {
      const res = await props.onToggle()
      setLiked(res.liked)
      setCount(res.likesCount)
    } catch {
      setLiked(prev.liked)
      setCount(prev.count)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={liked()}
      class={cn(
        'inline-flex items-center gap-1.5 rounded-lg font-semibold transition-colors',
        props.compact ? 'px-1.5 py-1 text-xs' : 'px-3 py-2 text-sm',
      )}
      style={{
        color: liked() ? 'var(--lagoon-deep)' : 'var(--sea-ink-soft)',
        background: liked()
          ? 'color-mix(in oklab, var(--lagoon) 14%, transparent)'
          : 'transparent',
      }}
    >
      <ThumbsUp
        size={props.compact ? 14 : 18}
        fill={liked() ? 'currentColor' : 'none'}
      />
      <span>{count()}</span>
    </button>
  )
}
