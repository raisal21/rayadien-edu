# NAPKIN.md — Rayadien Edu

## Struktur Materi `/materi/semester-2/`

Kisi-kisi soal (exam blueprints) per mata pelajaran, sudah dikonversi dari PDF/DOCX ke Markdown dan dikelompokkan per folder:

```
materi/semester-2/
├── biologi/
│   ├── ekosistem.md
│   ├── fungi.md
│   └── kisi-asas.md
├── ekonomi/
│   └── kisi-asat.md
├── geografi/
│   └── kisi-asat.md
├── pp/
│   └── kisi-asas.md
└── sejarah/
    ├── kisi-asat.md
    └── saluran-islam-nusantara.md
```

- **biologi**: ASAS Genap (jamur + ekosistem) — sudah ada konten pembelajaran.
- **ekonomi**: ASAT (elastisitas, biaya, pasar, sistem pembayaran, OJK, dll).
- **geografi**: ASAT (siklus air, perairan darat/laut, peta, PJ, SIG).
- **pp** (Pendidikan Pancasila): ASAS (warga negara, pertahanan, hubungan internasional, pembangunan nasional).
- **sejarah**: ASAT (Hindu-Buddha, Islam, kerajaan-kerajaan) + materi saluran Islam.

## Sumber Kisi-Kisi

- **PDF → MD**: `pdf-parse` (v2) via `PDFParse` + `{ data: buffer }` + `getText()`.
- **DOCX → MD**: Sudah dikonversi sebelumnya.
- Semua PDF asli & file `Zone.Identifier` sudah dihapus.

## Entries Konten

- `src/content/entries/{subject}/s{semester}/{bagian}{nomor}.md`
- Frontmatter: `subject`, `semester`, `topic`, `bagian`, `type`, `nomor`, `title`, `indikator`, optional `image`
- Body: `#### Inti Materi` + optional `#### Contoh`
- Flashcards: `src/content/flashcards/{subject}/<slug>.md` (frontmatter `deck`/`front`/`back`), 1 file = 1 kartu.

## Arsitektur Halaman (refactor 2026-05-29)

**Single source mapel = `src/config/subjects.ts`** — daftar mapel, warna accent, copy hero/topbar, topic label. Tambah mapel = 1 entry di sini (+ enum di `content.config.ts` + konten). **Ga ada lagi file `.astro` per mapel.**

- **Materi**: 1 route dinamis `src/pages/[subject]/[semester].astro` → `/biologi/2`. `getStaticPaths` dari pasangan (subject×semester) yang ada kontennya + `active`. Filter entri by subject **dan** semester.
- **Hub** `src/pages/index.astro`: `availability` di-*derive* dari konten (bukan map hardcoded). Tab semester dari `SEMESTERS`. Card unlock otomatis begitu ada konten.
- **Flashcards**: `/flashcards` (semua) + `/flashcards/[subject]`. Default view "Semua kartu".
- **Warna mapel**: `BaseLayout` generate `[data-subject="x"]{--accent…}` dari config → tema body (halaman materi) + card hub. **Edit warna cuma di config.**
- **Aturan style + token + resep tambah subject/semester/flashcard** lengkap di **`STYLE.md`** (root). No magic hex / size / number.

## Gambar

- `public/img/*.webp`
- Entries yang butuh gambar pakai `image: img/<name>.webp`
- IMAGE-BRIEF.md (handoff untuk agent gambar) → sudah dihapus (gambar sudah dibuat / tidak diperlukan lagi).
