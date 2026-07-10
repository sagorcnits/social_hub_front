// Friends & Groups have no backend yet — these drive the fake sidebar data.

export type Friend = {
  id: string
  username: string
  firstName: string
  avatar: string | null
  online: boolean
}

export type Group = {
  id: string
  name: string
  members: number
  cover: string
}
