import { For, Show, createSignal, onMount } from 'solid-js'
import { Link } from '@tanstack/solid-router'
import { Bell } from 'lucide-solid'
import {
  loadNotifications,
  markEveryRead,
  markOneRead,
  notifications,
  unreadCount,
} from '../store'
import NotifItem from './NotifItem'

export default function NotifBell() {
  const [open, setOpen] = createSignal(false)

  onMount(() => {
    void loadNotifications()
  })

  return (
    <div class="relative">
      <button
        type="button"
        onClick={() => setOpen(!open())}
        title="Notifications"
        aria-label="Notifications"
        class="relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-black/5"
        style={{ color: 'var(--sea-ink)' }}
      >
        <Bell size={20} />
        <Show when={unreadCount() > 0}>
          <span
            class="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
            style={{ background: '#9f3030' }}
          >
            {unreadCount() > 9 ? '9+' : unreadCount()}
          </span>
        </Show>
      </button>

      <Show when={open()}>
        {/* Click-away backdrop */}
        <div class="fixed inset-0 z-40" onClick={() => setOpen(false)} />
        <div
          class="demo-panel absolute right-0 z-50 mt-2 w-80 max-w-[90vw] p-3"
          style={{ 'max-height': '70vh', overflow: 'auto' }}
        >
          <div class="mb-2 flex items-center justify-between">
            <h3 class="demo-section-title">Notifications</h3>
            <Show when={unreadCount() > 0}>
              <button
                type="button"
                onClick={() => void markEveryRead()}
                class="text-xs font-semibold"
                style={{ color: 'var(--lagoon-deep)' }}
              >
                Mark all read
              </button>
            </Show>
          </div>

          <Show
            when={notifications().length > 0}
            fallback={
              <p class="demo-muted py-6 text-center text-sm">
                You're all caught up.
              </p>
            }
          >
            <div class="flex flex-col gap-1">
              <For each={notifications().slice(0, 6)}>
                {(n) => (
                  <NotifItem notification={n} onRead={(id) => void markOneRead(id)} />
                )}
              </For>
            </div>
          </Show>

          <Link
            to="/dashboard/notifications"
            onClick={() => setOpen(false)}
            class="mt-2 block rounded-lg py-2 text-center text-sm font-semibold no-underline"
            style={{ color: 'var(--lagoon-deep)' }}
          >
            See all notifications
          </Link>
        </div>
      </Show>
    </div>
  )
}
