# Todo App — UI Redesign Spec
**Date:** 2026-04-25
**Status:** Approved

---

## Overview

A complete visual and interaction redesign of the existing Angular 17 Todo App. The goal is a portfolio-grade, production-quality interface that impresses technical visitors with its design restraint and animation craft. The design direction is **Bold & Editorial**, **pure monochrome** (no gradients, no color accents), **light theme**, with a **GSAP-powered animation system** combining cinematic reveals and snappy micro-interactions.

---

## Design Principles

- **No gradients.** No color accents. Pure black (`#111`), white (`#fff`), and grays (`#666`, `#bbb`, `#eee`, `#f4f4f4`).
- **Editorial hierarchy.** Typography does the heavy lifting — Playfair Display (serif) for display, Inter (sans-serif) for UI.
- **Every interaction earns its animation.** No decorative motion. Each animation communicates state: enter, exit, complete, create.
- **Cinematic but not slow.** The longest animation sequence is 1.2s (page load). Individual interactions are all under 300ms.

---

## Tech Stack

- **Framework:** Angular 17 (standalone components, existing architecture preserved)
- **Animation library:** GSAP (GreenSock) — loaded via npm (`gsap`)
- **Fonts:** Google Fonts — `Playfair Display` (serif, italic variant) + `Inter` (sans-serif, weights 400/500/600/700)
- **Styling:** Component-scoped CSS (no new framework added)
- **No new Angular dependencies** beyond GSAP

---

## Layout & Structure

The page is divided into four zones, stacked vertically:

### 1. Header Strip
- Full-width, `background: #111`, `padding: 20px 40px`
- Left: logotype — `Tasks` in Playfair Display Italic, 28px, 900 weight, `color: #fff`
- Right: current date — `Fri, Apr 25 2026` in Inter, 11px, 600 weight, uppercase, letter-spacing 0.1em, `color: #888`
- Bottom border: `3px solid #fff`
- On scroll past 60px: header compresses — padding reduces to `12px 40px`, font-size shrinks to 20px via GSAP `scrollTrigger`

### 2. Hero Stat Block
- `padding: 28px 40px 20px`
- Eyebrow: `TODAY'S FOCUS` — Inter, 11px, 700, uppercase, `#999`, `letter-spacing: 0.12em`
- Counter: task count as two-digit number (e.g., `04`) — Playfair Display, 72px, 900, `#111`, `letter-spacing: -0.04em`
- Subtitle: `tasks remaining · N completed` — Inter, 13px, 500, `#aaa`
- Bottom border: `1px solid #eee`

### 3. Task List
- Centered, `max-width: 900px`, `margin: 0 auto`, `padding: 0 40px`
- **Section divider:** A hairline extends left and right from an italic label ("Active" / "Done") — Playfair Display Italic, 12px, `#bbb`
- **Task rows** numbered `01`, `02`… — see Component specs below
- Completed tasks appear below a "Done" divider with strikethrough styling

### 4. Bottom Action Bar
- Fixed to bottom of viewport, full-width
- `background: #111`, `padding: 18px 40px`
- Left: `New Task` — Inter, 13px, 700, `#fff`, `letter-spacing: 0.04em`
- Right: `+` — Inter, 24px, 300, `#fff`
- Clicking opens the Add Task Sheet

### Footer
- `text-align: center`, `padding: 20px`, `font-size: 11px`, `color: #bbb`
- Content: `© 2026 Shephard Todo App` (no emojis)

---

## Typography System

| Role | Font | Size | Weight | Color | Notes |
|---|---|---|---|---|---|
| Logotype | Playfair Display Italic | 28px | 900 | #fff | Header only |
| Hero counter | Playfair Display | 72px | 900 | #111 | Animated on change |
| Hero subtitle | Inter | 13px | 500 | #aaa | Uppercase, tracked |
| Task title | Inter | 15px | 600 | #111 | — |
| Task content/note | Inter | 12px | 400 | #666 | Below title |
| Task meta (date) | Inter | 11px | 500 | #999 | Uppercase |
| Row number | Inter | 11px | 700 | #ccc | — |
| Section divider | Playfair Display Italic | 12px | 400 | #bbb | — |
| Input placeholder | Inter | 14px | 400 | #bbb | — |
| Input value | Inter | 14px | 600 | #111 | — |

---

## Component Specs

### Task Row
- **Structure:** `[number] [title + note] [meta] [×]`
- `padding: 14px 0`, `border-bottom: 1px solid #f4f4f4`
- Row number: `width: 28px`, Inter 11px 700 `#ccc`, flex-shrink 0
- Title: Inter 15px 600 `#111`
- Note (optional): Inter 12px 400 `#666`, `margin-top: 3px`
- Meta: Inter 11px 500 `#999`, uppercase, margin-left auto
- Delete `×`: hidden by default, `opacity: 0`, revealed on row hover

