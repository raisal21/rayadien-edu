// ════════════════════════════════════════════════════════════
// SUBJECTS — single source of truth for every mata pelajaran.
// Adding a subject = add one entry here + drop content under
// src/content/entries/<id>/s<semester>/ and src/content/flashcards/<id>/.
// Nothing else hardcodes the subject list. See STYLE.md.
// ════════════════════════════════════════════════════════════

/** Accent ramp per subject. Injected as CSS custom props by BaseLayout
 *  (selector [data-subject="id"]). The ONLY place subject colors live. */
export interface AccentRamp {
  base: string;   // --accent
  dark: string;   // --accent-2
  bg: string;     // --accent-bg   (faint tint)
  soft: string;   // --accent-soft (selection / borders)
  light: string;  // --accent-light
}

export interface Chip { cls?: string; label: string }
export interface Filter { value: string; label: string }
export interface Plate { src: string; alt: string; cap: string; label: string; width?: number; height?: number }
export interface OverviewBlock { title: string; subtitle: string; plates: Plate[] }

export interface SubjectConfig {
  id: string;            // url slug + content folder + data-subject
  name: string;          // display name ("Biologi")
  desc: string;          // hub card blurb
  accent: AccentRamp;
  /** false = no content yet → shown as a locked "coming soon" hub card. */
  active: boolean;

  // ── page chrome (only used when active) ──
  titleSub: string;      // hero line 2 + <title> tail
  brand: string;         // topbar brand ("Biologi X")
  filters: Filter[];     // topbar topic filters (first = "Semua")
  hero: {
    lede: string;
    src: string;
    legend: Chip[];
    howto: string;
  };
  /** topic slug → divider label ("Topik 1 · …"). */
  topicLabels: Record<string, string>;
  /** bagian C note (varies per subject); bagian B uses shared NOTE_B. */
  noteC: string;
  /** optional reference-image block keyed by topic slug (e.g. biologi jamur). */
  overviewPlates?: Record<string, OverviewBlock>;
}

// ── shared copy (identical across subjects) ──
export const EYEBROW = 'Materi Belajar &middot; ASAT Genap 2025/2026';
export const TITLE_EM = 'Kelas X';
export const BRAND_SUB = 'Kisi-Kisi ASAT';
export const NOTE_B =
  '⚠️ PG Kompleks = <u>jawaban benar bisa lebih dari satu</u>. Centang <strong>semua</strong> yang tepat, jangan berhenti di satu.';
export const HOWTO_BASE =
  '<b>Cara pakai:</b> baca <em>indikator</em> &#x2192; pahami <em>inti materi</em> &#x2192; buka <em>trik jawab</em>. Pakai tombol topik di atas untuk fokus ke satu topik.';
export const HOWTO_IMG =
  '<b>Cara pakai:</b> baca <em>indikator</em> &#x2192; pahami <em>inti materi</em> &#x2192; amati <em>gambar</em> bila ada &#x2192; buka <em>trik jawab</em>. Pakai tombol topik di atas untuk fokus ke satu topik.';

/** Semester tabs rendered on the hub. A tab unlocks per-subject automatically
 *  once matching content exists (availability is derived from content). */
export const SEMESTERS = [2, 3, 4, 5, 6, 7];

