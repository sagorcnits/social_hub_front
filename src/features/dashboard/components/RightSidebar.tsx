import { For } from 'solid-js'
import { Link } from '@tanstack/solid-router'
import Avatar from '~/components/shared/Avatar'
import { db } from '~/services/mock'

export default function RightSidebar() {
  return (
    <aside class="hidden w-64 shrink-0 xl:block">
      <div class="sticky top-[4.5rem] flex flex-col gap-4">
        <section>
          <p class="island-kicker px-1 pb-2">Contacts</p>
          <div class="flex flex-col gap-0.5">
            <For each={db.friends}>
              {(friend) => (
                <Link
                  to="/dashboard/profile/$userId"
                  params={{ userId: friend.id }}
                  class="side-item no-underline"
                >
                  <span class="relative">
                    <Avatar
                      name={friend.firstName}
                      src={friend.avatar}
                      size={32}
                    />
                    <span
                      class="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full"
                      style={{
                        background: friend.online ? '#3fbf6b' : 'var(--line)',
                        border: '2px solid var(--foam)',
                      }}
                    />
                  </span>
                  <span class="font-medium">{friend.firstName}</span>
                </Link>
              )}
            </For>
          </div>
        </section>

        <section class="demo-card !p-3">
          <p class="island-kicker pb-2">Suggested groups</p>
          <div class="flex flex-col gap-3">
            <For each={db.groups}>
              {(group) => (
                <div class="flex items-center gap-3">
                  <img
                    src={group.cover}
                    alt=""
                    loading="lazy"
                    class="h-10 w-10 shrink-0 rounded-lg object-cover"
                  />
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-semibold">{group.name}</p>
                    <p class="demo-muted text-xs">
                      {group.members.toLocaleString()} members
                    </p>
                  </div>
                </div>
              )}
            </For>
          </div>
        </section>
      </div>
    </aside>
  )
}
