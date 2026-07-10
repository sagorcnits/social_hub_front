// Comments API — nested replies of unlimited depth. In mock mode the tree is
// mutated in-place on the seed db so replies/deletes persist for the session.

import { PAGE_SIZE, USE_MOCKS } from '~/config'
import { api } from '~/services/api/client'
import { db, mockOk } from '~/services/mock'
import type { ToggleLikeResult } from '~/features/posts/types'
import type { Comment } from '../types'

// ── mock tree helpers ──────────────────────────────────────────────
function findInTree(nodes: Array<Comment>, id: string): Comment | null {
  for (const n of nodes) {
    if (n.id === id) return n
    const hit = n.replies ? findInTree(n.replies, id) : null
    if (hit) return hit
  }
  return null
}

function removeFromTree(nodes: Array<Comment>, id: string): boolean {
  const i = nodes.findIndex((n) => n.id === id)
  if (i >= 0) {
    nodes.splice(i, 1)
    return true
  }
  return nodes.some((n) => n.replies && removeFromTree(n.replies, id))
}

function mockAuthor() {
  const me = db.userById(db.CURRENT_USER_ID)!
  return { id: me.id, email: me.email, profile: me.profile }
}

function newComment(postId: string, parentId: string | null, content: string): Comment {
  return {
    id: db.nextId('cmt'),
    content,
    userId: db.CURRENT_USER_ID,
    postId,
    parentId,
    likesCount: 0,
    repliesCount: 0,
    liked: false,
    createdAt: new Date().toISOString(),
    user: mockAuthor(),
  }
}

// ── endpoints ──────────────────────────────────────────────────────

/** Top-level comments for a post, each with its full nested reply tree. */
export async function fetchThread(postId: string, page = 1, limit = PAGE_SIZE) {
  if (USE_MOCKS) {
    const list = db.commentsByPost[postId] ?? []
    return mockOk(list, { page, limit, total: list.length })
  }
  return api<Array<Comment>>(
    `/comments/post/${postId}?page=${page}&limit=${limit}`,
  )
}

/** Create a top-level comment. */
export async function createComment(postId: string, content: string) {
  if (USE_MOCKS) {
    const c = { ...newComment(postId, null, content), replies: [] as Array<Comment> }
    ;(db.commentsByPost[postId] ??= []).unshift(c)
    const post = db.posts.find((p) => p.id === postId)
    if (post) post.commentsCount += 1
    return mockOk(c)
  }
  return api<Comment>(`/comments/post/${postId}`, {
    method: 'POST',
    auth: true,
    body: { content },
  })
}

/** Reply to any comment/reply. Returns a FLAT comment (no `replies`). */
export async function replyToComment(
  postId: string,
  parentId: string,
  content: string,
) {
  if (USE_MOCKS) {
    const parent = findInTree(db.commentsByPost[postId] ?? [], parentId)
    const reply = newComment(postId, parentId, content)
    if (parent) {
      ;(parent.replies ??= []).push(reply)
      parent.repliesCount += 1
    }
    return mockOk(reply)
  }
  return api<Comment>(`/comments/${parentId}/reply`, {
    method: 'POST',
    auth: true,
    body: { content },
  })
}

/** Delete a comment. Cascades to the whole subtree. */
export async function deleteComment(postId: string, id: string) {
  if (USE_MOCKS) {
    removeFromTree(db.commentsByPost[postId] ?? [], id)
    return mockOk({ id })
  }
  return api<{ id: string }>(`/comments/${id}`, { method: 'DELETE', auth: true })
}

export async function toggleCommentLike(postId: string, id: string) {
  if (USE_MOCKS) {
    const node = findInTree(db.commentsByPost[postId] ?? [], id)
    if (node) {
      node.liked = !node.liked
      node.likesCount += node.liked ? 1 : -1
      return mockOk<ToggleLikeResult>({
        liked: node.liked,
        likesCount: node.likesCount,
      })
    }
    return mockOk<ToggleLikeResult>({ liked: false, likesCount: 0 })
  }
  return api<ToggleLikeResult>(`/likes/comment/${id}/toggle`, {
    method: 'POST',
    auth: true,
  })
}
