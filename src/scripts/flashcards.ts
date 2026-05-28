import gsap from 'gsap'

interface Flashcard {
  id: string
  data: {
    deck: string
    front: string
    back: string
    tags?: string[]
    difficulty?: string
  }
}

let allCards: Flashcard[] = []
let cards: Flashcard[] = []
let currentIndex = 0

function parseMd(text: string): string {
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  html = html
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')

  const lines = html.split('\n')
  const out: string[] = []
  let inList = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (/^[-*]\s/.test(trimmed)) {
      if (!inList) { out.push('<ul>'); inList = true }
      out.push(`<li>${trimmed.replace(/^[-*]\s/, '')}</li>`)
    } else {
      if (inList) { out.push('</ul>'); inList = false }
      if (trimmed === '') continue
      out.push(`<p>${trimmed}</p>`)
    }
  }
  if (inList) out.push('</ul>')
  return out.join('')
}

function buildCardHTML(card: Flashcard): string {
  return `
    <div class="card-inner">
      <div class="card-face card-front">
        <div class="spotlight"></div>
        <div class="card-label">
          <span class="label-icon">?</span>
          Pertanyaan
        </div>
        <div class="card-body">
          <div class="card-content">${parseMd(card.data.front)}</div>
        </div>
      </div>
      <div class="card-face card-back">
        <div class="spotlight"></div>
        <div class="card-watermark">&#10003;</div>
        <div class="card-label">
          <span class="label-icon">&#10003;</span>
          Jawaban
        </div>
        <div class="card-body">
          <div class="card-content">${parseMd(card.data.back)}</div>
        </div>
      </div>
    </div>
    <button class="card-flip-btn" aria-label="Flip kartu" aria-pressed="false"></button>
  `
}

function renderStack(direction?: 'left' | 'right') {
  const stack = document.getElementById('card-stack')!
  stack.innerHTML = ''

  const visible = Math.min(3, cards.length - currentIndex)

  for (let i = visible - 1; i >= 0; i--) {
    const card = cards[currentIndex + i]
    const el = document.createElement('div')
    el.className = 'card'
    el.dataset.depth = String(i)
    el.dataset.active = 'true'
    el.innerHTML = buildCardHTML(card)

    if (i === 0) {
      const btn = el.querySelector('.card-flip-btn') as HTMLButtonElement
      btn.addEventListener('click', () => {
        if (el.dataset.active === 'false') return
        btn.ariaPressed = btn.matches('[aria-pressed="false"]') as any
      })

      gsap.from(el, {
        x: direction === 'left' ? -60 : direction === 'right' ? 60 : 0,
        opacity: 0,
        scale: 0.92,
        duration: 0.4,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      })
    }

    stack.appendChild(el)
  }

  document.getElementById('current')!.textContent = String(currentIndex + 1)
  document.getElementById('total')!.textContent = String(cards.length)
  updateNav()
}

function updateNav() {
  const prev = document.getElementById('prev-btn')! as HTMLButtonElement
  const next = document.getElementById('next-btn')! as HTMLButtonElement
  prev.disabled = currentIndex === 0
  next.disabled = currentIndex >= cards.length - 1
}

function goNext() {
  if (currentIndex >= cards.length - 1) return
  currentIndex++
  renderStack('right')
}

function goPrev() {
  if (currentIndex <= 0) return
  currentIndex--
  renderStack('left')
}

function flipCard() {
  const top = document.querySelector('.card[data-depth="0"]')
  if (!top) return
  const btn = top.querySelector('.card-flip-btn') as HTMLButtonElement
  if (!btn) return
  btn.ariaPressed = btn.matches('[aria-pressed="false"]') as any
}

function filterDeck(deck: string) {
  cards = allCards.filter(c => c.data.deck === deck)
  currentIndex = 0
  renderStack()
}

function initKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goNext()
    else if (e.key === 'ArrowLeft') goPrev()
    else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      flipCard()
    }
  })
}

function initPointerTracking() {
  document.body.addEventListener('pointermove', (e) => {
    const card = document.querySelector('.card[data-depth="0"]')
    if (!card) return

    const bounds = card.getBoundingClientRect()
    const posX = e.clientX - bounds.x
    const posY = e.clientY - bounds.y
    const ratioX = (posX / bounds.width - 0.5) * 2
    const ratioY = (posY / bounds.height - 0.5) * 2

    gsap.set(card, {
      '--pointer-x': gsap.utils.clamp(-1, 1, ratioX).toFixed(2),
      '--pointer-y': gsap.utils.clamp(-1, 1, ratioY).toFixed(2),
    })
  })
}

function loadCards(): Flashcard[] {
  const el = document.getElementById('flashcards-data')
  if (!el) return []
  return JSON.parse(el.textContent || '[]')
}

function init() {
  allCards = loadCards()
  const deckSelect = document.getElementById('deck') as HTMLSelectElement
  cards = allCards.filter(c => c.data.deck === deckSelect.value)

  renderStack()
  initKeyboard()
  initPointerTracking()

  document.getElementById('next-btn')!.addEventListener('click', goNext)
  document.getElementById('prev-btn')!.addEventListener('click', goPrev)
  deckSelect.addEventListener('change', () => filterDeck(deckSelect.value))
}

init()
