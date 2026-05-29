# STYLE.md — Rayadien Edu

Design system + maintainability contract. **Read before editing any `.astro`/`.css`.**
The look is a **risograph zine**: warm paper, spot inks, printed (offset) shadows,
heavy condensed display type, dashed perforations, slight rotations.

---

## 0. Golden rules (no magic)

1. **No raw hex / rgba for palette colors.** Use a token (§2) or a sanctioned
   source (§3). The only literal colors allowed inline are `#fff` / `#000`
   (text-on-color, SVG masks) and **effect tints** (shadow/spotlight alphas like
   `rgba(0,0,0,.06)`) that aren't part of the brand palette.
2. **No magic subject lists.** Subjects live in **`src/config/subjects.ts`**, full
   stop. Pages, hub, flashcards, and colors all derive from it.
3. **No magic counts.** Bagian counts, ranges, availability = derived from content,
   never hardcoded (`count={aEntries.length}`, not `count={25}`).
4. **Reuse structural tokens** for border width (`--bw`), offset shadows
   (`--sh-*`), spacing (`--sp-*`). Pair shadow geometry with a color:
   `box-shadow: var(--sh-2) var(--ink);`  ← note the space.
5. **Build is not a CSS validator.** `var(--sh-1)var(--ink)` (no space) silently
   drops the shadow yet still builds. Always keep the space.

---

## 1. Architecture

```
src/
  config/subjects.ts        ← SINGLE SOURCE: subject list, colors, copy
  content.config.ts         ← collection schemas (entries, flashcards)
  content/
    entries/<subject>/s<n>/  ← materi, one .md per soal (A1.md, B3.md…)
    flashcards/<subject>/    ← one .md per kartu (deck/front/back)
  layouts/BaseLayout.astro  ← html shell; injects per-subject accent CSS
  pages/
    index.astro             ← hub (semester tabs + subject cards)
    [subject]/[semester].astro  ← ONE dynamic page for every materi page
    flashcards.astro        ← all-subject flashcards (/flashcards)
    flashcards/[subject].astro  ← per-subject flashcards (/flashcards/biologi)
  components/  scripts/  styles/global.css
```

### Routes
| URL | Source |
|---|---|
| `/` | `pages/index.astro` |
| `/<subject>/<semester>` (e.g. `/biologi/2`) | `pages/[subject]/[semester].astro` |
| `/flashcards` | `pages/flashcards.astro` |
| `/flashcards/<subject>` | `pages/flashcards/[subject].astro` |

`getStaticPaths` for materi enumerates **(subject × semester) pairs that have
content** and are `active` in config — no hardcoded route list.

---

## 2. Token reference (`styles/global.css :root`)

**Fonts** — `--font-display` (Big Shoulders, condensed display), `--font-body`
(Public Sans), `--font-mono` (Space Mono).

**Paper / ink**
| token | use |
|---|---|
| `--paper` `--paper-2` | page background gradient |
| `--paper-hi` | radial highlight in backgrounds |
| `--card` `--card-2` | card / panel surfaces |
| `--ink` | near-black text + outlines |
| `--ink-soft` `--ink-soft-2` | muted text |
| `--line` `--line-2` | hairline borders |

**Accent (per-subject, themeable)** — `--accent` `--accent-2` `--accent-bg`
`--accent-soft` `--accent-light`. Default = riso red; **overridden per subject**
by generated `[data-subject="x"]` rules (see §3).

**Fixed spot inks** (do NOT follow subject accent) — `--red` `--red-bg`
`--red-soft` (jamur topic), `--forest` `--forest-2` `--moss` `--moss-bg`
`--moss-soft` (eko topic / green), `--gold` `--gold-bg`, `--blue`, `--pink`.

**Structure**
| token | value | use |
|---|---|---|
| `--bw` | `1.5px` | standard border width |
| `--sh-1`…`--sh-4` | `2/3/5/9px` offset | printed shadow geometry → `var(--sh-2) var(--ink)` |
| `--sp-1`…`--sp-6` | `0.4→2.5rem` | spacing scale |
| `--radius` | `7px` | corner radius |
| `--shadow` `--shadow-lift` | soft elevation (non-print) |

> One-off shadow sizes (`4/7/8/10px`) and `clamp()` type sizes are intentional
> design values, not tokenized. Keep them deliberate; don't invent new ad-hoc
> palette colors.

---

## 3. Color sources (the only three)

