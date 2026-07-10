import { Show } from 'solid-js'
import { Link, Outlet, useNavigate } from '@tanstack/solid-router'
import { LogOut } from 'lucide-solid'
import { currentUser, logout } from '~/features/auth/store'
import Avatar from '~/components/shared/Avatar'

export default function DashboardShell() {
  const navigate = useNavigate()

  function onLogout() {
    logout()
    navigate({ to: '/login' })
  }

  return (
    <div class="flex min-h-screen flex-col">
      <header class="site-header px-4">
        <nav class="page-wrap nav-shell">
          <Link to="/dashboard" class="brand-pill shrink-0">
            <span class="brand-dot" />
            Social Hub
          </Link>

          <div class="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold sm:order-2 sm:w-auto sm:flex-nowrap">
            <Link
              to="/dashboard"
              activeOptions={{ exact: true }}
              class="nav-link"
              activeProps={{ class: 'nav-link is-active' }}
            >
              Feed
            </Link>
            <Link
              to="/dashboard/posts"
              class="nav-link"
              activeProps={{ class: 'nav-link is-active' }}
            >
              My Posts
            </Link>
          </div>

          <div class="order-2 ml-auto flex items-center gap-3 sm:order-3">
            <Show when={currentUser()}>
              {(user) => (
                <span class="flex items-center gap-2">
                  <Avatar
                    name={user().profile.firstName}
                    src={user().profile.avatar}
                    size={32}
                  />
                  <span class="hidden text-sm font-semibold sm:inline">
                    @{user().profile.username}
                  </span>
                </span>
              )}
            </Show>
            <button
              type="button"
              class="demo-button demo-button-secondary"
              onClick={onLogout}
              title="Log out"
            >
              <LogOut size={16} />
              <span class="hidden sm:inline">Log out</span>
            </button>
          </div>
        </nav>
      </header>

      <main class="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
