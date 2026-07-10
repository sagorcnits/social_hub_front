import { For, Show, createSignal, onMount } from 'solid-js'
import { currentUser } from '~/features/auth/store'
import { fetchUserPosts } from '../api'
import type { Post } from '../types'
import PostCard from '../components/PostCard'
import PostComposer from '../components/PostComposer'

export default function MyPostsPage() {
  const [posts, setPosts] = createSignal<Array<Post>>([])
  const [loading, setLoading] = createSignal(true)

  onMount(async () => {
    const me = currentUser()
    if (!me) {
      setLoading(false)
      return
    }
    try {
      const res = await fetchUserPosts(me.id)
      setPosts(res.data)
    } finally {
      setLoading(false)
    }
  })

  const onCreated = (post: Post) => setPosts([post, ...posts()])
  const onDeleted = (id: string) => setPosts(posts().filter((p) => p.id !== id))

  return (
    <div class="flex flex-col gap-4">
      <h1 class="demo-title" style={{ 'font-size': '1.5rem' }}>
        Your posts
      </h1>

      <PostComposer onCreated={onCreated} />

      <Show when={loading()}>
        <div class="demo-card demo-muted text-center text-sm">Loading…</div>
      </Show>

      <Show when={!loading() && posts().length === 0}>
        <div class="demo-card demo-muted text-center text-sm">
          You haven't posted yet — say hello above.
        </div>
      </Show>

      <For each={posts()}>
        {(post) => <PostCard post={post} onDeleted={onDeleted} />}
      </For>
    </div>
  )
}
