import type { Follower } from '../types'
import { createFollowerCard } from './followerCard'

export function renderFollowerList(
  container: HTMLElement,
  followers: Follower[],
  onDeleteFollower?: (id: string) => void,
  onEditFollower?: (follower: Follower) => void
): void {
  // Clear previous contents
  container.innerHTML = ''

  if (followers.length === 0) {
    const emptyState = document.createElement('div')
    emptyState.className = 'card bg-base-200 card-border p-8 text-center flex flex-col items-center justify-center gap-2 text-base-content/60'
    emptyState.innerHTML = `
      <span class="text-4xl"><img src="https://static.wikia.nocookie.net/cult-of-the-lamb/images/4/4f/Shepherd_Golden.png/revision/latest?cb=20260125001417" alt="Lamb" class="w-100 h-100" /></span>
      <p class="font-semibold text-base text-base-content">No followers registered yet</p>
      <p class="text-sm">Click the button above to recruit your first follower to the flock!</p>
    `
    container.appendChild(emptyState)
    return
  }

  const grid = document.createElement('div')
  grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full text-left'

  for (const follower of followers) {
    const card = createFollowerCard({
      follower,
      onDelete: onDeleteFollower,
      onEdit: onEditFollower,
    })
    grid.appendChild(card)
  }

  container.appendChild(grid)
}
