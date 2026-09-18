export interface ModalOptions {
  id?: string
  title: string
  description?: string
  content: HTMLElement
  onClose?: () => void
}

export interface ModalComponent {
  element: HTMLDialogElement
  open: () => void
  close: () => void
  setTitle: (title: string) => void
  setDescription: (description?: string) => void
}

export function createModal(options: ModalOptions): ModalComponent {
  const dialog = document.createElement('dialog')
  dialog.id = options.id || 'app-modal'
  dialog.className = 'modal'

  const modalBox = document.createElement('div')
  modalBox.className = 'modal-box w-full max-w-lg'

  // Top close button
  const closeForm = document.createElement('form')
  closeForm.method = 'dialog'
  const closeBtn = document.createElement('button')
  closeBtn.className = 'btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
  closeBtn.setAttribute('aria-label', 'Close modal')
  closeBtn.textContent = '✕'
  closeForm.appendChild(closeBtn)
  modalBox.appendChild(closeForm)

  // Title
  const title = document.createElement('h3')
  title.className = 'text-xl font-bold mb-1 text-left'
  title.textContent = options.title
  modalBox.appendChild(title)

  // Description
  const desc = document.createElement('p')
  desc.className = 'text-sm text-base-content/70 mb-5 text-left'
  if (options.description) {
    desc.textContent = options.description
  } else {
    desc.style.display = 'none'
  }
  modalBox.appendChild(desc)

  // Append provided content (e.g. the form)
  modalBox.appendChild(options.content)
  dialog.appendChild(modalBox)

  // Backdrop to close when clicking outside
  const backdropForm = document.createElement('form')
  backdropForm.method = 'dialog'
  backdropForm.className = 'modal-backdrop'
  const backdropBtn = document.createElement('button')
  backdropBtn.textContent = 'close'
  backdropForm.appendChild(backdropBtn)
  dialog.appendChild(backdropForm)

  if (options.onClose) {
    dialog.addEventListener('close', () => {
      options.onClose?.()
    })
  }

  return {
    element: dialog,
    open: () => dialog.showModal(),
    close: () => dialog.close(),
    setTitle: (newTitle: string) => {
      title.textContent = newTitle
    },
    setDescription: (newDesc?: string) => {
      if (newDesc) {
        desc.textContent = newDesc
        desc.style.display = ''
      } else {
        desc.textContent = ''
        desc.style.display = 'none'
      }
    },
  }
}
