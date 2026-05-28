interface Subject {
  id: string
  name: string
  desc: string
}

interface Avail {
  href: string
  meta: string
}

interface HubData {
  subjects: Subject[]
  availability: Record<string, Record<string, Avail>>
  defaultSem: string
}

function loadData(): HubData | null {
  const el = document.getElementById('hub-data')
  if (!el) return null
  return JSON.parse(el.textContent || 'null')
}

function renderGrid(data: HubData, sem: string) {
  const grid = document.getElementById('subject-grid')
  if (!grid) return

  grid.innerHTML = data.subjects
    .map((sub, i) => {
      const avail = data.availability[sem]?.[sub.id]
      const num = String(i + 1).padStart(2, '0')

      if (avail) {
        return `
          <a class="subject-card" href="${avail.href}" data-subject="${sub.id}">
            <span class="sc-num">${num}</span>
            <h2>${sub.name}</h2>
            <p class="sc-desc">${sub.desc}</p>
            <span class="sc-meta">${avail.meta}</span>
            <span class="sc-arrow" aria-hidden="true">&rarr;</span>
          </a>`
      }

      return `
        <div class="subject-card is-locked" data-subject="${sub.id}" aria-disabled="true">
          <span class="sc-num">${num}</span>
          <h2>${sub.name}</h2>
          <p class="sc-desc">${sub.desc}</p>
          <span class="sc-meta">Segera hadir</span>
        </div>`
    })
    .join('')
}

function init() {
  const data = loadData()
  if (!data) return

  const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('.sem-tab'))

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const sem = tab.dataset.sem
      if (!sem) return

      tabs.forEach(t => t.setAttribute('aria-pressed', String(t === tab)))
      renderGrid(data, sem)
    })
  })
}

init()
