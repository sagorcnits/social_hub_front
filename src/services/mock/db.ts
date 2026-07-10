// In-memory seed database used while the backend is offline (USE_MOCKS).
// Arrays are mutable so likes, new posts, and new comments persist for the
// duration of the session — mirroring what the real API would return.

import type { User } from '~/features/auth/types'
import type { Comment } from '~/features/comments/types'
import type { Post, PostAuthor } from '~/features/posts/types'
import type { Notification } from '~/features/notifications/types'
import type { Friend, Group } from '~/features/social/types'

let seq = 100
export const nextId = (prefix: string) => `${prefix}_${++seq}`

/** ISO timestamp `mins` minutes ago. */
const ago = (mins: number) =>
  new Date(Date.now() - mins * 60_000).toISOString()

function mkUser(
  id: string,
  username: string,
  firstName: string,
  lastName: string,
  avatar: string | null,
  bio = '',
): User {
  return {
    id,
    email: `${username}@social.dev`,
    role: 'USER',
    profile: { username, firstName, lastName, avatar, bio },
  }
}

export const CURRENT_USER_ID = 'usr_me'

export const users: Array<User> = [
  mkUser(
    CURRENT_USER_ID,
    'alex',
    'Alex',
    'Rivera',
    'https://i.pravatar.cc/150?img=12',
    'Building Social Hub. Coffee, code, and the coastline.',
  ),
  mkUser('usr_2', 'bob', 'Bob', 'Nguyen', 'https://i.pravatar.cc/150?img=8'),
  mkUser('usr_3', 'carla', 'Carla', 'Mendes', 'https://i.pravatar.cc/150?img=5'),
  mkUser('usr_4', 'diego', 'Diego', 'Santos', null),
  mkUser('usr_5', 'emma', 'Emma', 'Lund', 'https://i.pravatar.cc/150?img=24'),
  mkUser('usr_6', 'finn', 'Finn', 'Oduya', 'https://i.pravatar.cc/150?img=15'),
]

export const userById = (id: string) => users.find((u) => u.id === id)

const author = (id: string): PostAuthor => {
  const u = userById(id)!
  return { id: u.id, email: u.email, profile: u.profile }
}

const img = (id: number) => `https://picsum.photos/seed/sh${id}/800/600`

export const posts: Array<Post> = [
  {
    id: 'post_1',
    content:
      'Golden hour over the lagoon tonight. Sometimes you just have to stop and watch the light. 🌅',
    media: [
      { id: 'm1', url: img(1), type: 'IMAGE' },
      { id: 'm2', url: img(2), type: 'IMAGE' },
    ],
    likesCount: 42,
    commentsCount: 3,
    liked: false,
    createdAt: ago(35),
    user: author('usr_3'),
  },
  {
    id: 'post_2',
    content:
      'Shipped the first version of the nested comment system today. Replies to replies, all the way down. Proud of this one. 🧵',
    media: [],
    likesCount: 128,
    commentsCount: 2,
    liked: true,
    createdAt: ago(120),
    user: author('usr_2'),
  },
  {
    id: 'post_3',
    content: 'Morning run done. New personal best on the coastal loop. 🏃‍♂️',
    media: [{ id: 'm3', url: img(3), type: 'IMAGE' }],
    likesCount: 17,
    commentsCount: 1,
    liked: false,
    createdAt: ago(240),
    user: author('usr_5'),
  },
  {
    id: 'post_4',
    content:
      'Hot take: the best design system is the one your whole team actually uses. Consistency beats cleverness.',
    media: [],
    likesCount: 64,
    commentsCount: 0,
    liked: false,
    createdAt: ago(400),
    user: author('usr_me'),
  },
  {
    id: 'post_5',
    content: 'Weekend project: repotting the whole balcony garden. 🌿',
    media: [
      { id: 'm4', url: img(4), type: 'IMAGE' },
      { id: 'm5', url: img(5), type: 'IMAGE' },
      { id: 'm6', url: img(6), type: 'IMAGE' },
      { id: 'm7', url: img(7), type: 'IMAGE' },
    ],
    likesCount: 89,
    commentsCount: 0,
    liked: false,
    createdAt: ago(600),
    user: author('usr_4'),
  },
]

