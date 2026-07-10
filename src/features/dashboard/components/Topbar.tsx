import { Show } from 'solid-js'
import { Link, useNavigate } from '@tanstack/solid-router'
import { Home, LogOut, Search, SquarePen } from 'lucide-solid'
import Avatar from '~/components/shared/Avatar'
import NotifBell from '~/features/notifications/components/NotifBell'
import { currentUser, logout } from '~/features/auth/store'

export default function Topbar() {
  const navigate = useNavigate()
  const me = () => currentUser()

  function onLogout() {
    logout()
    navigate({ to: '/login' })
  }

  return (
    <header class="site-header px-3 sm:px-4">
      <div class="mx-auto flex h-14 max-w-[1600px] items-center gap-3">
        {/* Brand + search */}
        <Link to="/dashboard" class="brand-pill shrink-0 no-underline">
          <span class="brand-dot" />
          <span class="hidden sm:inline">Social Hub</span>
        </Link>
        <div
          class="hidden items-center gap-2 rounded-full px-3 py-2 sm:flex"
          style={{
            background: 'var(--chip-bg)',
            border: '1px solid var(--chip-line)',
          }}
        >
          <Search size={16} style={{ color: 'var(--sea-ink-soft)' }} />
          <input
            class="w-40 bg-transparent text-sm outline-none lg:w-56"
            placeholder="Search Social Hub"
          />
        </div>

        {/* Center nav */}
        <nav class="mx-auto flex items-center gap-1 sm:gap-3">
          <Link
            to="/dashboard"
            activeOptions={{ exact: true }}
            class="flex h-10 w-14 items-center justify-center rounded-xl transition-colors hover:bg-black/5 sm:w-20"
            activeProps={{ class: 'topbar-tab-active' }}
            style={{ color: 'var(--sea-ink-soft)' }}
            title="Feed"
          >
            <Home size={22} />
          </Link>
          <Link
            to="/dashboard/posts"
            class="flex h-10 w-14 items-center justify-center rounded-xl transition-colors hover:bg-black/5 sm:w-20"
            activeProps={{ class: 'topbar-tab-active' }}
            style={{ color: 'var(--sea-ink-soft)' }}
            title="My posts"
          >
            <SquarePen size={22} />
          </Link>
        </nav>

        {/* Right actions */}
        <div class="ml-auto flex items-center gap-1.5 sm:gap-2">
          <NotifBell />
          <Show when={me()}>
            {(user) => (
              <Link
                to="/dashboard/profile/$userId"
                params={{ userId: user().id }}
                class="no-underline"
                title="Your profile"
              >
                <Avatar
                  name={user().profile.firstName}
                  src={user().profile.avatar}
                  size={36}
                />
              </Link>
            )}
          </Show>
          <button
            type="button"
            onClick={onLogout}
            title="Log out"
            aria-label="Log out"
            class="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-black/5"
            style={{ color: 'var(--sea-ink)' }}
          >
            <LogOut size={19} />
          </button>
        </div>
      </div>
    </header>
  )
}
