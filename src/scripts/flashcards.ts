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

type Direction = 'left' | 'right'

let allCards: Flashcard[] = []
let cards: Flashcard[] = []
let currentIndex = 0
let isTransitioning = false

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

function depthState(depth: number) {
  if (depth === 0) return { y: 0, scale: 1, opacity: 1, zIndex: 3 }
  if (depth === 1) return { y: -18, scale: 0.96, opacity: 0.52, zIndex: 2 }
  return { y: -36, scale: 0.92, opacity: 0.24, zIndex: 1 }
}

function attachFlipHandler(el: HTMLElement) {
  const btn = el.querySelector('.card-flip-btn') as HTMLButtonElement
  btn.addEventListener('click', () => {
    if (el.dataset.active === 'false' || isTransitioning) return
    toggleCardFlip(el)
  })
}

function createCardElement(cardIndex: number, depth: number, active = false) {
  const card = cards[cardIndex]
  const el = document.createElement('div')
  el.className = 'card'
  el.dataset.depth = String(depth)
  el.dataset.index = String(cardIndex)
  el.dataset.active = active ? 'true' : 'false'
  el.innerHTML = buildCardHTML(card)

  if (active) attachFlipHandler(el)
  return el
}

function getCardElementByIndex(cardIndex: number) {
  const stack = document.getElementById('card-stack')
  if (!stack) return null

  return Array.from(stack.querySelectorAll<HTMLElement>('.card'))
    .find(el => el.dataset.index === String(cardIndex)) ?? null
}

function renderStack(enterFrom?: Direction) {
  const stack = document.getElementById('card-stack')!
  stack.innerHTML = ''

  const total = cards.length
  if (total === 0) {
    document.getElementById('current')!.textContent = '0'
    document.getElementById('total')!.textContent = '0'
    updateProgress(0, 0)
    updateNav()
    return
  }

  const visible = Math.min(3, total)

  for (let i = visible - 1; i >= 0; i--) {
    const cardIndex = (currentIndex + i) % total
    const el = createCardElement(cardIndex, i, i === 0)

    if (i === 0 && enterFrom) {
      el.classList.add('is-entering')
      const side = enterFrom === 'right' ? 1 : -1

      gsap.fromTo(el,
        {
          x: side * 90,
          opacity: 0,
          scale: 0.92,
          rotateY: side * -22,
          rotateZ: side * 2,
        },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          rotateY: 0,
          rotateZ: 0,
          duration: 0.48,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          onComplete: () => el.classList.remove('is-entering'),
        }
      )
    }

    stack.appendChild(el)
  }

  document.getElementById('current')!.textContent = String(currentIndex + 1)
  document.getElementById('total')!.textContent = String(total)
  updateProgress(currentIndex + 1, total)
  updateNav()
}

function updateProgress(current: number, total: number) {
  const fill = document.getElementById('progress-fill')
  if (!fill) return
  const pct = total === 0 ? 0 : (current / total) * 100
  fill.style.width = `${pct}%`
}

function updateNav() {
  const prev = document.getElementById('prev-btn')! as HTMLButtonElement
  const next = document.getElementById('next-btn')! as HTMLButtonElement
  const disabled = cards.length <= 1 || isTransitioning
  prev.disabled = disabled
  next.disabled = disabled
}

