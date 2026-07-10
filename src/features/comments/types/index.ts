import type { PostAuthor } from '~/features/posts/types'

export type Comment = {
  id: string
  content: string
  userId: string
  postId: string
  parentId: string | null
  likesCount: number
  repliesCount: number
  liked: boolean
  createdAt: string
  user: PostAuthor
  /** Present only on GET /comments/post/:postId — the full nested tree. */
  replies?: Array<Comment>
}
