import { createContext, useContext } from 'solid-js'
import type { Comment } from '../types'

export type ThreadActions = {
  postId: string
  reply: (parentId: string, content: string) => Promise<Comment>
  remove: (id: string) => Promise<void>
}

export const ThreadContext = createContext<ThreadActions>()

export function useThread(): ThreadActions {
  const ctx = useContext(ThreadContext)
  if (!ctx) throw new Error('useThread must be used within a CommentThread')
  return ctx
}
