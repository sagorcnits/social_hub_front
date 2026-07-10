import type { PostAuthor } from '~/features/posts/types'

export type NotificationType =
  | 'LIKE'
  | 'COMMENT'
  | 'REPLY'
  | 'COMMENT_LIKE'

export type Notification = {
  id: string
  type: NotificationType
  message: string | null
  isRead: boolean
  receiverId: string
  senderId: string
  postId: string | null
  commentId: string | null
  createdAt: string
  sender: PostAuthor
}
