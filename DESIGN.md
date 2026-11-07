# Synteq UI V2 — Design System Reference

> **Audience:** Humans and AI agents building with or extending the framework.
> This document is the authoritative reference for architecture, tokens, components, and rules.

---

## 1. Mission

Synteq UI V2 is a **viewport-locked, offline-first, text-first** dashboard UI framework. It is purpose-built for operator dashboards — dense information displays where every pixel matters and page loading patterns must never interrupt the operator's view.

### Six Hard Rules

| # | Rule | Rationale |
|---|------|-----------|
| 1 | **No body scroll** | The shell matches the screen exactly. Only designated in-content regions scroll. |
| 2 | **Responsive on any screen** | Fluid type scale (`clamp`), adaptive content grid, and a sticky hideable bottom dock work from phone to ultra-wide. |
| 3 | **Simple & lightweight** | Minimal token set, flat surfaces, zero external runtime dependencies. |
| 4 | **No cards** | Visual separation comes from `1px` hairline separators only — never from background color shifts or box shadows that create card-like wrappers. |
| 5 | **Lightweight motion** | Subtle fade-up mounts, smooth gauge fills, pulse indicators. All motion is auto-disabled via `prefers-reduced-motion`. |
| 6 | **Inline icons** | Every interactive label carries an inline SVG icon for instant context recognition. No icon fonts, no external icon CDNs. |

---

## 2. Architecture

### Flat Surface Model

V2 abandons the multi-tier tonal elevation model of V1. There is a **single canvas surface** (`--v2-canvas`). Nothing sits "above" or "below" it in a tonal sense.

**Visual hierarchy is expressed through:**
- Typography weight (`--v2-fw-regular` → `--v2-fw-semibold`) and size (`--v2-text-xs` → `--v2-text-3xl`)
- Hairline `1px` separators (`--v2-line`, `--v2-line-strong`, `--v2-line-accent`)
- Subtle hover/inset surface states (`--v2-hover`, `--v2-inset`) for interactive affordance only — never as permanent background shifts to imply depth

