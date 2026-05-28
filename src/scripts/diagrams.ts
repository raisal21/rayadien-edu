function esc(s: string): string {
  return (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function wrap(t: string, max: number): string[] {
  const w = t.split(' '), l: string[] = [];
  let c = '';
  for (const word of w) {
    if ((c + ' ' + word).trim().length > max) { if (c) l.push(c); c = word; }
    else c = (c + ' ' + word).trim();
  }
  if (c) l.push(c);
  return l;
}

function tspans(lines: string[], x: number, y: number, lh: number): string {
  return lines.map((l, i) => `<tspan x="${x}" y="${y + i * lh}">${esc(l)}</tspan>`).join('');
}

interface Color { fill: string; stroke: string }

const J: Color = { fill: '#fef3c7', stroke: '#d97706' };
const E: Color = { fill: '#d1fae5', stroke: '#059669' };
const N: Color = { fill: '#eef2ff', stroke: '#6366f1' };
const W: Color = { fill: '#e0f2fe', stroke: '#0ea5e9' };
const R: Color = { fill: '#fee2e2', stroke: '#ef4444' };

function node(x: number, y: number, w: number, h: number, title: string, info: string, col: Color, fs?: number): string {
  fs = fs || 13;
  const lines = wrap(title, Math.floor(w / (fs * 0.56)));
  const ty = y + h / 2 - (lines.length - 1) * (fs + 1) / 2 + fs / 2 - 1;
  return `<g class="hs" data-info="${esc(info)}">`
    + `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${col.fill}" stroke="${col.stroke}" stroke-width="1.6"/>`
    + `<text x="${x + w / 2}" y="${ty}" text-anchor="middle" font-size="${fs}" font-weight="600" fill="#1f2937">${tspans(lines, x + w / 2, ty, fs + 2)}</text></g>`;
}

function arrow(x1: number, y1: number, x2: number, y2: number, label?: string, col?: string): string {
  col = col || '#94a3b8';
  const m = label ? `<text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 - 5}" text-anchor="middle" font-size="11" fill="#475569" font-style="italic">${esc(label)}</text>` : '';
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="2" marker-end="url(#arr)"/>` + m;
}

function lead(x1: number, y1: number, x2: number, y2: number): string {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#9ca3af" stroke-width="1" stroke-dasharray="3 3"/>`;
}

function lbl(x: number, y: number, t: string, anchor?: string, col?: string, it?: boolean): string {
  return `<text x="${x}" y="${y}" text-anchor="${anchor || 'start'}" font-size="12" fill="${col || '#374151'}"${it ? ' font-style="italic"' : ''}>${esc(t)}</text>`;
}

function svg(w: number, h: number, body: string): string {
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">`
    + `<defs><marker id="arr" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="#94a3b8"/></marker></defs>` + body + '</svg>';
}

type DiagramFn = () => string;

const D: Record<string, DiagramFn> = {};

D['jamur-ciri'] = () => {
  const items = [
    ['Eukariotik', 'Eukariotik — sel punya membran inti sejati.'],
    ['Tak berklorofil', 'Tak berklorofil — tidak bisa fotosintesis, jadi heterotrof (makan dengan absorpsi).'],
    ['Dinding kitin', 'Dinding sel kitin — bukan selulosa seperti tumbuhan; ciri khas jamur.'],
    ['Hifa → miselium', 'Tubuh dari hifa (benang halus) yang menyusun miselium.'],
    ['Cadangan glikogen', 'Cadangan makanan berupa glikogen (bukan amilum/pati).'],
    ['Habitat lembap', 'Hidup di tempat lembap & kaya bahan organik.']
  ];
  let b = '';
  for (let i = 0; i < 6; i++) { const c = i % 3, r = (i / 3) | 0; b += node(20 + c * 190, 20 + r * 110, 170, 86, items[i][0], items[i][1], J, 15); }
  return svg(600, 250, b);
};

D['struktur-jamur'] = () => {
  let b = '';
  b += '<g class="hs" data-info="Tudung — bagian atas; permukaan bawahnya ada himenium, lapisan penghasil spora.">'
    + `<path d="M150 165 Q300 55 450 165 Q300 120 150 165 Z" fill="${J.fill}" stroke="${J.stroke}" stroke-width="2"/></g>`;
  b += '<g class="hs" data-info="Lamela/Himenium — bilah di bawah tudung; tempat pembentukan & pelepasan spora.">';
  for (let x = 185; x <= 415; x += 14) b += `<line x1="${x}" y1="166" x2="${x + 4}" y2="182" stroke="${J.stroke}" stroke-width="1.4"/>`;
  b += '<rect x="180" y="163" width="240" height="22" fill="transparent"/></g>';
  b += `<g class="hs" data-info="Tangkai (stipe) — silinder penopang tudung."><rect x="278" y="182" width="44" height="170" rx="8" fill="#fde68a" stroke="${J.stroke}" stroke-width="2"/></g>`;
  b += `<g class="hs" data-info="Cincin (annulus) — sisa selubung parsial yang melingkari tangkai; tidak semua jamur punya."><ellipse cx="300" cy="240" rx="40" ry="9" fill="#fbbf24" stroke="${J.stroke}" stroke-width="1.6"/></g>`;
  b += '<g class="hs" data-info="Hifa & Miselium — benang halus penyerap makanan; kumpulannya = miselium.">';
  for (let k = 0; k < 7; k++) { const hx = 300 + (k - 3) * 26; b += `<path d="M300 352 Q${hx} 380 ${hx + (k - 3) * 8} 410" fill="none" stroke="#a16207" stroke-width="1.6"/>`; }
  b += '<rect x="200" y="352" width="200" height="60" fill="transparent"/></g>';
  b += lead(440, 120, 520, 110) + lbl(524, 113, 'Tudung', 'start', '#92400e');
  b += lead(415, 176, 520, 176) + lbl(524, 180, 'Lamela (spora)', 'start', '#92400e');
  b += lead(322, 250, 430, 255) + lbl(434, 258, 'Cincin', 'start', '#92400e');
  b += lead(322, 300, 430, 305) + lbl(434, 308, 'Tangkai', 'start', '#92400e');
  b += lead(360, 395, 470, 395) + lbl(474, 398, 'Hifa/Miselium', 'start', '#92400e');
  return svg(600, 430, b);
};

D['hifa-septa'] = () => {
  let b = '';
  b += lbl(20, 30, '1. Hifa BERSEKAT (septat) — Ascomycota, Basidiomycota, Deuteromycota', 'start', '#92400e');
  b += `<g class="hs" data-info="Hifa bersekat (septat) — ada sekat antar sel; tiap sel berinti. Contoh: Ascomycota & Basidiomycota."><rect x="20" y="44" width="500" height="46" rx="8" fill="${J.fill}" stroke="${J.stroke}" stroke-width="1.6"/>`;
  for (let x = 90; x < 520; x += 70) b += `<line x1="${x}" y1="44" x2="${x}" y2="90" stroke="${J.stroke}" stroke-width="1.6"/>`;
  for (let cx = 55; cx < 520; cx += 70) b += `<circle cx="${cx}" cy="67" r="6" fill="#a16207"/>`;
  b += '</g>' + lbl(530, 70, 'sekat', 'start', '#6b7280', true);
  b += lbl(20, 135, '2. Hifa TIDAK BERSEKAT (asepta / senositik) — Zygomycota', 'start', '#92400e');
  b += `<g class="hs" data-info="Hifa tidak bersekat (senositik) — tanpa sekat; banyak inti tersebar dalam satu sitoplasma. Contoh: Zygomycota."><rect x="20" y="150" width="500" height="46" rx="8" fill="#fef9c3" stroke="${J.stroke}" stroke-width="1.6"/>`;
  for (let cx2 = 50; cx2 < 520; cx2 += 34) b += `<circle cx="${cx2}" cy="173" r="5" fill="#a16207"/>`;
  b += '</g>' + lbl(530, 176, 'inti banyak', 'start', '#6b7280', true);
  return svg(600, 215, b);
};

D['cara-hidup'] = () => {
  const it: [string, string, Color][] = [
    ['Saprofit', 'Saprofit (pengurai) — makan dari sisa makhluk hidup yang sudah MATI. Contoh: Rhizopus, Aspergillus.', J],
    ['Parasit', 'Parasit — hidup di organisme lain & MERUGIKAN inang (hifa khusus haustoria). Contoh: Puccinia, Trichophyton.', R],
    ['Mutualisme', 'Simbiosis mutualisme — SALING menguntungkan. Contoh: Lichen (jamur+alga), Mikoriza (jamur+akar).', E],
    ['Predasi', 'Predasi — menangkap & memakan organisme lain. Contoh: Arthrobotrys menjebak nematoda.', N]
  ];
  let b = '';
  for (let i = 0; i < 4; i++) { const c = i % 2, r = (i / 2) | 0; b += node(30 + c * 290, 20 + r * 120, 270, 96, it[i][0], it[i][1], it[i][2], 16); }
  return svg(620, 270, b);
};

D['divisi-jamur'] = () => {
  const it = [
    ['Zygomycota', 'Zygomycota — hifa TIDAK bersekat; spora seksual ZIGOSPORA; aseksual sporangiospora. Contoh: Rhizopus, Mucor.'],
    ['Ascomycota', 'Ascomycota — hifa bersekat; spora seksual ASKOSPORA dalam ASKUS; aseksual konidia/tunas. Contoh: Saccharomyces, Penicillium.'],
    ['Basidiomycota', 'Basidiomycota — makroskopis; BASIDIOSPORA pada BASIDIUM; tubuh buah basidiokarp. Contoh: Volvariella, Pleurotus.'],
    ['Deuteromycota', 'Deuteromycota — "jamur tidak sempurna"; reproduksi seksual BELUM diketahui; aseksual konidia. Contoh: Trichophyton, Candida.']
  ];
  const sp = ['zigospora', 'askospora', 'basidiospora', 'belum diketahui'];
  let b = '';
  for (let i = 0; i < 4; i++) { const x = 15 + i * 153; b += node(x, 20, 143, 120, it[i][0], it[i][1], J, 14); b += `<text x="${x + 71}" y="160" text-anchor="middle" font-size="11" fill="#92400e" font-style="italic">${esc(sp[i])}</text>`; }
  return svg(640, 180, b);
};

D['repro-aseksual'] = () => {
  let b = lbl(300, 22, 'Reproduksi ASEKSUAL (tanpa peleburan inti · mitosis)', 'middle', '#92400e');
  b += node(20, 45, 180, 90, 'Spora aseksual', 'Spora aseksual — sporangiospora (Rhizopus) & konidia (Aspergillus, Penicillium). Dihasilkan lewat mitosis.', J, 14);
  b += node(215, 45, 170, 90, 'Tunas (budding)', 'Tunas/budding — sel baru tumbuh dari tubuh induk. Contoh: Saccharomyces cerevisiae (ragi).', J, 14);
  b += node(400, 45, 180, 90, 'Fragmentasi', 'Fragmentasi — miselium terputus, tiap potongan tumbuh jadi individu baru.', J, 14);
  return svg(600, 150, b);
};

D['repro-seksual'] = () => {
  const steps = [
    ['Plasmogami', 'Plasmogami — peleburan SITOPLASMA dua hifa.'],
    ['Dikariotik', 'Dikariotik — dua inti hidup berdampingan (belum melebur).'],
    ['Kariogami', 'Kariogami — peleburan INTI menjadi satu (diploid).'],
    ['Meiosis', 'Meiosis — menghasilkan spora seksual (zigo/asko/basidiospora).']
  ];
  let b = '';
  for (let i = 0; i < 4; i++) { const x = 18 + i * 150; b += node(x, 40, 128, 70, steps[i][0], steps[i][1], N, 13); if (i < 3) b += arrow(x + 128, 75, x + 150, 75); }
  b += lbl(300, 24, 'Tahap reproduksi SEKSUAL (ada peleburan inti)', 'middle', '#3730a3');
  b += lbl(300, 130, '→ hasil: Zigospora · Askospora · Basidiospora', 'middle', '#6b7280', true);
  return svg(640, 145, b);
};

D['siklus-basidio'] = () => {
  const cx = 300, cy = 215, rad = 140;
  const nodes2 = [
    ['Basidiospora (n)', 'Spora haploid (n) jatuh dari bilah & berkecambah.', -90],
    ['Miselium monokariotik (n)', 'Hifa berkumpul jadi miselium monokariotik — 1 inti/sel, haploid (n).', -18],
    ['Plasmogami → Dikariotik (n+n)', 'Dua miselium (+/−) lebur sitoplasma → miselium dikariotik (n+n), tumbuh dominan.', 54],
    ['Basidiokarp + Kariogami → Zigot (2n)', 'Tubuh buah terbentuk; di basidium dua inti lebur (kariogami) → zigot DIPLOID (2n), fase singkat.', 126],
    ['Meiosis → 4 basidiospora (n)', 'Zigot 2n meiosis → 4 basidiospora haploid (n) → menyebar → siklus berulang.', 198]
  ];
  let b = `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="#e5e7eb" stroke-width="2" stroke-dasharray="5 5"/>`;
  b += lbl(cx, cy - 6, 'Siklus', 'middle', '#9ca3af') + lbl(cx, cy + 12, 'Basidiomycota', 'middle', '#9ca3af');
  const pts: [number, number][] = [];
  for (let i = 0; i < 5; i++) { const a = nodes2[i][2] * Math.PI / 180; pts.push([cx + rad * Math.cos(a), cy + rad * Math.sin(a)]); }
  for (let i = 0; i < 5; i++) {
    const p = pts[i], q = pts[(i + 1) % 5];
    const dx = q[0] - p[0], dy = q[1] - p[1], len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len, uy = dy / len;
    b += arrow(p[0] + ux * 52, p[1] + uy * 22, q[0] - ux * 52, q[1] - uy * 22);
  }
  for (let i = 0; i < 5; i++) { const p = pts[i]; b += node(p[0] - 72, p[1] - 30, 144, 60, nodes2[i][0], nodes2[i][1], J, 11); }
  return svg(600, 430, b);
};

D['bioteknologi'] = () => {
  const it = [
    ['Tempe', 'Tempe — Rhizopus oligosporus/oryzae; hifa mengikat kedelai jadi padat.'],
    ['Kecap', 'Kecap — Aspergillus wentii/oryzae; rombak protein kedelai jadi asam amino (gurih).'],
    ['Tapai', 'Tapai — Saccharomyces cerevisiae; pati → gula → alkohol + CO₂.'],
    ['Roti', 'Roti — Saccharomyces cerevisiae; CO₂ bikin adonan mengembang.'],
    ['Oncom', 'Oncom — Neurospora sitophila (merah) / Rhizopus oligosporus (hitam).'],
    ['Keju biru', 'Keju biru — Penicillium roqueforti / camemberti; corak biru-hijau & aroma khas.']
  ];
  let b = '';
  for (let i = 0; i < 6; i++) { const c = i % 3, r = (i / 3) | 0; b += node(20 + c * 195, 20 + r * 100, 175, 80, it[i][0], it[i][1], J, 15); }
  b += lbl(300, 196, '+ Penisilin (Penicillium notatum) · Asam sitrat (Aspergillus niger)', 'middle', '#6b7280', true);
  return svg(620, 210, b);
};

D['penyakit-jamur'] = () => {
  let b = '';
  b += node(15, 30, 190, 150, 'Pada Manusia', 'Manusia — Candida albicans (sariawan/keputihan), Malassezia (panu/ketombe), Trichophyton/Microsporum/Epidermophyton (kurap, kutu air).', R, 15);
  b += node(220, 30, 190, 150, 'Pada Tumbuhan', 'Tumbuhan — Puccinia graminis (karat), Ustilago maydis (gosong jagung), Colletotrichum (antraknosa).', R, 15);
  b += node(425, 30, 190, 150, 'Pada Hewan', 'Hewan — Aspergillus fumigatus (aspergilosis/napas), Saprolegnia (jamur putih ikan), Trichophyton (kurap ternak).', R, 15);
  return svg(630, 200, b);
};

D['komponen-eko'] = () => {
  let b = node(235, 16, 170, 52, 'EKOSISTEM', 'Ekosistem = komponen biotik (hidup) + abiotik (tak hidup) yang saling berinteraksi.', E, 16);
  b += arrow(290, 68, 170, 96) + arrow(350, 68, 470, 96);
  b += node(60, 96, 220, 56, 'BIOTIK (makhluk hidup)', 'Biotik — semua makhluk hidup: produsen, konsumen, dekomposer, detritivor.', E, 14);
  b += node(360, 96, 220, 56, 'ABIOTIK (tak hidup)', 'Abiotik — cahaya matahari, air, tanah, udara, suhu, pH, mineral, kelembapan.', W, 14);
  const bio = ['Produsen', 'Konsumen', 'Dekomposer', 'Detritivor'];
  const bioInfo: Record<string, string> = { Produsen: 'autotrof, fotosintesis.', Konsumen: 'heterotrof, makan organisme lain.', Dekomposer: 'urai sisa jadi zat anorganik.', Detritivor: 'makan serpihan organik.' };
  for (let i = 0; i < 4; i++) b += node(20 + i * 68, 170, 62, 46, bio[i], bio[i] + ' — ' + bioInfo[bio[i]], E, 10);
  b += lbl(470, 178, 'cahaya, air, tanah,', 'middle', '#0c4a6e') + lbl(470, 194, 'udara, suhu, pH,', 'middle', '#0c4a6e') + lbl(470, 210, 'mineral, kelembapan', 'middle', '#0c4a6e');
  return svg(600, 230, b);
};

D['peran-biotik'] = () => {
  const it = [
    ['Produsen', 'Produsen — autotrof; buat makanan sendiri via fotosintesis (tumbuhan hijau, alga).'],
    ['Konsumen', 'Konsumen — heterotrof; herbivora/karnivora/omnivora.'],
    ['Dekomposer', 'Dekomposer — urai makhluk mati jadi zat anorganik (jamur, bakteri).'],
    ['Detritivor', 'Detritivor — makan serpihan organik/detritus (cacing tanah, rayap, kaki seribu).']
  ];
  let b = '';
  for (let i = 0; i < 4; i++) { const x = 15 + i * 150; b += node(x, 40, 135, 80, it[i][0], it[i][1], E, 14); if (i < 3) b += arrow(x + 135, 80, x + 150, 80, '', '#10b981'); }
  b += lbl(300, 24, 'Aliran energi: Produsen → Konsumen → (Dekomposer)', 'middle', '#047857');
  return svg(640, 135, b);
};

D['interaksi'] = () => {
  const it: [string, string, string, Color][] = [
    ['Mutualisme', '(+/+)', 'Mutualisme (+/+) — dua-duanya untung. Contoh: kupu-kupu & bunga.', E],
    ['Komensalisme', '(+/0)', 'Komensalisme (+/0) — satu untung, satu tak terpengaruh. Contoh: anggrek & pohon.', E],
    ['Parasitisme', '(+/−)', 'Parasitisme (+/−) — parasit untung, inang rugi. Contoh: nyamuk & manusia.', R],
    ['Predasi', '(+/−)', 'Predasi (+/−) — predator memburu & memakan mangsa. Contoh: harimau & rusa.', R],
    ['Kompetisi', '(−/−)', 'Kompetisi (−/−) — rebutan sumber daya terbatas. Contoh: padi & gulma.', R],
    ['Netralisme', '(0/0)', 'Netralisme (0/0) — satu wilayah, tak saling pengaruh. Contoh: ayam & kambing.', N],
    ['Amensalisme', '(−/0)', 'Amensalisme (−/0) — satu rugi, satu tak terpengaruh. Contoh: Penicillium & bakteri.', R]
  ];
  let b = '';
  for (let i = 0; i < 7; i++) {
    const c = i % 2, r = (i / 2) | 0;
    const x = 20 + c * 295, y = 18 + r * 78;
    b += `<g class="hs" data-info="${esc(it[i][2])}"><rect x="${x}" y="${y}" width="275" height="64" rx="10" fill="${it[i][3].fill}" stroke="${it[i][3].stroke}" stroke-width="1.6"/><text x="${x + 16}" y="${y + 38}" font-size="15" font-weight="700" fill="#1f2937">${esc(it[i][0])}</text><text x="${x + 259}" y="${y + 38}" text-anchor="end" font-size="15" font-family="monospace" font-weight="700" fill="#334155">${esc(it[i][1])}</text></g>`;
  }
  return svg(620, 330, b);
};

D['rantai-trofik'] = () => {
  const org = [
    ['Rumput', 'Trofik I', 'Trofik I — Produsen. Membuat makanan sendiri (fotosintesis).'],
    ['Belalang', 'Trofik II', 'Trofik II — Konsumen I (herbivora). Pemakan produsen.'],
    ['Katak', 'Trofik III', 'Trofik III — Konsumen II (karnivora rendah). Pemakan konsumen I.'],
    ['Ular', 'Trofik IV', 'Trofik IV — Konsumen III / puncak. Predator teratas.'],
    ['Elang', 'Puncak', 'Konsumen puncak — tak punya predator alami.']
  ];
  let b = '';
  for (let i = 0; i < 5; i++) { const x = 14 + i * 128; b += node(x, 70, 108, 58, org[i][0], org[i][2], E, 15); b += `<text x="${x + 54}" y="150" text-anchor="middle" font-size="11" font-weight="700" fill="#047857">${esc(org[i][1])}</text>`; if (i < 4) b += arrow(x + 108, 99, x + 128, 99, '', '#10b981'); }
  b += lbl(330, 32, 'Hitung dari PRODUSEN (Trofik I) ke atas', 'middle', '#047857');
  return svg(660, 165, b);
};

D['jaring-jaring'] = () => {
  const P: Record<string, [number, number]> = {
    Rumput: [60, 250], Sawi: [60, 120], Belalang: [230, 300], Tikus: [250, 160], Ulat: [230, 60],
    Katak: [420, 290], Burung: [440, 130], Ular: [560, 230], Elang: [560, 70]
  };
  const edges: [string, string][] = [['Rumput', 'Belalang'], ['Rumput', 'Tikus'], ['Sawi', 'Ulat'], ['Sawi', 'Tikus'],
    ['Belalang', 'Katak'], ['Ulat', 'Burung'], ['Tikus', 'Ular'], ['Tikus', 'Burung'],
    ['Katak', 'Ular'], ['Burung', 'Elang'], ['Ular', 'Elang']];
  const info: Record<string, string> = { Rumput: 'Produsen.', Sawi: 'Produsen.', Belalang: 'Konsumen I (herbivora).', Ulat: 'Konsumen I (herbivora).', Tikus: 'Konsumen I/omnivora — banyak jalur.', Katak: 'Konsumen II.', Burung: 'Konsumen II — bisa makan ulat atau tikus.', Ular: 'Konsumen III.', Elang: 'Konsumen puncak — bisa makan ular atau burung.' };
  let b = '';
  for (const [from, to] of edges) { const a = P[from], c = P[to]; b += arrow(a[0] + 44, a[1], c[0] - 44, c[1], '', '#10b981'); }
  for (const k of Object.keys(P)) { const p = P[k]; b += node(p[0] - 44, p[1] - 20, 88, 40, k, k + ' — ' + info[k], E, 13); }
  b += lbl(310, 20, 'Jaring-jaring: banyak rantai tumpang tindih → 1 organisme bisa banyak jalur', 'middle', '#047857');
  return svg(640, 360, b);
};

D['piramida'] = () => {
  const lv: [string, string, number, number, number][] = [
    ['Produsen — 10.000 kkal', 'Trofik I (Produsen) — energi terbesar, dasar piramida.', 300, 40, 260],
    ['Konsumen I — 1.000 kkal', 'Trofik II — terima ~10% energi dari produsen.', 300, 95, 200],
    ['Konsumen II — 100 kkal', 'Trofik III — ~10% dari konsumen I.', 300, 150, 140],
    ['Konsumen III — 10 kkal', 'Trofik IV — ~10% dari konsumen II; energi terkecil.', 300, 205, 80]
  ];
  let b = '';
  const cols = ['#34d399', '#10b981', '#059669', '#047857'];
  for (let i = 0; i < 4; i++) {
    const cx = lv[i][2], y = lv[i][3], half = lv[i][4] / 2;
    b += `<g class="hs" data-info="${esc(lv[i][1])}"><rect x="${cx - half}" y="${y}" width="${half * 2}" height="48" rx="4" fill="${cols[i]}" stroke="#065f46" stroke-width="1.4"/><text x="${cx}" y="${y + 29}" text-anchor="middle" font-size="12.5" font-weight="600" fill="#fff">${esc(lv[i][0])}</text></g>`;
  }
  for (let i = 0; i < 3; i++) b += `<text x="500" y="${lv[i][3] + 58}" font-size="12" fill="#b45309" font-weight="700">↓ ×10%</text>`;
  b += lbl(300, 22, 'Piramida ENERGI — selalu tegak · hukum 10%', 'middle', '#047857');
  b += lbl(560, 40, 'Jenis lain:', 'start', '#6b7280', true);
  b += '<g class="hs" data-info="Piramida JUMLAH — hitung jumlah individu; bisa terbalik (1 pohon, banyak ulat)."><rect x="540" y="48" width="90" height="34" rx="6" fill="#ecfccb" stroke="#65a30d"/><text x="585" y="69" text-anchor="middle" font-size="11" fill="#3f6212">Jumlah</text></g>';
  b += '<g class="hs" data-info="Piramida BIOMASSA — berat kering; darat tegak, perairan bisa terbalik (fitoplankton<zooplankton)."><rect x="540" y="90" width="90" height="34" rx="6" fill="#cffafe" stroke="#0891b2"/><text x="585" y="111" text-anchor="middle" font-size="11" fill="#155e75">Biomassa</text></g>';
  return svg(660, 280, b);
};

const DAUR: Record<string, DiagramFn> = {};

DAUR.air = () => {
  let b = lbl(300, 20, 'Siklus Air (Hidrologi)', 'middle', '#0369a1');
  b += node(40, 150, 120, 56, 'Laut / Air', 'Sumber air permukaan — menguap oleh energi matahari.', W, 13);
  b += node(240, 40, 120, 56, 'Awan', 'Uap air mengembun (kondensasi) jadi awan.', W, 13);
  b += node(450, 150, 120, 56, 'Tanah / Tumbuhan', 'Air meresap & diserap tumbuhan; sebagian run-off ke laut.', E, 12);
  b += arrow(120, 150, 250, 96, 'evaporasi', '#0ea5e9');
  b += arrow(355, 96, 470, 150, 'presipitasi (hujan)', '#0ea5e9');
  b += arrow(450, 185, 160, 185, 'run-off / aliran', '#0ea5e9');
  b += lbl(300, 235, 'transpirasi = penguapan dari tumbuhan', 'middle', '#6b7280', true);
  return svg(600, 250, b);
};

DAUR.karbon = () => {
  let b = lbl(300, 20, 'Siklus Karbon–Oksigen', 'middle', '#374151');
  b += node(230, 36, 140, 52, 'CO₂ atmosfer', 'Karbon dioksida di udara — diserap tumbuhan, dilepas oleh respirasi & pembakaran.', N, 13);
  b += node(40, 170, 140, 56, 'Tumbuhan', 'Fotosintesis: serap CO₂ → hasilkan O₂ & glukosa.', E, 13);
  b += node(420, 170, 140, 56, 'Hewan / Manusia', 'Respirasi: pakai O₂ → lepas CO₂.', J, 13);
  b += arrow(240, 80, 120, 170, 'fotosintesis', '#059669');
  b += arrow(180, 198, 420, 198, 'dimakan', '#94a3b8');
  b += arrow(480, 170, 360, 80, 'respirasi', '#b45309');
  b += node(250, 170, 120, 56, 'Pembakaran fosil', 'Pembakaran bahan bakar fosil menambah CO₂ ke atmosfer.', R, 11);
  b += arrow(310, 170, 300, 90, '', '#ef4444');
  return svg(600, 250, b);
};

DAUR.nitrogen = () => {
  let b = lbl(300, 18, 'Siklus Nitrogen', 'middle', '#047857');
  b += node(230, 34, 140, 48, 'N₂ atmosfer', 'Nitrogen bebas (78% udara) — tak bisa langsung dipakai makhluk hidup.', N, 13);
  b += node(30, 150, 130, 52, 'Amonia (NH₃)', 'Hasil fiksasi N₂ oleh bakteri Rhizobium / petir.', E, 12);
  b += node(230, 150, 130, 52, 'Nitrat (NO₃⁻)', 'Bentuk yang diserap tumbuhan; hasil nitrifikasi (bantuan Nitrobacter).', E, 12);
  b += node(430, 150, 140, 52, 'Tumbuhan & Hewan', 'Nitrat diserap tumbuhan → masuk rantai makanan.', E, 12);
  b += arrow(255, 82, 95, 150, 'fiksasi', '#059669');
  b += arrow(160, 176, 230, 176, 'nitrifikasi', '#059669');
  b += arrow(360, 176, 430, 176, 'asimilasi', '#94a3b8');
  b += arrow(430, 150, 330, 82, 'denitrifikasi → N₂', '#b45309');
  return svg(600, 225, b);
};

DAUR.fosfor = () => {
  let b = lbl(300, 20, 'Siklus Fosfor (tidak lewat atmosfer)', 'middle', '#7c3aed');
  b += node(30, 90, 120, 56, 'Batuan', 'Sumber utama fosfor; melapuk perlahan.', N, 13);
  b += node(190, 90, 120, 56, 'Fosfat tanah/air', 'Fosfat terlarut — diserap tumbuhan.', E, 12);
  b += node(350, 40, 120, 56, 'Tumbuhan', 'Serap fosfat untuk tumbuh.', E, 13);
  b += node(350, 150, 120, 56, 'Hewan', 'Dapat fosfor lewat rantai makanan.', J, 13);
  b += node(190, 200, 120, 52, 'Dekomposer', 'Uraikan sisa mati → fosfat kembali ke tanah.', E, 12);
  b += arrow(150, 118, 190, 118, 'pelapukan', '#7c3aed');
  b += arrow(310, 110, 350, 80, 'diserap', '#94a3b8');
  b += arrow(410, 96, 410, 150, 'dimakan', '#94a3b8');
  b += arrow(350, 185, 310, 210, 'mati', '#94a3b8');
  b += arrow(190, 220, 150, 146, 'kembali', '#10b981');
  return svg(600, 265, b);
};

function showInfo(host: HTMLElement, info: HTMLElement, g: Element) {
  host.querySelectorAll('.hs.sel').forEach(x => x.classList.remove('sel'));
  g.classList.add('sel');
  const t = g.getAttribute('data-info') || '', i = t.indexOf('—');
  info.innerHTML = i > 0 ? ('<b>' + esc(t.slice(0, i)) + '</b>' + esc(t.slice(i))) : esc(t);
  info.classList.add('show');
}

function wire(host: HTMLElement, info: HTMLElement) {
  host.addEventListener('click', (e) => {
    const g = (e.target as Element).closest('.hs');
    if (g && host.contains(g)) showInfo(host, info, g);
  });
}

function buildDaur(host: HTMLElement, info: HTMLElement) {
  const tabs: [string, string][] = [['nitrogen', 'Nitrogen'], ['karbon', 'Karbon'], ['air', 'Air'], ['fosfor', 'Fosfor']];
  const bar = document.createElement('div'); bar.className = 'svg-tabs';
  const holder = document.createElement('div');
  tabs.forEach((t, idx) => {
    const btn = document.createElement('button');
    btn.className = 'svg-tab' + (idx === 0 ? ' active' : '');
    btn.textContent = t[1];
    btn.addEventListener('click', () => {
      bar.querySelectorAll('.svg-tab').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      holder.innerHTML = DAUR[t[0]]();
      info.classList.remove('show');
    });
    bar.appendChild(btn);
  });
  holder.innerHTML = DAUR.nitrogen();
  host.appendChild(bar); host.appendChild(holder);
}

export function renderDiagrams() {
  if (!document.getElementById('diag-style')) {
    const st = document.createElement('style'); st.id = 'diag-style';
    st.textContent = '.hs.sel rect,.hs.sel path,.hs.sel ellipse,.hs.sel circle{stroke:#4f46e5 !important;stroke-width:3 !important;filter:drop-shadow(0 2px 4px rgba(79,70,229,.3))}.hs.sel text{fill:#3730a3 !important}figure.diagram svg text{font-family:system-ui,sans-serif}';
    document.head.appendChild(st);
  }
  document.querySelectorAll('figure.diagram').forEach(fig => {
    const key = fig.getAttribute('data-diagram'), cap = fig.querySelector('figcaption');
    if (!key || (!D[key] && key !== 'daur')) return;
    const host = document.createElement('div');
    const info = document.createElement('div'); info.className = 'diagram-info';
    const hint = document.createElement('div'); hint.className = 'hint'; hint.textContent = '👆 Klik bagian diagram untuk penjelasan';
    if (key === 'daur') { buildDaur(host, info); } else { host.innerHTML = D[key](); }
    fig.insertBefore(host, cap); fig.insertBefore(info, cap); fig.insertBefore(hint, cap);
    wire(host, info);
  });
}
