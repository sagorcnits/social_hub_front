import { For, Show, createResource } from 'solid-js'
import { Link } from '@tanstack/solid-router'
import { Pencil } from 'lucide-solid'
import Avatar from '~/components/shared/Avatar'
import { currentUser } from '~/features/auth/store'
import { fetchUserPosts } from '~/features/posts/api'
import PostCard from '~/features/posts/components/PostCard'
import { fetchProfileUser } from '../api'

export default function ProfilePage(props: { userId: string }) {
  const [user] = createResource(() => props.userId, fetchProfileUser)
  const [posts] = createResource(() => props.userId, fetchUserPosts)
  const isSelf = () => currentUser()?.id === props.userId

  return (
    <div class="flex flex-col gap-4">
      <Show when={user.error}>
        <div class="demo-alert demo-alert-danger text-sm">User not found.</div>
      </Show>

      <Show when={user()}>
        {(loaded) => {
          const u = () => loaded().data
          return (
            <div class="demo-panel overflow-hidden !p-0">
              <div
                class="h-32 w-full sm:h-40"
                style={{
                  background:
                    'linear-gradient(120deg, color-mix(in oklab, var(--lagoon) 55%, white), color-mix(in oklab, var(--palm) 45%, white))',
                }}
              />
              <div class="flex flex-col gap-3 px-5 pb-5 sm:flex-row sm:items-end">
                <div class="-mt-12 shrink-0">
                  <Avatar
                    name={u().profile.firstName}
                    src={u().profile.avatar}
                    size={96}
                    class="ring-4"
                  />
                </div>
                <div class="min-w-0 flex-1">
                  <h1 class="display-title text-2xl font-bold">
                    {u().profile.firstName} {u().profile.lastName}
                  </h1>
                  <p class="demo-muted text-sm">@{u().profile.username}</p>
                  <Show when={u().profile.bio}>
                    <p class="mt-2 text-sm">{u().profile.bio}</p>
                  </Show>
                </div>
                <Show when={isSelf()}>
                  <Link
                    to="/dashboard/settings"
                    class="demo-button demo-button-secondary shrink-0 no-underline"
                  >
                    <Pencil size={15} /> Edit profile
                  </Link>
                </Show>
              </div>
            </div>
          )
        }}
      </Show>

      <h2 class="demo-section-title mt-2">Posts</h2>

      <Show when={posts.loading}>
        <div class="demo-card demo-muted text-center text-sm">Loading posts…</div>
      </Show>

      <Show when={posts() && posts()!.data.length === 0}>
        <div class="demo-card demo-muted text-center text-sm">
          No posts yet.
        </div>
      </Show>

      <For each={posts()?.data ?? []}>
        {(post) => <PostCard post={post} />}
      </For>
    </div>
  )
}
