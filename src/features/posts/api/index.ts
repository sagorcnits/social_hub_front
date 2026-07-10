// Posts API. Each call hits the real backend, or serves seeded data when
// USE_MOCKS is on (mutating the in-memory db so changes persist per session).

import { PAGE_SIZE, USE_MOCKS } from '~/config'
import { api } from '~/services/api/client'
import { db, mockOk } from '~/services/mock'
import type { Post, ToggleLikeResult } from '../types'

export async function fetchFeed(page = 1, limit = PAGE_SIZE) {
  if (USE_MOCKS) {
    const start = (page - 1) * limit
    const slice = db.posts.slice(start, start + limit)
    return mockOk(slice, { page, limit, total: db.posts.length })
  }
  return api<Array<Post>>(`/posts?page=${page}&limit=${limit}`)
}

export async function fetchUserPosts(userId: string) {
  if (USE_MOCKS) {
    const list = db.posts.filter((p) => p.user.id === userId)
    return mockOk(list, { page: 1, limit: list.length, total: list.length })
  }
  return api<Array<Post>>(`/posts/user/${userId}`)
}

export async function fetchPost(id: string) {
  if (USE_MOCKS) {
    const post = db.posts.find((p) => p.id === id)
    if (!post) throw new Error('Post not found')
    return mockOk(post)
  }
  return api<Post>(`/posts/${id}`)
}

export async function createPost(content: string, files: Array<File>) {
  if (USE_MOCKS) {
    const me = db.userById(db.CURRENT_USER_ID)!
    const post: Post = {
      id: db.nextId('post'),
      content,
      media: files.map((f) => ({
        id: db.nextId('m'),
        url: URL.createObjectURL(f),
        type: f.type.startsWith('video')
          ? ('VIDEO' as const)
          : ('IMAGE' as const),
      })),
      likesCount: 0,
      commentsCount: 0,
      liked: false,
      createdAt: new Date().toISOString(),
      user: { id: me.id, email: me.email, profile: me.profile },
    }
    db.posts.unshift(post)
    return mockOk(post)
  }

  const fd = new FormData()
  fd.append('content', content)
  for (const file of files) fd.append('media', file)
  // No Content-Type — the browser sets the multipart boundary.
  return api<Post>('/posts', { method: 'POST', auth: true, body: fd })
}

export async function deletePost(id: string) {
  if (USE_MOCKS) {
    const i = db.posts.findIndex((p) => p.id === id)
    if (i >= 0) db.posts.splice(i, 1)
    return mockOk({ id })
  }
  return api<{ id: string }>(`/posts/${id}`, { method: 'DELETE', auth: true })
}

export async function togglePostLike(id: string) {
  if (USE_MOCKS) {
    const post = db.posts.find((p) => p.id === id)
    if (!post) throw new Error('Post not found')
    post.liked = !post.liked
    post.likesCount += post.liked ? 1 : -1
    return mockOk<ToggleLikeResult>({
      liked: post.liked,
      likesCount: post.likesCount,
    })
  }
  return api<ToggleLikeResult>(`/likes/post/${id}/toggle`, {
    method: 'POST',
    auth: true,
  })
}