1. **`:root` tokens** (§2) — the shared palette.
2. **`config/subjects.ts` → `accent`** — each subject's accent ramp. BaseLayout
   turns it into `[data-subject="id"]{ --accent… }` and injects it. This selector
   themes **both** `<body data-subject>` on a materi page **and** `.subject-card[data-subject]`
   on the hub. **Edit subject colors here only.**
3. **`global.css` "topic ink" section** (`[data-topic="…"]` rules, ~L1460+) — per
   *topic* spot colors (gold/teal/blue/violet…), independent of subject accent.
   Adding a topic that needs its own ink = add one rule here.

`EntryCard` and `[data-topic="jamur|eko"]` use `--accent-local` so a card's tint
follows its **topic**, not the page accent (e.g. jamur stays `--red` on green
Biologi). That two-tone behavior is intentional.

---

## 4. Recipes

### ➕ Add a subject
1. Add one entry to `SUBJECTS` in **`src/config/subjects.ts`** (`id`, `name`,
   `desc`, `accent` ramp, `active: true`, `titleSub`, `brand`, `filters`,
   `hero{…}`, `topicLabels`, `noteC`, optional `overviewPlates`).
2. Add to the schema enum in **`content.config.ts`** → `subject: z.enum([… 'newid'])`.
3. Drop content: `src/content/entries/<id>/s2/A1.md …` (frontmatter
   `subject: <id>`, `semester: 2`, `topic`, `bagian`, `nomor`, …).
4. (optional) `src/content/flashcards/<id>/*.md`.

That's it — materi page, hub card, colors, flashcards link all appear. No page
file, no CSS color edits. Before content exists the hub shows a locked card
(set `active: false` to keep it locked intentionally, e.g. sosiologi).

### ➕ Add a semester
1. Create `src/content/entries/<subject>/s<n>/…` with frontmatter `semester: <n>`.
2. Ensure `<n>` is in `SEMESTERS` in config (tabs shown on hub; default 2–7).

Route `/<subject>/<n>` generates automatically and the hub's "Sem n" tab unlocks
that subject (availability is derived from content). Materi pages already filter
by both subject **and** semester.

### ➕ Add a flashcard
One file: `src/content/flashcards/<subject>/<slug>.md`
```md
---
deck: "Biologi - Jamur"   # groups cards; shown in the deck dropdown
front: "Question?"
back: "Answer. **bold**, *italic*, and\n- bullets supported"
tags: ["jamur"]
difficulty: "easy"        # easy|medium|hard (optional)
---
```
Subject is inferred from the folder. "Semua kartu" (all cards for the subject) is
the default view; decks just narrow it. A brand-new subject needs its config
entry (§Add a subject) for the back-link label.

---

## 5. Components

| component | role | key props |
|---|---|---|
| `BaseLayout` | html shell, fonts, grain, **accent injection** | `title`, `subject?` |
| `TopBar` | sticky nav + topic filter buttons | `subject`, `brand`, `brandSub`, `filters` |
| `Hero` | page masthead | `titleMain/Em/Sub`, `lede`, `legend`, `flashHref`, `howto` |
| `BagianHeader` | section header A/B/C | `bagian`, `title`, `count`, `note?` |
| `TopicDivider` | topic separator + icon | `topic`, `label`, `range` |
| `OverviewPlates` | reference-image pair | `topic`, `title`, `subtitle`, `plates[]` |
| `EntryCard` | one soal (renders md body, trik, image) | `entry` |
| `FlashcardsShell` | flashcards UI shell | `cards`, `decks`, `subject`, `backHref/Label`, `title` |
| `ProgressBar` `BackToTop` `Lightbox` `Footer` | chrome |

Scripts: `interactive.ts` (topic filter + scroll reveal + progress),
`hub.ts` (semester tab → re-render grid), `flashcards.ts` (deck filter, flip,
keyboard `← → / Space`), `diagrams.ts`.

---

## 6. Constraints / don't

- Don't re-add per-subject `<page>.astro` files — use the dynamic route.
- Don't hardcode subject colors in `global.css` or `index.astro` — config only.
- Don't reference `'Spectral'` or other unloaded fonts — only the three
  `--font-*` families are loaded by BaseLayout.
- Keep UI copy casual Indonesian; commits/PRs in normal prose.
- After CSS edits, grep for regressions:
  `grep -rnE "var\(--sh-[1-4]\)[^ ;]" src` (must be empty),
  `grep -rnE "#[0-9a-fA-F]{3,6}" src/components src/pages` (only `#fff`/`#000`/masks).
