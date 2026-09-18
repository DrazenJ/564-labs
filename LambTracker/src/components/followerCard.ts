import type { Follower, AnimalDefinition } from '../types'
import animalsData from '../data/animals.json'

const animals: AnimalDefinition[] = animalsData

export interface FollowerCardOptions {
  follower: Follower
  onDelete?: (id: string) => void
  onEdit?: (follower: Follower) => void
}

export function createFollowerCard(options: FollowerCardOptions): HTMLElement {
  const { follower, onDelete, onEdit } = options

  const card = document.createElement('div')
  card.className = `card bg-base-200 card-border shadow-md transition-all duration-300 hover:shadow-xl`

  const animalKey = follower.animal.toLowerCase()
  const matchedAnimal = animals.find(
    (a) => a.id.toLowerCase() === animalKey || a.name.toLowerCase() === animalKey
  )
  const animalImage = matchedAnimal?.icon
  const animalIcon = animalImage && (animalImage.startsWith('http') || animalImage.startsWith('/'))
    ? `<img src="${animalImage}" alt="${follower.animal}" class="w-[100px] h-[100px] inline-block object-contain" />`
    : (animalImage || '🐾')

  card.innerHTML = `
    <div class="card-body p-5">
      <div class="flex items-start justify-between gap-3">
        <div class="flex-1">
          <div class="flex items-center gap-2 flex-wrap">
            <h2 class="card-title text-xl font-bold text-base-content">${follower.name}</h2>
            ${follower.isFavorite ? '<span class="badge badge-warning badge-sm font-semibold">Favorite</span>' : ''}
            ${follower.isMarried ? '<span class="badge badge-secondary badge-sm font-semibold">Married</span>' : ''}
            ${follower.isDead ? '<span class="badge badge-error badge-sm font-semibold">Dead</span>' : '<span class="badge badge-success badge-sm font-semibold">Alive</span>'}
          </div>
          <p class="text-xs text-base-content/70 mt-1 font-medium">Level ${follower.level} • ${follower.role}</p>
        </div>

        <div class="flex items-center gap-1">
          <button type="button" class="btn btn-circle btn-ghost btn-xs text-info hover:bg-info/10 edit-card-btn" title="Edit follower" aria-label="Edit follower">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button type="button" class="btn btn-circle btn-ghost btn-xs text-error hover:bg-error/10 delete-card-btn" title="Remove follower" aria-label="Remove follower">
            ✕
          </button>
        </div>
      </div>

      <div class="divider my-2"></div>

      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="bg-base-100/80 p-2.5 rounded-box flex flex-col">
          <span class="text-base-content/60 font-medium">Animal</span>
          <span class="font-bold capitalize mt-0.5 flex items-center gap-1.5 justify-center">${animalIcon}</span>
        </div>
        <div class="stats bg-base-100/80 p-2.5 rounded-box flex flex-col">
          <div class="stat">
            <span class="text-base-content/60 font-medium">Age</span>
            <span class="stat-value text-primary mt-0.5">${follower.age} yrs</span>
          </div>
        </div>
        <div class="stats bg-base-100/80 p-2.5 rounded-box flex flex-col">
          <div class="stat">
            <span class="text-base-content/60 font-medium">Outfit</span>
            <span class="stat-value text-secondary mt-0.5">${follower.outfit}</span>
          </div>
        </div>
        <div class="stats bg-base-100/80 p-2.5 rounded-box flex flex-col">
          <div class="stat">
            <span class="text-base-content/60 font-medium">Gift</span>
            <span class="stat-value text-secondary mt-0.5">${follower.gift}</span>
          </div>
        </div>
      </div>
    </div>
  `

  const editBtn = card.querySelector<HTMLButtonElement>('.edit-card-btn')
  if (editBtn && onEdit) {
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      onEdit(follower)
    })
  }

  const deleteBtn = card.querySelector<HTMLButtonElement>('.delete-card-btn')
  if (deleteBtn && onDelete) {
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      onDelete(follower.id)
    })
  }

  if (follower.isFavorite) {
    const aura = document.createElement('div')
    aura.className = 'aura aura-rainbow'
    aura.appendChild(card)
    return aura
  }

  return card
}