**Hover state:**
- Row translates `x: -4px`
- A `2px` black left-border appears on the row container
- Delete `×` slides in from `x: 8px` → `x: 0`, `opacity: 0 → 1`
- Duration: 80ms, `power2.out`

**Complete (click title):**
- A black underline pseudo-element draws left-to-right (`scaleX: 0 → 1`, `transform-origin: left`, 300ms)
- 400ms pause
- Row slides down to "Done" section (GSAP `y` animation, 280ms `power2.inOut`)
- Done section: title `color: #bbb`, strikethrough static

**Delete (click ×):**
- Row height collapses to 0, `opacity: 0`, `280ms`, `power2.in`
- Rows below shuffle up smoothly (GSAP handles layout reflow)

### Add Task Sheet
- **Trigger:** Bottom action bar `+` click
- **Behavior:** White panel (`background: #fff`, `border-radius: 16px 16px 0 0`) slides up from bottom — GSAP `y: 100% → 0`, `350ms`, `power3.out`
- **Overlay:** `rgba(0,0,0,0.2)` background fades in behind sheet
- **Content:**
  - Large title input: Inter 22px 700 `#111`, placeholder `"Task title…"`, no border, bottom border only `1px solid #eee`
  - Note input: Inter 14px 400 `#666`, placeholder `"Add a note…"`, below title
  - `Add` button: black pill `background: #111`, `color: #fff`, `border-radius: 100px`, `padding: 10px 24px`, Inter 13px 700
  - Dismiss: clicking overlay or `×` in top-right slides sheet back down
- **On submit:** Sheet slides down → new task row flies in from `y: -16px, opacity: 0` with spring settle (`elastic.out(1, 0.5)`, 500ms)

### Bottom Action Bar
- `+` rotates 90° → `×` when sheet is open (GSAP rotation, 200ms)
- "New Task" text fades to "Close" when sheet is open

### Hero Counter
- On load: counts up from `00` to task count, 800ms GSAP ticker
- On every task add/delete/complete: re-animates to new value
- Subtitle updates in sync with a crossfade (`opacity: 0 → 1`, 200ms)

### Section Dividers
- Hairline lines draw outward from center (`scaleX: 0 → 1`) on page load, staggered after task rows

### Custom Cursor
- A `12px` black circle `div.cursor` absolutely positioned, `pointer-events: none`, `z-index: 9999`
- Follows mouse with GSAP `quickTo` (x, y) — ~40ms lag, `power2` ease
- Scales to `0.6×` on mousedown (snappy press feel), restores on mouseup

---

## Animation System

### Page Load Sequence (~1.2s total)

| Time | Element | Animation |
|---|---|---|
| 0ms | Header | `y: -100% → 0`, `power3.out`, 400ms |
| 150ms | Divider lines | `scaleX: 0 → 1`, `power2.out`, 300ms |
| 300ms | Hero eyebrow | `opacity: 0 → 1`, `y: 8 → 0`, 250ms |
| 400ms | Hero counter | `opacity: 0 → 1`, then count-up 0→N, 700ms |
| 500ms | Task rows | Stagger `y: 20 → 0, opacity: 0 → 1`, 80ms apart, `power2.out` |
| 900ms | Bottom bar | `y: 100% → 0`, `power3.out`, 300ms |
| ~1200ms | Complete | All animations settled |

### Micro-interaction Timings

| Interaction | Duration | Easing |
|---|---|---|
| Row hover translate | 80ms | power2.out |
| Delete × reveal | 100ms | power2.out |
| Button scale press | 60ms down / 80ms up | power1 |
| Input focus border | 100ms | power2.out |
| `+` rotate to `×` | 200ms | power2.inOut |
| Cursor follow lag | ~40ms | quickTo power2 |

### Ambient
- Hero counter pulses very subtly (scale `1 → 1.01 → 1`) every 4 seconds via GSAP repeat — a heartbeat that signals live data

---

## Angular Component Structure

Existing components are preserved. Changes are scoped to templates, CSS, and GSAP calls in `ngAfterViewInit`:

| Component | Changes |
|---|---|
| `app.component` | Add cursor div, load GSAP on init |
| `main-content.component` | Full HTML/CSS rewrite, GSAP page-load timeline, task add/delete/complete animations |
| `footer.component` | Minor HTML/CSS update (text, styling) |
| `index.html` | Add Google Fonts link tags |
| `styles.css` | Global resets, cursor styles, font imports |

---

## Constraints

- No gradient colors anywhere in the design
- No color accents — strict monochrome palette only
- No new Angular modules (FormsModule already imported)
- GSAP installed via npm, imported in component TypeScript files
- Existing `List` array data model and `addList()` / `deleteList()` methods preserved; a `completeList()` method will be added
