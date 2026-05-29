import { renderDiagrams } from './diagrams';

const doc = document, root = doc.documentElement;

const prog = doc.getElementById('progress')!;
const bt = doc.getElementById('backtop')!;
const tb = doc.getElementById('topbar')!;

function onScroll() {
  const st = root.scrollTop || doc.body.scrollTop;
  const sh = (root.scrollHeight - root.clientHeight) || 1;
  prog.style.width = (st / sh * 100) + '%';
  bt.classList.toggle('show', st > 520);
  tb.classList.toggle('stuck', st > 8);
}
doc.addEventListener('scroll', onScroll, { passive: true });
onScroll();
bt.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });

const btns = doc.querySelectorAll('.filterbtn');
const items = doc.querySelectorAll('.entry, .overview');
const dividers = doc.querySelectorAll('.topicdivider');
const search = doc.getElementById('search') as HTMLInputElement;

function topicOf(el: Element): string { return (el as HTMLElement).dataset.topic || ''; }

function applyFilter(f: string) {
  items.forEach(e => e.classList.toggle('hidden', f !== 'all' && topicOf(e) !== f));
  dividers.forEach(d => {
    d.classList.toggle('hidden', f !== 'all' && topicOf(d) !== f);
  });
}

btns.forEach(b => b.addEventListener('click', () => {
  btns.forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  if (search) search.value = '';
  applyFilter((b as HTMLElement).dataset.filter || 'all');
}));

if (search) search.addEventListener('input', function () {
  const q = this.value.trim().toLowerCase();
  if (q) {
    btns.forEach(x => x.classList.remove('active'));
    doc.querySelector('.filterbtn[data-filter="all"]')!.classList.add('active');
  }
  items.forEach(e => {
    const hit = !q || e.textContent!.toLowerCase().indexOf(q) >= 0;
    e.classList.toggle('hidden', !hit);
  });
  if (!q) applyFilter('all');
});

const reveals = doc.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(ents => {
    ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .06 });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add('in'));
}

const lb = doc.getElementById('lightbox')!;
const lbImg = doc.getElementById('lb-img') as HTMLImageElement;
const lbCap = doc.getElementById('lb-cap')!;
const lbClose = doc.getElementById('lb-close')!;
const lbStage = doc.getElementById('lb-stage')!;
let lastFocus: Element | null = null;

function openLB(src: string, cap: string) {
  lastFocus = doc.activeElement;
  lbImg.src = src; lbImg.alt = cap || ''; lbImg.classList.remove('zoom');
  lbCap.innerHTML = cap ? ('<b>Plat</b> ' + cap) : '';
  lb.classList.add('open'); doc.body.style.overflow = 'hidden'; lbClose.focus();
}

function closeLB() {
  lb.classList.remove('open'); lbImg.classList.remove('zoom');
  lbImg.removeAttribute('src'); doc.body.style.overflow = '';
  if (lastFocus && (lastFocus as HTMLElement).focus) (lastFocus as HTMLElement).focus();
}

doc.querySelectorAll('.plate-frame').forEach(btn => {
  btn.addEventListener('click', () => {
    const img = btn.querySelector('img')!;
    openLB(img.getAttribute('src')!, btn.getAttribute('data-cap') || '');
  });
});

lbImg.addEventListener('click', e => {
  e.stopPropagation();
  lbImg.classList.toggle('zoom');
  lbStage.scrollTo({ top: (lbStage.scrollHeight - lbStage.clientHeight) / 2, left: (lbStage.scrollWidth - lbStage.clientWidth) / 2 });
});

lbStage.addEventListener('click', e => { if (e.target === lbStage) closeLB(); });
lbClose.addEventListener('click', closeLB);
doc.addEventListener('keydown', e => { if (e.key === 'Escape' && lb.classList.contains('open')) closeLB(); });

renderDiagrams();
