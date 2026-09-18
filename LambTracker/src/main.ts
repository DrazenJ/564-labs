import './style.css'
import { createModal } from './components/modal'
import { createFollowerForm } from './components/followerForm'
import { renderFollowerList } from './components/followerList'
import { getFollowers, saveFollower, deleteFollower, updateFollower } from './services/storage'
import type { Follower, FollowerFormData } from './types'

const followersContainer = document.querySelector<HTMLDivElement>('#followers-container')
const followerCountBadge = document.querySelector<HTMLSpanElement>('#follower-count')
const openModalBtn = document.querySelector<HTMLButtonElement>('#open-modal-btn')

let editingFollower: Follower | null = null

function refreshFollowers(): void {
  const followers = getFollowers()

  if (followerCountBadge) {
    followerCountBadge.textContent = `${followers.length} ${followers.length === 1 ? 'follower' : 'followers'}`
  }

  if (followersContainer) {
    renderFollowerList(
      followersContainer,
      followers,
      (id) => {
        deleteFollower(id)
        refreshFollowers()
      },
      (follower) => {
        openEditModal(follower)
      }
    )
  }
}

const form = createFollowerForm({
  onSubmit: (data: FollowerFormData) => {
    if (editingFollower) {
      const updatedFollower: Follower = {
        ...editingFollower,
        ...data,
      }
      updateFollower(updatedFollower)
    } else {
      const newFollower: Follower = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      }
      saveFollower(newFollower)
    }

    modal.close()
    form.reset()
    editingFollower = null
    refreshFollowers()
  },
  onCancel: () => {
    modal.close()
    editingFollower = null
    form.reset()
  },
})

const modal = createModal({
  id: 'registration_modal',
  title: 'Register follower',
  description: 'Fill in the details below to add an entry to the flock database.',
  content: form.element,
  onClose: () => {
    editingFollower = null
    form.reset()
  },
})

document.body.appendChild(modal.element)

function openRegisterModal(): void {
  editingFollower = null
  form.reset()
  modal.setTitle('Register follower')
  modal.setDescription('Fill in the details below to add an entry to the flock database.')
  form.setSubmitLabel('Submit')
  modal.open()
}

function openEditModal(follower: Follower): void {
  editingFollower = follower
  form.reset()
  form.setFormData(follower)
  modal.setTitle('Edit follower')
  modal.setDescription(`Edit details for ${follower.name}.`)
  form.setSubmitLabel('Save changes')
  modal.open()
}

if (openModalBtn) {
  openModalBtn.addEventListener('click', () => {
    openRegisterModal()
  })
}

// Initial load of followers from localStorage
refreshFollowers()

