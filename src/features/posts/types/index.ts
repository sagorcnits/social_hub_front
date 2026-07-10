import type { User } from '~/features/auth/types'

export type MediaKind = 'IMAGE' | 'VIDEO'

export type Media = {
  id: string
  url: string
  type: MediaKind
}

/** Author summary embedded on a post (subset of the full User). */
export type PostAuthor = Pick<User, 'id' | 'email' | 'profile'>

export type Post = {
  id: string
  content: string
  media: Array<Media>
  likesCount: number
  commentsCount: number
  liked: boolean
  createdAt: string
  user: PostAuthor
}

export type ToggleLikeResult = {
  liked: boolean
  likesCount: number
}
