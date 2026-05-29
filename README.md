# Rayadien Edu

Situs catatan belajar SMA — multi-mapel, multi-semester. Bank soal per mapel
(disusun dari kisi-kisi) + flashcards interaktif. Tema **risograph-zine**.

Dibikin pakai [Astro](https://astro.build) (static), GSAP buat animasi flashcard.

## Stack

- **Astro 6** — static site generation, content collections
- **Bun** — package manager + runner (lockfile `bun.lock`)
- **GSAP** — animasi flip/shuffle flashcard
- **pdf-parse** — tooling konversi kisi-kisi PDF → Markdown (lihat `NAPKIN.md`)
- Node **≥ 22.12** (runtime build; Astro/Vite di balik layar)

## Mulai

```bash
bun install
bun run dev        # http://localhost:4321
bun run build      # output static ke dist/
bun run preview    # preview hasil build
```

> Pakai **Bun** sebagai package manager + runner. Runtime tetap **Node** (default
> Astro/Vite); `--bun` opsional & belum dipakai. `bunx astro <cmd>` juga jalan.

## Struktur

```
src/
  config/subjects.ts          ← SUMBER TUNGGAL mapel: daftar, warna, copy
  content.config.ts           ← schema collection (entries, flashcards)
  content/
    entries/<mapel>/s<n>/      ← bank soal, 1 .md per soal (A1.md, B3.md…)
    flashcards/<mapel>/        ← 1 .md per kartu (deck/front/back)
  layouts/BaseLayout.astro     ← shell html + inject warna accent per mapel
  pages/
    index.astro                ← hub (tab semester + kartu mapel)
    [subject]/[semester].astro ← SATU route dinamis buat semua halaman materi
    flashcards.astro           ← flashcards semua mapel
    flashcards/[subject].astro ← flashcards per mapel
  components/  scripts/  styles/global.css
materi/semester-2/             ← kisi-kisi sumber (lihat NAPKIN.md)
public/img/                    ← gambar materi (.webp)
```

## Route

| URL | Halaman |
|---|---|
| `/` | hub — pilih semester + mapel |
| `/<mapel>/<semester>` (mis. `/biologi/2`) | bank soal materi |
| `/flashcards` | flashcards semua mapel |
| `/flashcards/<mapel>` | flashcards 1 mapel |

Route materi di-*generate* otomatis dari pasangan (mapel × semester) yang ada
kontennya. Ga ada file halaman per-mapel.

## Model konten

**Entry (soal)** — `src/content/entries/<mapel>/s<n>/<bagian><nomor>.md`
```md
---
subject: biologi      # enum di content.config.ts
semester: 2
topic: jamur          # sub-topik (bebas, per mapel)
bagian: A             # A=PG, B=PG kompleks, C=isian
type: pg              # pg | pg-kompleks | isian
nomor: 1
title: "Ciri umum jamur"
indikator: "<strong>Indikator.</strong> …"
trik: "…"             # opsional
image: img/x.webp     # opsional
---
#### Inti Materi
- poin…
```

**Flashcard** — `src/content/flashcards/<mapel>/<slug>.md`
```md
---
deck: "Biologi - Jamur"
front: "Pertanyaan?"
back: "Jawaban. **tebal**, *miring*, dan\n- bullet didukung"
tags: ["jamur"]
difficulty: "easy"     # easy|medium|hard (opsional)
---
```

## Nambah konten

- **Mapel baru** → 1 entry di `src/config/subjects.ts` + tambah ke enum di
  `content.config.ts` + taruh konten. Halaman, kartu hub, warna, link flashcards
  muncul otomatis.
- **Semester baru** → taruh konten di `entries/<mapel>/s<n>/` (frontmatter
  `semester: <n>`). Route `/<mapel>/<n>` + tab hub kebuka sendiri.
- **Flashcard** → 1 file `.md` di folder mapelnya.

Detail tiap field + resep lengkap ada di **[`STYLE.md`](./STYLE.md)**.

## Style / tema

Risograph-zine: kertas hangat, spot ink, bayangan cetak offset, font condensed,
garis putus-putus. Semua **token + aturan (no magic hex/size/number) + warna
per-mapel** diatur lewat `src/styles/global.css` (`:root`) dan
`src/config/subjects.ts`.

➡️ **Baca [`STYLE.md`](./STYLE.md) sebelum ngedit style apa pun** — itu kontrak
desainnya.

## Dokumentasi

| File | Isi |
|---|---|
| [`STYLE.md`](./STYLE.md) | kontrak desain: token, sumber warna, aturan no-magic, resep |
| [`NAPKIN.md`](./NAPKIN.md) | peta folder kisi-kisi + arsitektur halaman ringkas |
