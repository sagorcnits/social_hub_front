import { For, Show, onMount } from 'solid-js'
import {
  loadNotifications,
  markEveryRead,
  markOneRead,
  notifications,
  unreadCount,
} from '../store'
import NotifItem from '../components/NotifItem'

export default function NotificationsPage() {
  onMount(() => {
    void loadNotifications()
  })

  return (
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h1 class="demo-title" style={{ 'font-size': '1.5rem' }}>
          Notifications
        </h1>
        <Show when={unreadCount() > 0}>
          <button
            type="button"
            onClick={() => void markEveryRead()}
            class="demo-button demo-button-secondary"
          >
            Mark all read
          </button>
        </Show>
      </div>

      <div class="demo-card">
        <Show
          when={notifications().length > 0}
          fallback={
            <p class="demo-muted py-10 text-center text-sm">
              No notifications yet.
            </p>
          }
        >
          <div class="flex flex-col gap-1">
            <For each={notifications()}>
              {(n) => (
                <NotifItem notification={n} onRead={(id) => void markOneRead(id)} />
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  )
}
