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
- Pages: `src/pages/{subject}.astro`

## Gambar

- `public/img/*.webp`
- Entries yang butuh gambar pakai `image: img/<name>.webp`
- IMAGE-BRIEF.md (handoff untuk agent gambar) → sudah dihapus (gambar sudah dibuat / tidak diperlukan lagi).
