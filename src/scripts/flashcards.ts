interface Flashcard {
  id: string;
  data: {
    deck: string;
    front: string;
    back: string;
    tags?: string[];
    difficulty?: string;
  };
}

let allCards: Flashcard[] = [];
let cards: Flashcard[] = [];
let currentIndex = 0;

function parseMd(text: string): string {
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  html = html
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');

  const lines = html.split('\n');
  const out: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^[-*]\s/.test(trimmed)) {
      if (!inList) { out.push('<ul>'); inList = true; }
      out.push(`<li>${trimmed.replace(/^[-*]\s/, '')}</li>`);
    } else {
      if (inList) { out.push('</ul>'); inList = false; }
      if (trimmed === '') continue;
      out.push(`<p>${trimmed}</p>`);
    }
  }
  if (inList) out.push('</ul>');

  return out.join('');
}

function renderStack(direction?: 'left' | 'right') {
  const stack = document.getElementById('card-stack')!;
  stack.innerHTML = '';

  const visible = Math.min(3, cards.length - currentIndex);

  for (let i = visible - 1; i >= 0; i--) {
    const card = cards[currentIndex + i];
    const el = document.createElement('div');
    el.className = 'card';
    el.dataset.depth = String(i);

    if (i === 0 && direction) {
      el.classList.add(direction === 'right' ? 'slide-in-right' : 'slide-in-left');
    }

    el.innerHTML = `
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
    `;

    if (i === 0) {
      el.addEventListener('click', (e) => {
        if (e.target === el || el.contains(e.target as Node)) {
          el.classList.toggle('flipped');
        }
      });
      initPointerTracking(el);
    }

    stack.appendChild(el);
  }

  document.getElementById('current')!.textContent = String(currentIndex + 1);
  document.getElementById('total')!.textContent = String(cards.length);
  updateNav();
}

function initPointerTracking(cardEl: HTMLElement) {
  cardEl.addEventListener('pointermove', (e) => {
    const rect = cardEl.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    cardEl.style.setProperty('--ptr-x', Math.max(-1, Math.min(1, x)).toFixed(3));
    cardEl.style.setProperty('--ptr-y', Math.max(-1, Math.min(1, y)).toFixed(3));
    cardEl.classList.add('tilt');
  });

  cardEl.addEventListener('pointerleave', () => {
    cardEl.style.setProperty('--ptr-x', '0');
    cardEl.style.setProperty('--ptr-y', '0');
    cardEl.classList.remove('tilt');
  });
}

function updateNav() {
  (document.getElementById('prev-btn') as HTMLButtonElement).disabled = currentIndex === 0;
  (document.getElementById('next-btn') as HTMLButtonElement).disabled = currentIndex >= cards.length - 1;
}

function goNext() {
  if (currentIndex >= cards.length - 1) return;
  const top = document.querySelector('.card[data-depth="0"]');
  if (top) top.classList.add('slide-out-left');
  currentIndex++;
  setTimeout(() => renderStack('right'), 200);
}

function goPrev() {
  if (currentIndex <= 0) return;
  const top = document.querySelector('.card[data-depth="0"]');
  if (top) top.classList.add('slide-out-right');
  currentIndex--;
  setTimeout(() => renderStack('left'), 200);
}

function flipCard() {
  const top = document.querySelector('.card[data-depth="0"]');
  if (top) top.classList.toggle('flipped');
}

function filterDeck(deck: string) {
  cards = allCards.filter(c => c.data.deck === deck);
  currentIndex = 0;
  renderStack();
}

function initKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goNext();
    else if (e.key === 'ArrowLeft') goPrev();
    else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      flipCard();
    }
  });
}

function loadCards(): Flashcard[] {
  const el = document.getElementById('flashcards-data');
  if (!el) return [];
  return JSON.parse(el.textContent || '[]');
}

function init() {
  allCards = loadCards();
  const deckSelect = document.getElementById('deck') as HTMLSelectElement;
  cards = allCards.filter(c => c.data.deck === deckSelect.value);

  renderStack();
  initKeyboard();

  document.getElementById('next-btn')!.addEventListener('click', goNext);
  document.getElementById('prev-btn')!.addEventListener('click', goPrev);
  deckSelect.addEventListener('change', () => filterDeck(deckSelect.value));
}

init();
