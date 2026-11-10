import type { AvatarfileName } from "./avatars"

export type Result = {
  title: string
  image: string
}

export type CharacterInfo = {
  name: string
  image: AvatarfileName
  birthday?: string
  isAprilOffer?: boolean
}

export type Chat = {
  id: number
  title: string
}

export type User = {
  id: number
  first_name: String
  last_name?: String
}
