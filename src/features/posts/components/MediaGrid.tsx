import { For, Show } from 'solid-js'
import type { Media } from '../types'

/** Facebook-style media collage: adapts layout to 1–4+ items. */
export default function MediaGrid(props: { media: Array<Media> }) {
  const items = () => props.media
  const count = () => items().length
  const shown = () => items().slice(0, 4)
  const overflow = () => Math.max(0, count() - 4)

  const gridClass = () => {
    const n = count()
    if (n === 1) return 'grid-cols-1'
    if (n === 3) return 'grid-cols-2'
    return 'grid-cols-2'
  }

  return (
    <Show when={count() > 0}>
      <div
        class={`mt-3 grid gap-1 overflow-hidden rounded-xl ${gridClass()}`}
        style={{ border: '1px solid var(--line)' }}
      >
        <For each={shown()}>
          {(m, i) => {
            // First image spans full width when there are exactly 3.
            const span = count() === 3 && i() === 0 ? 'col-span-2' : ''
            const isLast = i() === 3 && overflow() > 0
            return (
              <div
                class={`relative ${span}`}
                style={{
                  'aspect-ratio': count() === 1 ? '16 / 10' : '1 / 1',
                  background: 'color-mix(in oklab, var(--sea-ink) 6%, transparent)',
                }}
              >
                <Show
                  when={m.type === 'VIDEO'}
                  fallback={
                    <img
                      src={m.url}
                      alt=""
                      loading="lazy"
                      class="h-full w-full object-cover"
                    />
                  }
                >
                  <video
                    src={m.url}
                    controls
                    class="h-full w-full object-cover"
                  />
                </Show>
                <Show when={isLast}>
                  <div
                    class="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white"
                    style={{ background: 'rgba(23,58,64,0.55)' }}
                  >
                    +{overflow()}
                  </div>
                </Show>
              </div>
            )
          }}
        </For>
      </div>
    </Show>
  )
}
