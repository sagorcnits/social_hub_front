import { Show, createMemo } from 'solid-js'

type AvatarProps = {
  name: string
  src?: string | null
  size?: number
  class?: string
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** Round avatar. Renders the image when present, else initials on a lagoon tint. */
export default function Avatar(props: AvatarProps) {
  const size = () => props.size ?? 40
  const label = createMemo(() => initials(props.name))

  return (
    <span
      class={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ${props.class ?? ''}`}
      style={{
        width: `${size()}px`,
        height: `${size()}px`,
        background: 'color-mix(in oklab, var(--lagoon) 26%, var(--surface-strong))',
        color: 'var(--sea-ink)',
        'font-weight': 700,
        'font-size': `${Math.max(11, size() * 0.4)}px`,
        border: '1px solid var(--line)',
      }}
      aria-hidden={!!props.src}
    >
      <Show when={props.src} fallback={label()}>
        <img
          src={props.src!}
          alt={props.name}
          class="h-full w-full object-cover"
        />
      </Show>
    </span>
  )
}
