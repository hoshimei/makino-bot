export type Result = {
  title: string
  image: string
}

export type CharacterInfo = {
  name: string
  image: string
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
