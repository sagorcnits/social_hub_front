import { For, Show, createSignal, onMount } from 'solid-js'
import {
  createComment,
  deleteComment,
  fetchThread,
  replyToComment,
} from '../api'
import type { Comment } from '../types'
import { ThreadContext } from './thread-context'
import type { ThreadActions } from './thread-context'
import CommentNode from './CommentNode'
import ReplyBox from './ReplyBox'

// ── immutable tree updates ─────────────────────────────────────────
function insertReply(
  nodes: Array<Comment>,
  parentId: string,
  reply: Comment,
): Array<Comment> {
  return nodes.map((n) => {
    if (n.id === parentId) {
      const replies = [...(n.replies ?? []), reply]
      return { ...n, replies, repliesCount: replies.length }
    }
    if (n.replies?.length) {
      return { ...n, replies: insertReply(n.replies, parentId, reply) }
    }
    return n
  })
}

function removeNode(nodes: Array<Comment>, id: string): Array<Comment> {
  return nodes
    .filter((n) => n.id !== id)
    .map((n) => {
      if (!n.replies?.length) return n
      const replies = removeNode(n.replies, id)
      return { ...n, replies, repliesCount: replies.length }
    })
}

export default function CommentThread(props: { postId: string }) {
  const [tree, setTree] = createSignal<Array<Comment>>([])
  const [loading, setLoading] = createSignal(true)

  onMount(async () => {
    try {
      const res = await fetchThread(props.postId)
      setTree(res.data)
    } finally {
      setLoading(false)
    }
  })

  async function addTopLevel(content: string) {
    const res = await createComment(props.postId, content)
    setTree([{ ...res.data, replies: [] }, ...tree()])
  }

  const actions: ThreadActions = {
    postId: props.postId,
    reply: async (parentId, content) => {
      const res = await replyToComment(props.postId, parentId, content)
      setTree(insertReply(tree(), parentId, res.data))
      return res.data
    },
    remove: async (id) => {
      await deleteComment(props.postId, id)
      setTree(removeNode(tree(), id))
    },
  }

  return (
    <ThreadContext.Provider value={actions}>
      <section class="demo-card">
        <h2 class="demo-section-title mb-3">Comments</h2>

        <ReplyBox placeholder="Write a comment…" onSubmit={addTopLevel} />

        <Show when={loading()}>
          <p class="demo-muted mt-4 text-sm">Loading comments…</p>
        </Show>

        <Show when={!loading() && tree().length === 0}>
          <p class="demo-muted mt-4 text-sm">
            No comments yet — be the first to reply.
          </p>
        </Show>

        <div class="mt-2">
          <For each={tree()}>
            {(comment) => <CommentNode comment={comment} />}
          </For>
        </div>
      </section>
    </ThreadContext.Provider>
  )
}