export const SUBJECTS: SubjectConfig[] = [
  {
    id: 'sejarah',
    name: 'Sejarah',
    desc: 'Kerajaan Hindu-Buddha & jalur Islam Nusantara.',
    accent: { base: '#e8402f', dark: '#c2301f', bg: 'rgba(232, 64, 47, 0.09)', soft: 'rgba(232, 64, 47, 0.28)', light: '#fdeae6' },
    active: true,
    titleSub: 'Hindu-Buddha & Islam Nusantara',
    brand: 'Sejarah X',
    filters: [
      { value: 'all', label: 'Semua' },
      { value: 'hindu-buddha', label: 'Hindu-Buddha' },
      { value: 'islam', label: 'Islam' },
    ],
    hero: {
      lede: 'Catatan ringkas untuk asesmen akhir tahun &mdash; disusun mengikuti <b>kisi-kisi</b>: teori masuk, saluran penyebaran, serta kerajaan Hindu-Buddha & Islam di Nusantara.',
      src: 'Sumber: rangkuman materi sejarah Indonesia &mdash; selaraskan dengan catatan & buku pegangan kelas.',
      legend: [
        { cls: 'n', label: 'Hindu-Buddha' },
        { cls: 'n', label: 'Islam' },
        { cls: 'n', label: '40 soal &middot; A 25 &middot; B 10 &middot; C 5' },
      ],
      howto: HOWTO_BASE,
    },
    topicLabels: {
      'hindu-buddha': 'Topik 1 · Hindu-Buddha',
      islam: 'Topik 2 · Islam',
    },
    noteC: '✍️ Isian singkat = jawab <strong>ringkas & tepat</strong> (istilah/nama/tahun).',
  },
  {
    id: 'biologi',
    name: 'Biologi',
    desc: 'Fungi, ekosistem & daur biogeokimia.',
    accent: { base: '#1f9b54', dark: '#167a41', bg: 'rgba(31, 155, 84, 0.1)', soft: 'rgba(31, 155, 84, 0.3)', light: '#e9f7ee' },
    active: true,
    titleSub: 'Jamur & Ekosistem',
    brand: 'Biologi X',
    filters: [
      { value: 'all', label: 'Semua' },
      { value: 'jamur', label: 'Jamur' },
      { value: 'eko', label: 'Ekosistem' },
    ],
    hero: {
      lede: 'Catatan lengkap buat asesmen akhir semester &mdash; disusun <b>pas sama kisi-kisi</b>, dengan gambar untuk tiap materi yang diujikan.',
      src: 'Sumber: materi <em>Fungi</em> &amp; <em>Ekosistem</em> oleh Rahma Yeni, S.Pd &mdash; tanpa tambahan dari luar.',
      legend: [
        { cls: 'j', label: 'Jamur (Fungi)' },
        { cls: 'e', label: 'Ekosistem' },
        { cls: 'n', label: '35 soal &middot; A 25 &middot; B 5 &middot; C 5' },
      ],
      howto: HOWTO_IMG,
    },
    topicLabels: {
      jamur: 'Topik 1 · Jamur (Fungi)',
      eko: 'Topik 2 · Ekosistem',
    },
    noteC: '✍️ Isian singkat = jawab <strong>ringkas & tepat</strong> (istilah/nama/angka). Tulis nama spesies dengan <em>huruf miring</em>.',
    overviewPlates: {
      jamur: {
        title: 'Jamur',
        subtitle: 'Dua gambar acuan utama — pelajari dulu sebelum masuk ke soal per nomor.',
        plates: [
          {
            src: 'img/jamur-overview-struktur.webp',
            alt: 'Infografik struktur fungi (jamur) dan perannya: tudung, lamela, cincin, stipe, volva, miselium, hifa, dinding sel, septa.',
            cap: 'Struktur tubuh jamur lengkap (tudung, lamela, cincin, tangkai, volva, miselium, hifa) beserta perannya.',
            label: 'Struktur jamur & perannya.',
            width: 1536,
            height: 1024,
          },
          {
            src: 'img/jamur-overview-reproduksi.webp',
            alt: 'Infografik reproduksi jamur pada 4 divisi (Zygomycota, Ascomycota, Basidiomycota, Deuteromycota) secara vegetatif dan generatif.',
            cap: 'Reproduksi jamur pada 4 divisi: Zygomycota, Ascomycota, Basidiomycota, Deuteromycota — vegetatif (aseksual) dan generatif (seksual).',
            label: 'Reproduksi 4 divisi jamur.',
            width: 1536,
            height: 1024,
          },
        ],
      },
    },
  },
  {
    id: 'ekonomi',
    name: 'Ekonomi',
    desc: 'Elastisitas, pasar, uang & bank sentral.',
    accent: { base: '#2340b8', dark: '#1b3392', bg: 'rgba(35, 64, 184, 0.09)', soft: 'rgba(35, 64, 184, 0.26)', light: '#e8ecfb' },
    active: true,
    titleSub: 'Pasar, Uang & Lembaga Keuangan',
    brand: 'Ekonomi X',
    filters: [
      { value: 'all', label: 'Semua' },
      { value: 'mikro', label: 'Mikro' },
      { value: 'pembayaran', label: 'Pembayaran' },
      { value: 'lembaga', label: 'Lembaga' },
    ],
    hero: {
      lede: 'Catatan ringkas untuk asesmen akhir tahun &mdash; disusun mengikuti <b>kisi-kisi</b>: elastisitas, biaya produksi, struktur pasar, sistem pembayaran, serta OJK & lembaga keuangan.',
      src: 'Sumber: rangkuman materi ekonomi SMA &mdash; selaraskan dengan catatan & buku pegangan kelas.',
      legend: [
        { cls: 'n', label: 'Mikroekonomi' },
        { cls: 'n', label: 'Sistem Pembayaran' },
        { cls: 'n', label: '35 soal &middot; A 25 &middot; B 5 &middot; C 5' },
      ],
      howto: '<b>Cara pakai:</b> baca <em>indikator</em> &#x2192; pahami <em>inti materi</em> &#x2192; cermati <em>contoh hitungan</em> &#x2192; buka <em>trik jawab</em>. Pakai tombol topik di atas untuk fokus ke satu topik.',
    },
    topicLabels: {
      mikro: 'Topik 1 · Mikroekonomi',
      pembayaran: 'Topik 2 · Sistem Pembayaran & Uang',
      lembaga: 'Topik 3 · Lembaga Keuangan',
    },
    noteC: '✍️ Isian singkat = jawab <strong>ringkas & tepat</strong> (istilah/angka/hasil hitungan).',
  },
  {
    id: 'ppkn',
    name: 'PPKn',
    desc: 'Kewarganegaraan & pertahanan negara.',
    accent: { base: '#6c4bd1', dark: '#573caa', bg: 'rgba(108, 75, 209, 0.1)', soft: 'rgba(108, 75, 209, 0.28)', light: '#efeafb' },
    active: true,
    titleSub: 'Warga Negara, Bela Negara & Hubungan Internasional',
    brand: 'PPKn X',
    filters: [
      { value: 'all', label: 'Semua' },
      { value: 'warga-negara', label: 'Warga Negara' },
      { value: 'hankam', label: 'Hankam' },
      { value: 'hubungan-internasional', label: "Hub. Int'l" },
      { value: 'pancasila', label: 'Pancasila' },
    ],
    hero: {
      lede: 'Catatan ringkas untuk asesmen akhir tahun &mdash; disusun mengikuti <b>kisi-kisi</b>: kewarganegaraan, sistem pertahanan-keamanan, hubungan internasional, serta nilai Pancasila dalam pembangunan.',
      src: 'Sumber: rangkuman materi Pendidikan Pancasila SMA &mdash; selaraskan dengan catatan & buku pegangan kelas.',
      legend: [
        { cls: 'n', label: 'Warga Negara' },
        { cls: 'n', label: 'Hub. Internasional' },
        { cls: 'n', label: '40 soal &middot; A 25 &middot; B 10 &middot; C 5' },
      ],
      howto: HOWTO_BASE,
    },
    topicLabels: {
      'warga-negara': 'Topik 1 · Warga Negara',
      hankam: 'Topik 2 · Pertahanan & Keamanan',
      'hubungan-internasional': 'Topik 3 · Hubungan Internasional',
      pancasila: 'Topik 4 · Pancasila & Pembangunan',
    },
    noteC: '✍️ Isian singkat = jawab <strong>ringkas & tepat</strong> (istilah/nama/dasar hukum).',
  },
  {
    id: 'geografi',
    name: 'Geografi',
    desc: 'Hidrologi & perairan darat.',
    accent: { base: '#0f8a8a', dark: '#0b6d6d', bg: 'rgba(15, 138, 138, 0.1)', soft: 'rgba(15, 138, 138, 0.28)', light: '#e4f4f4' },
    active: true,
    titleSub: 'Hidrosfer, Peta & Penginderaan Jauh',
    brand: 'Geografi X',
    filters: [
      { value: 'all', label: 'Semua' },
      { value: 'hidrosfer', label: 'Hidrosfer' },
      { value: 'peta-pj', label: 'Peta & PJ' },
    ],
    hero: {
      lede: 'Catatan ringkas untuk asesmen akhir tahun &mdash; disusun mengikuti <b>kisi-kisi</b>: siklus air, perairan darat & laut, batas laut, peta, penginderaan jauh, dan SIG.',
      src: 'Sumber: rangkuman materi geografi SMA &mdash; selaraskan dengan catatan & buku pegangan kelas.',
      legend: [
        { cls: 'n', label: 'Hidrosfer' },
        { cls: 'n', label: 'Peta & PJ' },
        { cls: 'n', label: '35 soal &middot; A 25 &middot; B 5 &middot; C 5' },
      ],
      howto: HOWTO_IMG,
    },
    topicLabels: {
      hidrosfer: 'Topik 1 · Hidrosfer (Perairan)',
      'peta-pj': 'Topik 2 · Peta, PJ & SIG',
    },
    noteC: '✍️ Isian singkat = jawab <strong>ringkas & tepat</strong> (istilah/nama/hasil hitungan).',
  },
  {
    id: 'sosiologi',
    name: 'Sosiologi',
    desc: 'Perilaku menyimpang, pengendalian sosial, kelompok & lembaga.',
    accent: { base: '#f06a1e', dark: '#cc5413', bg: 'rgba(240, 106, 30, 0.1)', soft: 'rgba(240, 106, 30, 0.28)', light: '#fdeede' },
    active: true,
    titleSub: 'Perilaku Menyimpang, Kelompok & Lembaga Sosial',
    brand: 'Sosiologi X',
    filters: [
      { value: 'all', label: 'Semua' },
      { value: 'perilaku-menyimpang', label: 'Penyimpangan' },
      { value: 'pengendalian-sosial', label: 'Pengendalian' },
      { value: 'status-sosial', label: 'Status' },
      { value: 'kelompok-sosial', label: 'Kelompok' },
      { value: 'budaya-multikultural', label: 'Budaya' },
      { value: 'lembaga-sosial', label: 'Lembaga' },
    ],
    hero: {
      lede: 'Catatan ringkas untuk asesmen akhir tahun &mdash; disusun mengikuti <b>kisi-kisi</b>: perilaku menyimpang, pengendalian sosial, status & kelompok sosial, budaya multikultural, serta lembaga sosial.',
      src: 'Sumber: rangkuman materi sosiologi SMA &mdash; selaraskan dengan catatan & buku pegangan kelas.',
      legend: [
        { cls: 'n', label: 'Penyimpangan & Pengendalian' },
        { cls: 'n', label: 'Kelompok & Lembaga' },
        { cls: 'n', label: '33 soal &middot; A 19 &middot; B 10 &middot; C 4' },
      ],
      howto: HOWTO_BASE,
    },
    topicLabels: {
      'perilaku-menyimpang': 'Topik 1 · Perilaku Menyimpang',
      'pengendalian-sosial': 'Topik 2 · Pengendalian Sosial',
      'status-sosial': 'Topik 3 · Status Sosial',
      'kelompok-sosial': 'Topik 4 · Kelompok Sosial',
      'budaya-multikultural': 'Topik 5 · Budaya & Multikultural',
      'lembaga-sosial': 'Topik 6 · Lembaga Sosial',
    },
    noteC: '✍️ Isian singkat = jawab <strong>ringkas & tepat</strong> (istilah/nama/konsep).',
  },
];

/** id → config lookup. */
export const SUBJECT_MAP: Record<string, SubjectConfig> = Object.fromEntries(
  SUBJECTS.map((s) => [s.id, s]),
);
