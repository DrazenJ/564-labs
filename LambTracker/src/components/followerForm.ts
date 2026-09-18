import type { FollowerFormData, AnimalDefinition } from '../types'
import animalsData from '../data/animals.json'

const animals: AnimalDefinition[] = animalsData

const animalsByPack = animals.reduce<Record<string, AnimalDefinition[]>>((acc, animal) => {
  if (!acc[animal.pack]) {
    acc[animal.pack] = []
  }
  acc[animal.pack].push(animal)
  return acc
}, {})

const animalOptionsHtml = Object.entries(animalsByPack)
  .map(
    ([pack, packAnimals]) => `
        <optgroup label="${pack}">
          ${packAnimals.map((a) => `<option value="${a.id}">${a.name}</option>`).join('')}
        </optgroup>`
  )
  .join('')

export interface FollowerFormOptions {
  onSubmit: (data: FollowerFormData) => void
  onCancel?: () => void
}

export interface FollowerFormComponent {
  element: HTMLFormElement
  reset: () => void
  setFormData: (data: FollowerFormData) => void
  setSubmitLabel: (label: string) => void
}

export function createFollowerForm(options: FollowerFormOptions): FollowerFormComponent {
  const form = document.createElement('form')
  form.id = 'lamb-form'
  form.className = 'flex flex-col gap-4 w-full'

  form.innerHTML = `
    <label class="floating-label w-full">
      <input type="text" id="name" placeholder="Name" class="input w-full" required />
      <span>Name</span>
    </label>

    <label class="floating-label w-full">
      <input type="text" id="level" placeholder="Level" class="input w-full" required />
      <span>Level</span>
    </label>

    <label class="floating-label w-full">
      <select id="animal" class="select w-full" required>
        <option disabled selected value="">Select Animal</option>
        ${animalOptionsHtml}
      </select>
      <span>Animal</span>
    </label>

    <label class="floating-label w-full">
      <select id="outfit" class="select w-full" required>
        <option disabled selected value="">Select outfit</option>
        <option value="hat">Hat</option>
        <option value="boots">Boots</option>
        <option value="sweater">Sweater</option>
        <option value="shoes">Shoes</option>
      </select>
      <span>Outfit</span>
    </label>

    <label class="floating-label w-full">
      <input type="number" id="age" step="1" placeholder="Age (years)" class="input w-full" required />
      <span>Age (years)</span>
    </label>

    <label class="floating-label w-full">
      <select id="gift" class="select w-full" required>
        <option disabled selected value="">Select gift</option>
        <option value="necklace">Necklace</option>
        <option value="book">Book</option>
        <option value="skirt">Skirt</option>
        <option value="sacrifice">Sacrifice</option>
      </select>
      <span>Gift</span>
    </label>

    <label class="floating-label w-full">
      <select id="role" class="select w-full" required>
        <option disabled selected value="">Select role</option>
        <option value="worshipper">Worshipper</option>
        <option value="farmer">Farmer</option>
        <option value="lumberjack">Lumberjack</option>
        <option value="miner">Miner</option>
        <option value="missionary">Missionary</option>
        <option value="other">Other</option>
      </select>
      <span>Role</span>
    </label>

    <label class="label w-full flex items-center justify-between cursor-pointer">
      <span class="label-text font-medium">Is married</span>
      <input type="checkbox" class="toggle toggle-primary" id="isMarried" />
    </label>

    <label class="label w-full flex items-center justify-between cursor-pointer">
      <span class="label-text font-medium">Is favorite</span>
      <input type="checkbox" class="toggle toggle-warning" id="isFavorite" />
    </label>

    <label class="label w-full flex items-center justify-between cursor-pointer">
      <span class="label-text font-medium">Is dead</span>
      <input type="checkbox" class="toggle toggle-error" id="isDead" />
    </label>

    <div class="modal-action mt-2 flex justify-end gap-2">
      <button type="button" id="cancel-form-btn" class="btn">Cancel</button>
      <button type="submit" id="submit-form-btn" class="btn btn-primary">Submit</button>
    </div>
  `

  const nameInput = form.querySelector<HTMLInputElement>('#name')!
  const levelInput = form.querySelector<HTMLInputElement>('#level')!
  const animalSelect = form.querySelector<HTMLSelectElement>('#animal')!
  const outfitSelect = form.querySelector<HTMLSelectElement>('#outfit')!
  const ageInput = form.querySelector<HTMLInputElement>('#age')!
  const giftSelect = form.querySelector<HTMLSelectElement>('#gift')!
  const roleSelect = form.querySelector<HTMLSelectElement>('#role')!
  const isMarriedInput = form.querySelector<HTMLInputElement>('#isMarried')!
  const isFavoriteInput = form.querySelector<HTMLInputElement>('#isFavorite')!
  const isDeadInput = form.querySelector<HTMLInputElement>('#isDead')!
  const submitBtn = form.querySelector<HTMLButtonElement>('#submit-form-btn')!

  const setSelectValue = (select: HTMLSelectElement, value: string) => {
    const valLower = value.toLowerCase()
    const found = Array.from(select.options).find(
      (opt) => opt.value.toLowerCase() === valLower
    )
    if (found) {
      select.value = found.value
    } else {
      select.value = value
    }
  }

  const cancelBtn = form.querySelector<HTMLButtonElement>('#cancel-form-btn')
  if (cancelBtn && options.onCancel) {
    cancelBtn.addEventListener('click', () => {
      options.onCancel?.()
    })
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const data: FollowerFormData = {
      name: nameInput.value.trim(),
      level: levelInput.value.trim(),
      animal: animalSelect.value,
      outfit: outfitSelect.value,
      age: Number(ageInput.value) || 0,
      gift: giftSelect.value,
      role: roleSelect.value,
      isMarried: isMarriedInput.checked,
      isFavorite: isFavoriteInput.checked,
      isDead: isDeadInput.checked,
    }

    options.onSubmit(data)
  })

  return {
    element: form,
    reset: () => {
      form.reset()
      submitBtn.textContent = 'Submit'
    },
    setFormData: (data: FollowerFormData) => {
      nameInput.value = data.name || ''
      levelInput.value = data.level || ''
      setSelectValue(animalSelect, data.animal || '')
      setSelectValue(outfitSelect, data.outfit || '')
      ageInput.value = data.age !== undefined && data.age !== null ? String(data.age) : ''
      setSelectValue(giftSelect, data.gift || '')
      setSelectValue(roleSelect, data.role || '')
      isMarriedInput.checked = Boolean(data.isMarried)
      isFavoriteInput.checked = Boolean(data.isFavorite)
      isDeadInput.checked = Boolean(data.isDead)
    },
    setSubmitLabel: (label: string) => {
      submitBtn.textContent = label
    },
  }
}
