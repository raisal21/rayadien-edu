# AGENTS.md

## Commands

```
bun install
bun run dev          # http://localhost:4321
bun run build        # static output → dist/
bun run preview      # preview build
```

No lint, formatter, typecheck, or test scripts exist. Verify with `bun run build` (catches type and content-schema errors).

## Architecture

- **Astro 6** static site, **Bun** package manager, Node ≥ 22.12 runtime.
- **`src/config/subjects.ts`** — single source of truth for subjects (list, colors, copy, filters). Everything derives from this. Never hardcode a subject list elsewhere.
- **`src/content.config.ts`** — Zod schemas for `entries` and `flashcards` collections. Subject enum here must stay in sync with `subjects.ts`.
- **One dynamic route** `src/pages/[subject]/[semester].astro` generates all materi pages via `getStaticPaths` from (subject × semester) pairs that have content. No per-subject `.astro` files.
- **Hub** (`src/pages/index.astro`) derives subject availability from content — no hardcoded map.
- **BaseLayout** injects `[data-subject="id"]{ --accent… }` from config. Subject colors are edited **only** in `subjects.ts`.

## Content conventions

- Entry path: `src/content/entries/<subject>/s<semester>/<bagian><nomor>.md` (e.g. `A1.md`, `B3.md`, `C12.md`)
- Bagian: A = PG, B = PG Kompleks, C = Isian
- Flashcard: `src/content/flashcards/<subject>/<slug>.md` (one file = one card)
- Adding a subject: entry in `subjects.ts` + add to enum in `content.config.ts` + drop content. Routes, hub cards, colors, and flashcard links appear automatically.

## Style contract — read before any CSS/HTML edit

**Read `STYLE.md` before editing styles.** The design is risograph-zine. Key rules:

1. **No raw hex** for palette colors — use CSS tokens from `:root` (`--ink`, `--paper`, `--accent`, etc.). Only `#fff`/`#000` allowed inline.
2. **No magic numbers** — use structural tokens (`--bw`, `--sh-*`, `--sp-*`, `--radius`).
3. **Shadow syntax trap**: `box-shadow: var(--sh-2) var(--ink);` — the **space** between the two `var()` calls is required. `var(--sh-1)var(--ink)` silently drops the shadow but still builds.
4. **Three color sources only**: `:root` tokens, `subjects.ts` accent ramps, `[data-topic]` rules in `global.css`.
5. After CSS edits, verify: `grep -rnE "var\(--sh-[1-4]\)[^ ;]" src` must return nothing.

## Language

UI copy is casual Indonesian. Commit messages in normal prose.
