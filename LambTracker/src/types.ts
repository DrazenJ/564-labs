export interface Follower {
  id: string
  name: string
  level: string
  animal: string
  outfit: string
  age: number
  gift: string
  role: string
  isMarried: boolean
  isFavorite: boolean
  isDead: boolean
  createdAt: number
}

export type FollowerFormData = Omit<Follower, 'id' | 'createdAt'>

export interface AnimalDefinition {
  id: string
  name: string
  pack: string
  icon: string
}
