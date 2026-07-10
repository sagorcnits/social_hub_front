import { For, Show, createSignal, onMount } from 'solid-js'
import { fetchFeed } from '../api'
import type { Post } from '../types'
import PostCard from '../components/PostCard'
import PostComposer from '../components/PostComposer'

export default function FeedPage() {
  const [posts, setPosts] = createSignal<Array<Post>>([])
  const [loading, setLoading] = createSignal(true)
  const [error, setError] = createSignal<string | null>(null)

  onMount(async () => {
    try {
      const res = await fetchFeed()
      setPosts(res.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the feed.')
    } finally {
      setLoading(false)
    }
  })

  const onCreated = (post: Post) => setPosts([post, ...posts()])
  const onDeleted = (id: string) => setPosts(posts().filter((p) => p.id !== id))

  return (
    <div class="flex flex-col gap-4">
      <PostComposer onCreated={onCreated} />

      <Show when={error()}>
        <div class="demo-alert demo-alert-danger text-sm">{error()}</div>
      </Show>

      <Show when={loading()}>
        <div class="demo-card demo-muted text-center text-sm">Loading feed…</div>
      </Show>

      <Show when={!loading() && posts().length === 0 && !error()}>
        <div class="demo-card demo-muted text-center text-sm">
          No posts yet — share something above.
        </div>
      </Show>

      <For each={posts()}>
        {(post) => <PostCard post={post} onDeleted={onDeleted} />}
      </For>
    </div>
  )
}