**Never expressed through:**
- Card-style `background` blocks
- `box-shadow` elevation layers
- Tonal surface tiers (V1's raised / strong / muted hierarchy)

### V2 vs V1 at a Glance

| | V1 | V2 |
|---|---|---|
| Surface hierarchy | 5-tier tonal elevation | Single flat canvas |
| Visual separation | Tonal card backgrounds | `1px` hairline separators only |
| Navigation | Fixed left sidebar | Sticky bottom dock with icon labels and hide/show motion |
| Page scroll | `min-height: 100%` | `height: 100dvh; overflow: hidden` — only `.v2-content` scrolls |
| Gauge | 86-tick discrete bar | Continuous smooth fill bar |
| Network chart | 48-bar histogram (112px) | 24-col dual-segment bars (72px) |
| Motion | Transition-only | Fade-up mount + stagger + shimmer + IntersectionObserver |
| JS global | `SynteqUI.*` | `SynteqV2.*` |

---

## 3. Token Reference

### 3.1 Typography

| Token | Value | Notes |
|-------|-------|-------|
| `--v2-font-sans` | `'Google Sans Code', 'DM Sans', system-ui, -apple-system, sans-serif` | Primary UI font — self-hosted |
| `--v2-font-mono` | `'Google Sans Code', 'JetBrains Mono', ui-monospace, monospace` | Used for numeric values, hostnames, kbd pills |

#### Type Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--v2-text-xs` | `11px` | Section titles, labels, badges, legend |
| `--v2-text-sm` | `12px` | Secondary metadata, button text, kbd |
| `--v2-text-md` | `13px` | Body text, nav items, KV rows (base size) |
| `--v2-text-lg` | `15px` | Sidebar brand name |
| `--v2-text-xl` | `18px` | Mid-emphasis values; stat fallback at `≤520px` |
| `--v2-text-2xl` | `clamp(22px, 2.4vw, 28px)` | Stat block primary values |
| `--v2-text-3xl` | `clamp(26px, 3.2vw, 34px)` | Hero metrics, large stat displays |

#### Font Weights & Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `--v2-fw-regular` | `400` | Body text, subtle labels |
| `--v2-fw-medium` | `500` | Active nav items, stat values, button text |
| `--v2-fw-semibold` | `600` | Section titles, brand name |
| `--v2-leading-tight` | `1.2` | Large type (`2xl`, `3xl`) |
| `--v2-leading-base` | `1.5` | Body text |

---

### 3.2 Spacing

4px base grid. Nine steps.

| Token | Value |
|-------|-------|
| `--v2-space-1` | `4px` |
| `--v2-space-2` | `8px` |
| `--v2-space-3` | `12px` |
| `--v2-space-4` | `16px` |
| `--v2-space-5` | `20px` |
| `--v2-space-6` | `24px` |
| `--v2-space-7` | `32px` |
| `--v2-space-8` | `40px` |
| `--v2-space-9` | `56px` |

---

### 3.3 Radius

Two tiers only — V2 favors near-flat surfaces.

| Token | Value | Applied To |
|-------|-------|-----------|
| `--v2-radius-micro` | `2px` | Badges, status dots, chart bar caps, avatar, kbd pills |
| `--v2-radius-control` | `5px` | Buttons, inputs, segmented bar, nav items, sidebar toggle |

---

### 3.4 Motion

Single easing curve. Four duration steps.

| Token | Value | Usage |
|-------|-------|-------|
| `--v2-ease` | `cubic-bezier(0.16, 1, 0.3, 1)` | All transitions and animations |
| `--v2-dur-instant` | `120ms` | Hover color/bg swaps, base element transitions |
| `--v2-dur-fast` | `180ms` | Topbar scroll shadow, icon swaps, scrim fade |
| `--v2-dur-normal` | `280ms` | Mount animations, sidebar grid transition, theme switch |
| `--v2-dur-slow` | `420ms` | Gauge fill bar, data-driving transitions |

---

### 3.5 Layout Shell

| Token | Value | Controls |
|-------|-------|---------|
| `--v2-aside-w` | `clamp(204px, 17vw, 240px)` | Legacy sizing token; current dock uses full available width |
| `--v2-topbar-h` | `52px` | Topbar row height; reduces to `48px` at `≤420px` and in short landscape |
| `--v2-bottomnav-h` | `60px` | Sticky bottom dock height; compresses to `52px` in short landscape |
| `--v2-content-max` | `1200px` | Max width of the centred content column (every `.v2-section`) |
| `--v2-nav-item-w` | `80px` | Minimum dock item width — drives the drag/More overflow threshold |
| `--v2-line-h` | `1px` | Standard hairline separator weight |
| `--v2-line-h-strong` | `1px` | Emphasized separator (same physical weight, different color) |

---

### 3.6 Color Tokens

Color tokens are defined in `theme-dark.css` (default) and `theme-light.css`. They are **never** in `tokens.css`.

Switch themes via `data-theme="dark"` or `data-theme="light"` on `<html>`.

#### Surface & Text

| Token | Dark | Light | Role |
|-------|------|-------|------|
| `--v2-canvas` | `#0a0b0b` | `#f4f6f6` | Main app background |
| `--v2-sidebar` | `#070808` | `#ffffff` | Sidebar / nav background |
| `--v2-hover` | `#161919` | `#e8ecec` | Interactive hover / active surface state |
| `--v2-inset` | `#101212` | `#eef1f1` | Inset rows, text inputs, gauge track background |
| `--v2-text` | `#d6dada` | `#2f3434` | Body text, labels |
| `--v2-text-strong` | `#f4f6f6` | `#0d1010` | High-emphasis: values, hostnames, active state |
| `--v2-text-subtle` | `#7a8080` | `#6a7272` | Metadata, units, timestamps, muted labels |
| `--v2-text-on-accent` | `#06120f` | `#ffffff` | Text placed on brand/accent surfaces |

#### Line Separators

| Token | Dark | Light | Role |
|-------|------|-------|------|
| `--v2-line` | `#1c2020` | `#e1e5e5` | Default hairline (section borders, KV rows, sidebar edge) |
| `--v2-line-strong` | `#2b3030` | `#cfd4d4` | Emphasized separator (`.v2-rule--strong`, scrollbar thumb) |
| `--v2-line-accent` | `#1f3a30` | `#b9d9cf` | Brand-tinted separator (accent-edge rules) |

#### Brand & Status

| Token | Dark | Light | Role |
|-------|------|-------|------|
| `--v2-brand` | `#00e599` | `#059669` | Primary accent — active icons, brand button, sparkline |
| `--v2-status-running` | `#34d399` | `#16a34a` | Running / healthy / delta up |
| `--v2-status-warning` | `#fbbf24` | `#d97706` | Degraded / warning |
| `--v2-status-error` | `#f87171` | `#dc2626` | Error / stopped / delta down |

#### Telemetry & Chart

| Token | Dark | Light | Role |
|-------|------|-------|------|
| `--v2-tel-in` | `#34d399` | `#16a34a` | Inbound traffic / receive series |
| `--v2-tel-out` | `#fb7185` | `#e11d48` | Outbound traffic / transmit series |
| `--v2-track` | `#1a1d1d` | `#e2e6e6` | Gauge empty track background |
| `--v2-glyph` | `#9aa0a0` | `#5a6363` | Theme-toggle icon color |

---

## 4. File Map

```
V2/
├── css/
│   ├── fonts.css                 — @font-face declarations for self-hosted Google Sans Code
│   ├── tokens.css                — all structural tokens: type, spacing, radius, motion, layout shell
│   ├── theme-dark.css            — dark palette color tokens (default theme)
│   ├── theme-light.css           — light palette color tokens
│   ├── base.css                  — viewport lock, scroll reset, focus ring, element reset, typography utils
│   ├── synteq-ui-v2.css          — master @import bundle (single <link> for consumers)
│   └── components/
│       ├── icons.css             — inline SVG icon sizing (.v2-icon) and tint modifier classes
│       ├── shell.css             — viewport-locked grid (.v2-app), dock collapse, content scroll region
│       ├── sidebar.css           — sticky bottom dock, nav items, brand and account controls
│       ├── topbar.css            — topbar layout, sidebar toggle button, breadcrumb, search, icon buttons
│       ├── content.css           — section separators, section head, layout grids (.v2-grid), stat strip
│       ├── data.css              — stat blocks, KV rows, slim gauges, sparklines, bar chart, legend, status dots
│       ├── controls.css          — buttons (all variants), segmented bar, text input, badges, kbd pill, avatar
│       └── motion.css            — fade-up animation, stagger children, skeleton shimmer, soft pulse, hover lift
├── js/
│   └── synteq-ui-v2.js           — zero-dependency runtime: theme, dock, scroll-spy, toast, command palette, data helpers
├── fonts/
│   ├── GoogleSansCode-Regular.ttf    — weight 400 (SIL OFL)
│   ├── GoogleSansCode-Medium.ttf     — weight 500 (SIL OFL)
│   └── GoogleSansCode-SemiBold.ttf   — weight 600 (SIL OFL)
└── examples/
    └── dashboard.html            — full demo: VPS detail dashboard with all components
```

---

## 5. Component Anatomy

### 5.1 App Shell

The shell is a CSS Grid that locks to the viewport. It never allows body scroll.

```
.v2-app
├── .v2-aside          ← grid-area: aside
├── .v2-topbar         ← grid-area: topbar
└── .v2-main           ← grid-area: main
    └── .v2-content    ← the only scrollable surface
```

| Class | Purpose |
|-------|---------|
| `.v2-app` | Root grid container. `height: 100dvh; overflow: hidden`. Dock and content occupy dedicated grid rows. |
| `.v2-app.nav-collapsed` | Sets dock row to zero and slides navigation away with a CSS grid transition. |
| `.v2-aside` | Sticky bottom dock. `min-width: 0`, `overflow: visible` so the More drop-up can escape upward. |
| `.v2-topbar` | Header row. Hairline `border-bottom`. Gains `.is-scrolled` box-shadow when content scrolls past 4px. |
| `.v2-main` | Remaining canvas. `overflow: hidden`, `display: flex`. Never scrolls itself. |
| `.v2-content` | **The only default vertical scroll region**. Padded, flex column with `gap: --v2-space-7` between sections. |

---

### 5.2 Sidebar Nav

| Class | Purpose |
|-------|---------|
| `.v2-aside__brand` | Top bar — aligns to topbar height. Contains brand mark and product name. |
| `.v2-aside__brand-mark` | 20×20 brand icon square (brand color background, `--v2-radius-micro`). |
| `.v2-nav` | Horizontal dock navigation. `flex: 1`, safe-centred while items fit, drag-scrollable / wheel-scrollable once they overflow. |
| `.v2-nav__group-label` | **Not rendered in the dock** (`display: none`). Use icon + label items only. |
| `.v2-nav__item` | Navigation link. `min-width: var(--v2-nav-item-w)`, min height 44px. `border-radius: --v2-radius-control`. |
| `.v2-nav__item--active` | Active page state. Brand-tinted background (`brand 12%`), `--v2-fw-semibold`, 3px inset brand bar, icon shifts to `--v2-brand`. |
| `.v2-nav__badge` | Absolute counter badge in the item's top-right corner, tabular nums, `--v2-text-subtle`. |
| `.v2-nav__more` | Injected by the runtime when items overflow. Opens the drop-up. Hidden (and removed from the tab order) otherwise. |
| `.v2-nav__menu` | Drop-up panel anchored above the dock, listing every off-screen destination. `.v2-nav__menu-item` mirrors the item styling. |
| `.v2-aside__footer` | Trailing user row. `border-left: 1px solid --v2-line`. Contains `.v2-avatar`, username, status dot. |

---

### 5.3 Topbar

| Class | Purpose |
|-------|---------|
| `.v2-sidebar-toggle` | **The one and only sidebar toggle button** — lives in `.v2-topbar`. Wire with `data-v2-sidebar-toggle`. Contains `.icon-menu` and `.icon-close` (CSS swaps them). |
| `.v2-topbar__left` | Left cluster: toggle + breadcrumb + page title. `flex: 1`, `min-width: 0`. |
| `.v2-topbar__crumb` | Breadcrumb link. `--v2-text-sm`, `--v2-text-subtle`. Hidden at `≤380px`. |
| `.v2-topbar__sep` | Breadcrumb separator glyph (e.g. `/`). `opacity: 0.35`. Hidden at `≤380px`. |
| `.v2-topbar__title` | Current page name. `--v2-text-md`, `--v2-fw-medium`, `--v2-text-strong`. Ellipsis overflow. |
| `.v2-topbar__right` | Right cluster: search trigger, icon buttons. `flex-shrink: 0`. |
| `.v2-search` | Command palette / search trigger button. `--v2-inset` background, `--v2-radius-control`, `height: 32px`. |
| `.v2-iconbtn` | Generic icon-only button (32×32). `--v2-radius-control`. **Always requires `aria-label`**. |
| `.v2-theme-toggle` | Theme toggle variant of `.v2-iconbtn`. Wire with `data-v2-toggle-theme`. CSS swaps `.v2-icon--sun` and `.v2-icon--moon` by `data-theme` attribute. |

---

### 5.4 Sections & Separators

The **only** structural separator in V2 is the `border-top` on `.v2-section`.

| Class | Purpose |
|-------|---------|
| `.v2-section` | Content block. `border-top: 1px solid --v2-line`. `padding-top: --v2-space-6`. |
| `.v2-section:first-child` | Removes `border-top` and `padding-top` — no separator before the first block. |
| `.v2-section__head` | Flex row: section title (left) + meta/action (right). **No `border-bottom`** — intentional. |
| `.v2-section__title` | Label text. `--v2-text-xs`, `--v2-fw-semibold`, uppercase, `--v2-text-subtle`. |
| `.v2-section__meta` | Trailing info (e.g. "updated 5s ago"). `--v2-text-xs`, `--v2-text-subtle`, tabular nums. |
| `.v2-rule` | Explicit opt-in `<hr>` separator. Not auto-applied anywhere. |
| `.v2-rule--strong` | `.v2-rule` with `--v2-line-strong` color. |
| `.v2-rule--dashed` | `.v2-rule` with `border-top-style: dashed`. |

Layout helpers inside sections:

| Class | Columns |
|-------|---------|
| `.v2-grid` | Base grid with `gap: --v2-space-5` |
| `.v2-grid--2` | `repeat(2, 1fr)` → collapses to `1fr` at `≤720px` |
| `.v2-grid--3` | `repeat(3, 1fr)` → collapses to `1fr` at `≤720px` |
| `.v2-grid--auto` | `1.4fr 1fr` (content + sidebar panel) → collapses at `≤720px` |
| `.v2-stat-strip` | Flex-wrap row of stat blocks. Gap only — no vertical dividers. |

---

### 5.5 Data Visualization

All data components are text-first. No canvas, no third-party charting library.

#### Stat Block

| Class | Purpose |
|-------|---------|
| `.v2-stat` | Flex column wrapper. `gap: --v2-space-1`. |
| `.v2-stat__label` | Metric name. `--v2-text-xs`, uppercase, `--v2-text-subtle`. |
| `.v2-stat__value` | Primary number. `--v2-text-2xl`, `--v2-fw-medium`, `--v2-text-strong`, tabular nums. |
| `.v2-unit` | Unit suffix inside `.v2-stat__value`. `--v2-text-md`, `--v2-text-subtle`, `--v2-fw-regular`. |
| `.v2-stat__delta` | Change indicator. `.v2-stat__delta--up` → green. `.v2-stat__delta--down` → red. |

#### Key-Value Rows

| Class | Purpose |
|-------|---------|
| `.v2-kv` | Flex column container. No outer border. |
| `.v2-kv__row` | One property row. `border-top: 1px solid --v2-line`. First child gets no border. |
| `.v2-kv__label` | Property name. `--v2-text-subtle`. |
| `.v2-kv__value` | Property value. `--v2-text-strong`, tabular nums, right-aligned. |

#### Slim Gauge

| Class | Purpose |
|-------|---------|
| `.v2-gauge` | Flex column container. Pair with `data-v2-gauge="0–100"` for auto-init. Add `role="progressbar"` with ARIA attrs. |
| `.v2-gauge__track` | `6px` tall track bar. Background: `--v2-track`. `overflow: hidden`. |
| `.v2-gauge__fill` | Absolute fill bar. Width driven by JS (`SynteqV2.renderGauge`). Transitions via `--v2-dur-slow`. |
| `.v2-gauge__fill--ok` | Green fill (`< 75%`, auto-applied by JS). |
| `.v2-gauge__fill--warn` | Amber fill (`75–89%`). |
| `.v2-gauge__fill--err` | Red fill (`≥ 90%`). |
| `.v2-gauge__fill--brand` | Brand-color fill — request it explicitly: `renderGauge(fill, 100, { kind: 'brand' })`. |
| `.v2-gauge__fill` + `{ kind: 'neutral' }` | No state colour (inherits `--v2-text-strong`). |

#### Bar Chart

| Class | Purpose |
|-------|---------|
| `.v2-bars` | Grid container. Column count driven by `--v2-bars-cols` CSS var. Height 72px. |
| `.v2-bars__col` | One time-sample column. `flex-direction: column-reverse`. |
| `.v2-bars__seg` | One data segment within a column. `border-radius: --v2-radius-micro`. |
| `.v2-bars__seg--in` | Inbound segment. Color: `--v2-tel-in`. |
| `.v2-bars__seg--out` | Outbound segment. Color: `--v2-tel-out`, `opacity: 0.55` (full on hover). |
| `.v2-bars__col--pad` | Empty leading column injected by `renderBars({ minCols })`; holds the geometry, carries no data. |
| `.v2-bars[data-v2-bars-empty]` | Set when the series is empty (styled at 35 % opacity) so the caller can show a hint. |

#### Sparkline

| Class | Purpose |
|-------|---------|
| `.v2-spark` | SVG element wrapper. `display: block`, `height: 40px`. |
| `.v2-spark__line` | `<polyline>` path. `stroke: --v2-brand`, `stroke-width: 1.5`. |
| `.v2-spark__area` | `<polygon>` fill. `fill: --v2-brand`, `opacity: 0.12`. |
| `.v2-spark__dot` | `<circle>` at latest data point. |
| `.v2-spark--tall` | `--v2-spark-h: 56px` (default 40px). Override the height on any instance with `style="--v2-spark-h:64px"`. |
| `.v2-spark[data-v2-spark-empty]` | Set by `renderSparkline()` when fewer than 2 samples exist; the path is cleared so stale data never lingers. |
| `.v2-spark--out` | Modifier: switches all colors to `--v2-tel-out` palette. |

#### Status Dot

| Class | Colour | Use for |
|---|---|---|
| `.v2-dot` | `--v2-status-running` (default) | online / healthy |
| `.v2-dot--ok` | `--v2-status-running` | explicit healthy alias |
| `.v2-dot--warn` | `--v2-status-warning` | degraded, syncing |
| `.v2-dot--err` | `--v2-status-error` | down, failing |
| `.v2-dot--idle` | `--v2-text-subtle` | unknown, connecting |
| `.v2-dot--stopped` | `--v2-status-error` | legacy alias for `--err` |
| `.v2-dot--reboot` | `--v2-status-warning` + pulse | restarting |

**One signal per state - dot + text OR badge + text, never both.** A state is
rendered either as a dot with a label (`.v2-status` = `.v2-dot*` + text) or as a
coloured badge with the label (`.v2-badge--ok|warn|err`). Do not nest a `.v2-dot`
inside a `.v2-badge`: the dot and the badge tint say the same thing twice and the
5 px dot reads as a stray pixel. Existing markup that did this still renders
(`.v2-badge .v2-dot` shrinks to 5 px), but it is deprecated.

#### Data Table

| Class | Purpose |
|---|---|
| `.v2-table-wrap` | Horizontal scroll wrapper with a thin scrollbar. Use it whenever rows can exceed the content width. |
| `.v2-table` | `border-collapse`, `--v2-text-sm`, tabular numbers. `th` = uppercase micro label with a bottom hairline; `td` = hairline top border; rows hover with `--v2-hover`. |
| `.v2-table__num` | Right-aligned mono cell (counts, epochs, byte values). |
| `.v2-table__mono` | Mono cell, default alignment (addresses, hashes). |
| `.v2-table__mute` | Quiet metadata cell. |
| `.v2-table tr.is-stale` / `td.is-stale` | Dim a cached/stale row without hiding it. |
| `.v2-table--fixed` | `table-layout: fixed` for equal-width columns. |

Tables are text-first: no zebra striping, no header background, no outer border —
only the hairlines the framework already uses.

#### Log Viewer

| Class | Purpose |
|---|---|
| `.v2-log` | Flex column, mono 11 px / 1.55. |
| `.v2-log--scroll` | `max-height: var(--v2-log-h, 420px)`, thin scrollbar, `overscroll-behavior: contain`. |
| `.v2-log--bordered` | Hairline top and bottom separators. |
| `.v2-log__row` | One line: timestamp · level · component · message, with a 2 px transparent left rail. |
| `.v2-log__row--warn` / `--error` | Amber / red left rail; the error row also tints the background. |
| `.v2-log__ts` | Mono timestamp, `--v2-text-subtle`, tabular nums. |
| `.v2-log__level` + `--warn` / `--error` / `--fatal` | Fixed-width level label; colour follows severity. |
| `.v2-log__comp` | Brand-coloured component tag, truncated with ellipsis. |
| `.v2-log__msg` | Message body, `overflow-wrap: anywhere` so long frames never overflow. |
| `.v2-log__empty` | Centered "waiting for stream" placeholder (sans-serif, `--v2-text-xs`). |

Responsive: component tag hidden at `≤720px`, timestamp hidden at `≤420px`.

---

### 5.6 Controls

#### Buttons

| Class | Appearance |
|-------|-----------|
| `.v2-btn` | Base: `--v2-inset` background, `--v2-text`, `height: 32px`, `--v2-radius-control`. |
| `.v2-btn--ghost` | Transparent background, `--v2-text-subtle`. |
| `.v2-btn--primary` | `--v2-text-strong` background, inverted text. High-emphasis action. |
| `.v2-btn--brand` | `--v2-brand` background, accent text. |
| `.v2-btn--danger` | Tonal red background (`16%`), red text. Destructive action. |
| `.v2-btn--icon` | Square variant: `width: 32px`, `padding: 0`. **Requires `aria-label`**. |
| `.v2-btn--block` | `width: 100%`. Use inside `.v2-btn__stack` for a vertical action group. |
| `.v2-copy--ok` | Clipboard confirmation state added by the runtime for 1.8 s (green tint). |
| `.v2-tip` | Transient anchored label (`SynteqV2.tip(el, msg)`): inverted surface, `--v2-radius-micro`, `--v2-text-xs`, `pointer-events: none`, `z-index: 60`. |
| `.v2-tip--ok` / `--warn` / `--err` | Tinted variants of the tip for success / warning / failure feedback. |
| `.v2-tip.is-out` | Fade-out state applied before the runtime removes the node. |

#### Segmented Bar

| Class | Purpose |
|-------|---------|
| `.v2-seg` | Flex container. `--v2-inset` background, `--v2-radius-control`. Add `role="group"` + `aria-label`. |
| `.v2-seg__btn` | One segment. Hairline right border between siblings. |
| `.v2-seg__btn--active` | Active segment. `--v2-hover` background, `--v2-fw-medium`. |
| `.v2-seg__btn--icon` | Icon-only segment variant: narrower padding. |

#### Other Controls

| Class | Purpose |
|-------|---------|
| `.v2-input` | Text input. `--v2-inset` background, `--v2-radius-control`, `height: 32px`. |
| `.v2-badge` | Status chip. `--v2-radius-micro`. Modifiers: `--brand`, `--ok`, `--warn`, `--err`. |
| `.v2-kbd` | Keyboard shortcut pill. Mono font, `--v2-radius-micro`, `height: 18px`. |
| `.v2-avatar` | User monogram square. `26×26px`, `--v2-radius-micro`, brand tint background. |

---

### 5.7 Motion

All animations use `--v2-ease` and are globally suppressed by `prefers-reduced-motion` in `base.css`.

| Class / Attribute | Behavior |
|-------------------|---------|
| `.v2-fade-up` | Single element mount: fade in + `6px` upward drift over `--v2-dur-normal`. |
| `.v2-stagger` | Parent: each child gets `v2-fade-up` with 60ms incremental delays (up to child 6+). |
| `data-v2-stagger` | Triggers `.v2-stagger` via IntersectionObserver when element enters the viewport (JS-managed). |
| `.v2-live` | Soft pulse (opacity `1→0.5→1`) on a `2s` loop. Used for live data indicators. |
| `.v2-skeleton` | Shimmer placeholder for async content. Linear gradient sweep animation. |
| `.v2-row-hover` | Hover lift utility. Transitions `background-color` at `--v2-dur-fast`. |

---

### 5.8 Icons

Icons are **inline SVG only** — no icon font, no `<img>`. Every icon SVG must use `aria-hidden="true"` (the parent button/label provides the accessible name).

```html
<svg class="v2-icon v2-icon--16" viewBox="0 0 24 24" aria-hidden="true">
  <!-- 24×24 stroke icon path (Lucide-compatible) -->
</svg>
```

#### Size Modifiers

| Class | Size |
|-------|------|
| `.v2-icon--14` | `14 × 14px` |
| `.v2-icon--16` | `16 × 16px` |
| `.v2-icon--18` | `18 × 18px` |
| `.v2-icon--20` | `20 × 20px` |

#### Tint Modifiers

| Class | Color Token |
|-------|------------|
| `.v2-icon--mute` | `--v2-text-subtle` |
| `.v2-icon--brand` | `--v2-brand` |
| `.v2-icon--ok` | `--v2-status-running` |
| `.v2-icon--warn` | `--v2-status-warning` |
| `.v2-icon--err` | `--v2-status-error` |

All icons inherit `stroke: currentColor` — tint is set by parent element color or a modifier class. `.v2-ico-label` is a flex wrapper for icon + text pairs.

---

## 6. Responsive Breakpoints

| Breakpoint | What changes |
|------------|-------------|
| `> 1080px` | Full-width content column (centred, max `--v2-content-max`) with the sticky bottom dock; all destinations fit. |
| `≤ 1080px` | Dock items narrow to `78px`; overflow activates drag-scroll + the `More` drop-up. |
| `≤ 860px` | Compact brand/account affordances, 72px nav items, 44px+ touch targets, wider drop-up trigger. |
| `≤ 720px` | `.v2-grid--2`, `.v2-grid--3` collapse to a single column; `.v2-grid--auto` already collapsed at `900px`; **`.v2-stat-strip` becomes a 2-column grid** (values wrap instead of overflowing); explorer previews tighten. |
| `≤ 600px` | Topbar search text (`.v2-search__text`) and `.v2-kbd` pill are hidden — search becomes icon-only. Topbar padding reduces. |
| `≤ 520px` | `.v2-stat__value` reduces to `--v2-text-xl`. `.v2-stat-strip` gap tightens. Dock brand/items compress (48px brand, 64px items). |
| `≤ 420px` | `--v2-topbar-h` reduces to `48px`. Content padding and section gap compress. |
| `≤ 380px` | Topbar breadcrumb (`.v2-topbar__crumb`) and separator (`.v2-topbar__sep`) are hidden; dock brand 42px, items 58px. |
| `height ≤ 480px` + landscape | `--v2-bottomnav-h` compresses to `52px`, dock items become icon+label rows, and sections stop forcing a full-screen height. |

---

## 7. Navigation Dock Toggle Behavior

There is **one toggle button** in the entire UI: `.v2-sidebar-toggle` inside `.v2-topbar`. It controls the bottom dock and updates `aria-expanded`.

Wire it with the attribute `data-v2-sidebar-toggle`. The JS runtime attaches the click handler automatically on `DOMContentLoaded`.

### All Viewports — Hide/Show Mode

- Toggling sets/removes `.nav-collapsed` on `.v2-app` and updates `aria-expanded`.
- The bottom dock row transitions to zero; the dock slides down with opacity transition.
- State is persisted under `sq-v2-sidebar` (`"open"` / `"closed"`) and restored on load.
- Navigation anchors smooth-scroll inside `.v2-content`; scroll-spy keeps `aria-current` and active state synchronized.
- When the dock overflows, the strip is drag-scrollable and a `More` drop-up lists off-screen destinations. `Escape` closes the drop-up (it does not hide the dock).

### Icon Swap

The toggle button contains two icon elements:

```html
<button class="v2-sidebar-toggle" data-v2-sidebar-toggle aria-label="Toggle sidebar">
  <svg class="v2-icon v2-icon--18 icon-menu" ...></svg>
  <svg class="v2-icon v2-icon--18 icon-close" ...></svg>
</button>
```

CSS rules swap their `display` based on `.nav-collapsed`. The open state shows the close glyph and the collapsed state shows the menu glyph.

---

## 8. Dos and Don'ts

| | Rule |
|---|------|
| ✅ DO | Use `--v2-*` tokens for every color, size, spacing, and timing value. Never write raw hex, `px`, or `ms` values directly in component styles. |
| ✅ DO | Use `.v2-section` `border-top` as the only separator between content blocks. One rule, one place. |
| ✅ DO | Apply `v2-scroll` and `overflow-y: auto` exclusively on `.v2-content` (or other explicitly designated scroll regions). Never on `body`, `html`, `.v2-main`, or `.v2-app`. |
| ✅ DO | Add `aria-label` to every icon-only button (`.v2-iconbtn`, `.v2-btn--icon`, `.v2-sidebar-toggle`). |
| ✅ DO | Load fonts from `V2/fonts/` only — they are self-hosted. Reference them via `fonts.css` which is already imported by `synteq-ui-v2.css`. |
| ✅ DO | Add `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` on every `.v2-gauge` track element. |
| ✅ DO | Use `data-v2-stagger` on containers whose children should animate in on scroll entry. Let JS handle the IntersectionObserver — do not manually add `.v2-stagger` in HTML. |
| ✅ DO | Set `data-theme` on `<html>` — not on `<body>` or inner elements — to apply theme tokens to the full document. |
| ❌ DO NOT | Add a second sidebar toggle button inside `.v2-aside`. There is exactly one toggle, in the topbar. |
| ❌ DO NOT | Add `border`, `box-shadow`, or a distinct `background-color` to create card-like wrappers around content. Use `.v2-section` separators instead. |
| ❌ DO NOT | Add `border-bottom` to `.v2-section__head`. The separator above the section is sufficient — a second rule directly below the header creates a double-line artifact. |
| ❌ DO NOT | Use external font CDNs (Google Fonts, Bunny Fonts, etc.). The Google Sans Code files are included under SIL OFL in `V2/fonts/`. |
| ❌ DO NOT | Override `--v2-aside-w` to create a wider sidebar — it is already at its maximum (`240px`). If you need more navigation space, rely on the dock overflow behaviour (drag-scroll + More drop-up) instead of adding group labels. |
| ❌ DO NOT | Directly set `body.style.overflow = 'hidden'` in your own JS except through the sidebar API — the base CSS already locks `overflow: hidden` on `html` and `body`. The sidebar runtime does set this transiently on mobile to prevent scroll bleed during drawer-open; do not fight it. |

---

## 9. Accessibility

Synteq UI V2 targets **WCAG 2.2 Level AA**. Full validation requires manual testing with assistive technologies.

### Focus Management

- `:focus-visible` is applied globally in `base.css` with a `2px solid --v2-text-strong` outline and `outline-offset: 2px`.
- `:focus` (mouse click) is suppressed — outline only appears on keyboard navigation.
- Focus `border-radius` matches `--v2-radius-micro` to avoid sharp clipping artifacts.

### Color Contrast

All theme color pairs are verified at ≥ 4.5:1 against their respective backgrounds:

| Pair | Theme | Target Ratio |
|------|-------|-------------|
| `--v2-text` on `--v2-canvas` | Both | ≥ 4.5:1 (AA) |
| `--v2-text-strong` on `--v2-canvas` | Both | ≥ 7:1 (AAA) |
| `--v2-text-subtle` on `--v2-canvas` | Both | Approaching 4.5:1 — use for non-essential metadata only |
| `--v2-brand` on `--v2-canvas` | Dark | ≥ 4.5:1 |
| `--v2-brand` on `--v2-canvas` | Light | ≥ 4.5:1 (tuned to `#059669`) |

### Interactive Element Roles

- Gauge track elements: `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`. The JS `renderGauge()` function updates `aria-valuenow` automatically on each call.
- Bar chart containers: `role="img"`, `aria-label="[chart description]"`.
- Sparkline SVGs: `role="img"`, `aria-label="[metric] trend"`.
- Segmented bars: `role="group"`, `aria-label="[group name]"` on the `.v2-seg` wrapper.
- All icon-only interactive elements (`.v2-iconbtn`, `.v2-btn--icon`, `.v2-sidebar-toggle`): explicit `aria-label`.
- Decorative icons: `aria-hidden="true"` on every `<svg>`.

### Reduced Motion

`base.css` contains a global `@media (prefers-reduced-motion: reduce)` rule that forces:

```css
animation-duration: 0.001ms !important;
animation-iteration-count: 1 !important;
transition-duration: 0.001ms !important;
scroll-behavior: auto !important;
```

This applies to all elements, including gauge fills, sparklines, skeleton shimmers, and stagger animations. No additional per-component reduced-motion handling is needed.

The JS runtime also checks `prefersReduced()` before attaching the IntersectionObserver for `.v2-stagger` — if reduced motion is active, the observer is never created and no mount animations fire.

### Screen Reader Utilities

`.v2-sr-only` provides a standards-compliant visually-hidden class for supplemental screen-reader text:

```html
<button class="v2-btn v2-btn--icon" aria-label="Copy IP">
  <svg class="v2-icon v2-icon--16" aria-hidden="true">...</svg>
</button>
```

Use `aria-label` on the button directly (preferred) or `.v2-sr-only` text inside it as an alternative.
