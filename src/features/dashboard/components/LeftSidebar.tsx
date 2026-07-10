import { For, Show } from 'solid-js'
import { Link } from '@tanstack/solid-router'
import {
  Bell,
  Home,
  Settings,
  SquarePen,
  User as UserIcon,
  Users,
} from 'lucide-solid'
import type { LucideProps } from 'lucide-solid'
import type { Component } from 'solid-js'
import Avatar from '~/components/shared/Avatar'
import { currentUser } from '~/features/auth/store'
import { db } from '~/services/mock'

type NavLink = {
  label: string
  icon: Component<LucideProps>
  to: string
  params?: Record<string, string>
  exact?: boolean
}

export default function LeftSidebar() {
  const me = () => currentUser()

  const links = (): Array<NavLink> => [
    { label: 'Feed', icon: Home, to: '/dashboard', exact: true },
    { label: 'My Posts', icon: SquarePen, to: '/dashboard/posts' },
    { label: 'Notifications', icon: Bell, to: '/dashboard/notifications' },
    ...(me()
      ? [
          {
            label: 'Profile',
            icon: UserIcon,
            to: '/dashboard/profile/$userId',
            params: { userId: me()!.id },
          } as NavLink,
        ]
      : []),
    { label: 'Settings', icon: Settings, to: '/dashboard/settings' },
  ]

  return (
    <aside class="hidden w-60 shrink-0 lg:block">
      <div class="sticky top-[4.5rem] flex flex-col gap-1">
        <Show when={me()}>
          {(user) => (
            <Link
              to="/dashboard/profile/$userId"
              params={{ userId: user().id }}
              class="side-item no-underline"
            >
              <Avatar
                name={user().profile.firstName}
                src={user().profile.avatar}
                size={32}
              />
              <span class="font-semibold">
                {user().profile.firstName} {user().profile.lastName}
              </span>
            </Link>
          )}
        </Show>

        <For each={links()}>
          {(link) => (
            <Link
              to={link.to}
              params={link.params}
              activeOptions={link.exact ? { exact: true } : undefined}
              class="side-item no-underline"
              activeProps={{ class: 'side-item side-item-active no-underline' }}
            >
              <span class="side-icon">
                <link.icon size={18} />
              </span>
              {link.label}
            </Link>
          )}
        </For>

        <hr class="my-3" style={{ 'border-color': 'var(--line)' }} />
        <p class="island-kicker px-3 pb-1">Your groups</p>
        <For each={db.groups.slice(0, 3)}>
          {(group) => (
            <div class="side-item">
              <span class="side-icon">
                <Users size={18} />
              </span>
              <span class="truncate">{group.name}</span>
            </div>
          )}
        </For>
      </div>
    </aside>
  )
}