function mkComment(
  id: string,
  postId: string,
  userId: string,
  content: string,
  parentId: string | null,
  mins: number,
  replies: Array<Comment> = [],
): Comment {
  return {
    id,
    content,
    userId,
    postId,
    parentId,
    likesCount: replies.length ? 4 : 1,
    repliesCount: replies.length,
    liked: false,
    createdAt: ago(mins),
    user: author(userId),
    replies,
  }
}

/** Top-level comments (with nested reply trees) keyed by postId. */
export const commentsByPost: Record<string, Array<Comment>> = {
  post_1: [
    mkComment('cmt_1', 'post_1', 'usr_2', 'This is stunning 😍', null, 30, [
      mkComment('cmt_2', 'post_1', 'usr_3', 'Thanks Bob! Right place, right time.', 'cmt_1', 25, [
        mkComment('cmt_3', 'post_1', 'usr_2', 'What camera do you shoot with?', 'cmt_2', 20),
      ]),
    ]),
    mkComment('cmt_4', 'post_1', 'usr_5', 'Saving this as my wallpaper.', null, 15),
  ],
  post_2: [
    mkComment('cmt_5', 'post_2', 'usr_me', 'Recursive components are so satisfying when they click.', null, 100, [
      mkComment('cmt_6', 'post_2', 'usr_2', 'Exactly. One CommentNode to rule them all.', 'cmt_5', 90),
    ]),
  ],
  post_3: [mkComment('cmt_7', 'post_3', 'usr_6', 'Beast mode. 🔥', null, 200)],
}

export const notifications: Array<Notification> = [
  {
    id: 'ntf_1',
    type: 'LIKE',
    message: null,
    isRead: false,
    receiverId: CURRENT_USER_ID,
    senderId: 'usr_3',
    postId: 'post_4',
    commentId: null,
    createdAt: ago(5),
    sender: author('usr_3'),
  },
  {
    id: 'ntf_2',
    type: 'COMMENT',
    message: null,
    isRead: false,
    receiverId: CURRENT_USER_ID,
    senderId: 'usr_2',
    postId: 'post_4',
    commentId: 'cmt_5',
    createdAt: ago(22),
    sender: author('usr_2'),
  },
  {
    id: 'ntf_3',
    type: 'REPLY',
    message: null,
    isRead: false,
    receiverId: CURRENT_USER_ID,
    senderId: 'usr_2',
    postId: 'post_2',
    commentId: 'cmt_6',
    createdAt: ago(90),
    sender: author('usr_2'),
  },
  {
    id: 'ntf_4',
    type: 'COMMENT_LIKE',
    message: null,
    isRead: true,
    receiverId: CURRENT_USER_ID,
    senderId: 'usr_5',
    postId: 'post_2',
    commentId: 'cmt_5',
    createdAt: ago(300),
    sender: author('usr_5'),
  },
]

export const friends: Array<Friend> = users
  .filter((u) => u.id !== CURRENT_USER_ID)
  .map((u, i) => ({
    id: u.id,
    username: u.profile.username,
    firstName: u.profile.firstName,
    avatar: u.profile.avatar ?? null,
    online: i % 2 === 0,
  }))

export const groups: Array<Group> = [
  { id: 'grp_1', name: 'Coastal Photographers', members: 3200, cover: img(11) },
  { id: 'grp_2', name: 'SolidJS Builders', members: 1450, cover: img(12) },
  { id: 'grp_3', name: 'Balcony Gardeners', members: 870, cover: img(13) },
  { id: 'grp_4', name: 'Morning Runners Club', members: 5600, cover: img(14) },
]