function animateStackShuffle(direction: Direction, nextIndex: number) {
  const stack = document.getElementById('card-stack')!
  const visible = Math.min(3, cards.length)
  const side = direction === 'right' ? 1 : -1
  const top = stack.querySelector<HTMLElement>('.card[data-depth="0"]')

  if (!top) {
    currentIndex = nextIndex
    isTransitioning = false
    renderStack()
    return
  }

  let incoming = getCardElementByIndex(nextIndex)
  const createdIncoming = !incoming

  if (!incoming) {
    incoming = createCardElement(nextIndex, visible - 1, false)
    incoming.classList.add('is-shuffling')
    stack.appendChild(incoming)

    const start = depthState(visible - 1)
    gsap.set(incoming, {
      x: side * 90,
      y: start.y,
      scale: start.scale,
      opacity: start.opacity,
      rotateY: side * -24,
      rotateZ: side * 2,
      zIndex: start.zIndex,
    })
  }

  const movingCards = Array.from(stack.querySelectorAll<HTMLElement>('.card'))
  movingCards.forEach(el => {
    el.dataset.active = 'false'
    el.classList.add('is-shuffling')
  })
  top.classList.add('is-leaving')

  const inner = top.querySelector<HTMLElement>('.card-inner')
  gsap.killTweensOf([top, inner, incoming, ...movingCards])

  const topBackDepth = direction === 'right' ? visible - 1 : 1
  const topBack = depthState(topBackDepth)
  const tl = gsap.timeline({
    defaults: { overwrite: 'auto' },
    onComplete: () => {
      currentIndex = nextIndex
      isTransitioning = false
      renderStack()
    },
  })

  gsap.set(top, { zIndex: 5, transformOrigin: '50% 50%' })
  gsap.set(incoming, { zIndex: 4 })

  tl.to(top, {
    x: side * 238,
    y: 22,
    scale: 0.94,
    rotateY: side * -58,
    rotateZ: side * 7,
    duration: 0.34,
    ease: 'power2.inOut',
  }, 0)
    .to(top, {
      x: 0,
      y: topBack.y,
      scale: topBack.scale,
      opacity: topBack.opacity,
      rotateY: 0,
      rotateZ: 0,
      duration: 0.46,
      ease: 'power3.inOut',
      onStart: () => gsap.set(top, { zIndex: topBack.zIndex - 1 }),
    }, 0.30)
    .to(top, {
      '--flip-shadow': 0.28,
      duration: 0.26,
      repeat: 1,
      yoyo: true,
      ease: 'sine.inOut',
    }, 0)
    .to(incoming, {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      rotateY: 0,
      rotateZ: 0,
      duration: 0.62,
      ease: 'back.out(1.08)',
    }, createdIncoming ? 0.10 : 0.06)

  const otherCards = movingCards
    .filter(el => el !== top && el !== incoming)
    .sort((a, b) => Number(a.dataset.depth) - Number(b.dataset.depth))

  otherCards.forEach((el, index) => {
    const targetDepth = direction === 'right' ? index + 1 : Math.min(index + 2, 2)
    const state = depthState(targetDepth)

    tl.to(el, {
      x: 0,
      y: state.y,
      scale: state.scale,
      opacity: state.opacity,
      rotateY: 0,
      rotateZ: 0,
      zIndex: state.zIndex,
      duration: 0.52,
      ease: 'power3.inOut',
    }, 0.08)
  })
}

function changeCard(direction: Direction) {
  if (isTransitioning || cards.length <= 1) return

  const nextIndex = direction === 'right'
    ? (currentIndex + 1) % cards.length
    : (currentIndex - 1 + cards.length) % cards.length

  isTransitioning = true
  updateNav()
  animateStackShuffle(direction, nextIndex)
}

function goNext() {
  changeCard('right')
}

function goPrev() {
  changeCard('left')
}

function toggleCardFlip(card: Element) {
  const inner = card.querySelector('.card-inner') as HTMLElement | null
  const btn = card.querySelector('.card-flip-btn') as HTMLButtonElement | null
  if (!inner || !btn) return

  const nextFlipped = !card.classList.contains('is-flipped')
  card.classList.toggle('is-flipped', nextFlipped)
  card.classList.add('is-flipping')
  btn.setAttribute('aria-pressed', String(nextFlipped))

  gsap.killTweensOf(inner)
  gsap.to(inner, {
    rotateY: nextFlipped ? 180 : 0,
    duration: 0.72,
    ease: 'power3.inOut',
  })

  gsap.fromTo(card,
    { '--flip-shadow': 0.12 },
    {
      '--flip-shadow': 0.32,
      duration: 0.36,
      repeat: 1,
      yoyo: true,
      ease: 'sine.inOut',
      onComplete: () => card.classList.remove('is-flipping'),
    }
  )
}

function flipCard() {
  const top = document.querySelector('.card[data-depth="0"]')
  if (!top || isTransitioning) return
  toggleCardFlip(top)
}

function filterDeck(deck: string) {
  cards = deck === '__all__'
    ? allCards.slice()
    : allCards.filter(c => c.data.deck === deck)
  currentIndex = 0
  isTransitioning = false
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
    if (!card || isTransitioning) return

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

  // default = first option ("Semua kartu") → shows every card for the subject
  cards = deckSelect.value === '__all__'
    ? allCards.slice()
    : allCards.filter(c => c.data.deck === deckSelect.value)

  renderStack()
  initKeyboard()
  initPointerTracking()

  document.getElementById('next-btn')!.addEventListener('click', goNext)
  document.getElementById('prev-btn')!.addEventListener('click', goPrev)
  document.getElementById('flip-btn')!.addEventListener('click', flipCard)
  deckSelect.addEventListener('change', () => filterDeck(deckSelect.value))
}

init()
