import { USE_MOCKS } from '~/config'
import { api } from '~/services/api/client'
import { db, mockOk } from '~/services/mock'
import { currentUser } from '~/features/auth/store'
import type { User } from '~/features/auth/types'
import type { Post } from '~/features/posts/types'

/**
 * Fetch a user's public profile.
 *
 * The backend contract exposes `/auth/me` but no "get user by id" endpoint, so
 * for other users we derive the profile from the author embedded on their
 * posts (`/posts/user/:userId`). Mock mode looks the user up in the seed db.
 */
export async function fetchProfileUser(userId: string) {
  if (USE_MOCKS) {
    const user = db.userById(userId)
    if (!user) throw new Error('User not found')
    return mockOk(user)
  }

  if (currentUser()?.id === userId) {
    return api<User>('/auth/me', { auth: true })
  }

  const posts = await api<Array<Post>>(`/posts/user/${userId}`)
  const author = posts.data.at(0)?.user
  if (!author) throw new Error('User not found')
  const user: User = {
    id: author.id,
    email: author.email,
    role: 'USER',
    profile: author.profile,
  }
  return { success: true, message: 'OK', data: user }
}
