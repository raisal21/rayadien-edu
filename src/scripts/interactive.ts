import { renderDiagrams } from './diagrams';

const doc = document, root = doc.documentElement;
let ac: AbortController | null = null;

function init() {
  if (ac) ac.abort();
  ac = new AbortController();
  const { signal } = ac;

  const prog = doc.getElementById('progress');
  const bt = doc.getElementById('backtop');
  const tb = doc.getElementById('topbar');

  if (prog && bt && tb) {
    doc.addEventListener('scroll', () => {
      const p = doc.getElementById('progress')!;
      const b = doc.getElementById('backtop')!;
      const t = doc.getElementById('topbar')!;
      const st = root.scrollTop || doc.body.scrollTop;
      const sh = (root.scrollHeight - root.clientHeight) || 1;
      p.style.width = (st / sh * 100) + '%';
      b.classList.toggle('show', st > 520);
      t.classList.toggle('stuck', st > 8);
    }, { passive: true, signal });

    const st = root.scrollTop || doc.body.scrollTop;
    const sh = (root.scrollHeight - root.clientHeight) || 1;
    prog.style.width = (st / sh * 100) + '%';
    bt.classList.toggle('show', st > 520);
    tb.classList.toggle('stuck', st > 8);

    bt.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, { signal });
  }

  const btns = doc.querySelectorAll('.filterbtn');
  const items = doc.querySelectorAll('.entry, .overview');
  const dividers = doc.querySelectorAll('.topicdivider');
  const search = doc.getElementById('search') as HTMLInputElement | null;

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
  }, { signal }));

  if (search) {
    search.addEventListener('input', function () {
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
    }, { signal });
  }

  const reveals = doc.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(ents => {
      ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .06 });
    reveals.forEach(el => io.observe(el));
    // cleanup IO on next init
    signal.addEventListener('abort', () => io.disconnect());
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  const lb = doc.getElementById('lightbox');
  const lbImg = doc.getElementById('lb-img') as HTMLImageElement | null;
  const lbCap = doc.getElementById('lb-cap');
  const lbClose = doc.getElementById('lb-close');
  const lbStage = doc.getElementById('lb-stage');
  let lastFocus: Element | null = null;

  function openLB(src: string, cap: string) {
    if (!lb || !lbImg || !lbCap || !lbClose) return;
    lastFocus = doc.activeElement;
    lbImg.src = src; lbImg.alt = cap || ''; lbImg.classList.remove('zoom');
    lbCap.innerHTML = cap ? ('<b>Gambar</b> ' + cap) : '';
    lb.classList.add('open'); doc.body.style.overflow = 'hidden'; lbClose.focus();
  }

  function closeLB() {
    if (!lb || !lbImg || !lbClose) return;
    lb.classList.remove('open'); lbImg.classList.remove('zoom');
    lbImg.removeAttribute('src'); doc.body.style.overflow = '';
    if (lastFocus && (lastFocus as HTMLElement).focus) (lastFocus as HTMLElement).focus();
  }

  doc.querySelectorAll('.plate-frame').forEach(btn => {
    btn.addEventListener('click', () => {
      const img = btn.querySelector('img');
      if (!img) return;
      openLB(img.getAttribute('src')!, btn.getAttribute('data-cap') || '');
    }, { signal });
  });

  if (lbImg && lbStage && lbClose && lb) {
    lbImg.addEventListener('click', e => {
      e.stopPropagation();
      lbImg.classList.toggle('zoom');
      lbStage.scrollTo({ top: (lbStage.scrollHeight - lbStage.clientHeight) / 2, left: (lbStage.scrollWidth - lbStage.clientWidth) / 2 });
    }, { signal });

    lbStage.addEventListener('click', e => { if (e.target === lbStage) closeLB(); }, { signal });
    lbClose.addEventListener('click', closeLB, { signal });
    doc.addEventListener('keydown', e => { if (e.key === 'Escape' && lb.classList.contains('open')) closeLB(); }, { signal });
  }

  renderDiagrams();
}

init();
document.addEventListener('astro:page-load', init);
