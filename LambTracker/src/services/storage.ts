import type { Follower } from '../types'

const STORAGE_KEY = 'lambtracker_followers'

export function getFollowers(): Follower[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Follower[]
  } catch (error) {
    console.error('Failed to load followers from localStorage:', error)
    return []
  }
}

export function saveFollower(follower: Follower): void {
  try {
    const followers = getFollowers()
    followers.unshift(follower)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(followers))
  } catch (error) {
    console.error('Failed to save follower to localStorage:', error)
  }
}

export function updateFollower(follower: Follower): void {
  try {
    const followers = getFollowers().map((f) => (f.id === follower.id ? follower : f))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(followers))
  } catch (error) {
    console.error('Failed to update follower in localStorage:', error)
  }
}

export function deleteFollower(id: string): void {
  try {
    const followers = getFollowers().filter((f) => f.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(followers))
  } catch (error) {
    console.error('Failed to delete follower from localStorage:', error)
  }
}
