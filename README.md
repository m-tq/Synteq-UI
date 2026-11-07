# Synteq UI V2

A clean, viewport-locked dashboard framework built on six hard rules:

1. **No page scrollbar** — the shell matches the screen exactly; only in-content regions scroll
2. **Responsive on any screen** — fluid type, clamp-based layout, centred sections, sticky bottom navigation dock that centre-aligns, drag-scrolls and exposes a `More` drop-up when it overflows
3. **Simple & lightweight** — lean token set, flat surfaces, zero dependencies
4. **No cards or wrappers** — visual hierarchy comes from hairline line separators only
5. **Lightweight motion** — subtle fade-up mounts, smooth gauge fills, pulse indicators; auto-disabled with `prefers-reduced-motion`
6. **Inline icons** — every label carries an SVG icon for instant context recognition

---

## File Map

```
V2/
├── css/
│   ├── tokens.css            — fluid type scale, 4px spacing, radii, motion, layout shell vars
│   ├── theme-dark.css        — dark palette (default)
│   ├── theme-light.css       — light palette
│   ├── base.css              — viewport lock, in-content scroll, reset, a11y, typography utils
│   ├── synteq-ui-v2.css      — master @import (single <link> for consumers)
│   └── components/
│       ├── icons.css         — inline SVG icon sizing & tint helpers
│       ├── shell.css         — viewport-locked app grid with bottom dock
│       ├── sidebar.css       — sticky bottom navigation dock
│       ├── topbar.css        — breadcrumb, search trigger, icon buttons, scroll shadow hook
│       ├── content.css       — sections, hairline separators, layout grids, stat strip
│       ├── data.css          — stat blocks, KV rows, slim gauges, sparkline, bar chart, data table, log viewer, legend
│       ├── controls.css      — buttons, segmented bar, input, badges, kbd pill, avatar
│       └── motion.css        — fade-up, stagger, shimmer skeleton, soft pulse, hover lift
├── js/
│   └── synteq-ui-v2.js       — runtime: theme, dock, scroll-spy, gauges, charts, toast, command palette
└── examples/
    ├── dashboard.html        — production-style VPS detail dashboard
    └── components.html       — interactive component explorer
```

---

## Quick Start

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="V2/css/synteq-ui-v2.css" />
</head>
<body>

  <div class="v2-app">
    <aside class="v2-aside">...</aside>
    <header class="v2-topbar">...</header>
    <main class="v2-main">
      <div class="v2-content v2-scroll">
        <!-- your sections here -->
      </div>
    </main>
  </div>

  <script src="V2/js/synteq-ui-v2.js"></script>
</body>
</html>
```

The `v2-app` grid locks to the viewport. `v2-content.v2-scroll` is the only element that produces a scrollbar. Navigation is a sticky bottom dock on desktop and mobile; the topbar toggle hides it without changing document scroll.

---

## Navigation Dock

- Items are **icon + label only** — the dock never renders group labels such as
  “Workspace” or “Account”. Remove `.v2-nav__group-label` from navigation markup
  (the class is hidden by CSS for backwards compatibility).
- While destinations fit, the strip is centred with CSS `safe center` (never
  clipped on the left). As soon as they overflow:
  - the strip can be **dragged** (mouse/pen) and accepts horizontal wheel input;
  - the runtime injects a **`More` drop-up** that lists every off-screen
    destination (`SynteqV2.initNavDock()` runs automatically);
  - the active item is scrolled into view when the scroll-spy changes.
- Nothing extra to wire: `initNavDock()` and the scroll-spy are part of the
  default runtime initialisation.

### Section links & deep links

Nav items use `href="#section-id"`, so the runtime can both scroll and keep the
URL shareable:

```html
<a href="#logs" class="v2-nav__item">Logs</a>
```

- Clicking a nav item scrolls the section into view, updates the active state
  **and** writes the hash with `history.replaceState` (no jump, shareable URL).
- Loading `/#logs` scrolls to that section once the page settles; `hashchange`
  is honoured as well.
- Programmatic scroll (e.g. after an async render changed the layout):

```js
SynteqV2.scrollToSection('logs');            // or '#logs'
SynteqV2.scrollToSection('logs', { behavior: 'auto' });
```

→ Returns `false` when the id does not exist.

---

## Copy to clipboard

Add `data-v2-copy` to any button or link — the runtime handles it by delegation,
so buttons created *after* page load work too:

```html
<button class="v2-btn v2-btn--icon" aria-label="Copy address"
        data-v2-copy="oct3oMBjs5Jx…">⧉</button>
```

- Empty `data-v2-copy=""` copies the text of the button's **previous sibling**
  (handy for label/value pairs).
- The attribute value is read at click time, so you can keep it in sync with
  live data without re-binding.
- Feedback: a **"Copied" tip** appears above the button, `.v2-copy--ok` tints it
  green for 1.8 s and `aria-label` flips to the confirmation text. Customise the
  wording per button with `data-v2-copy-label="Address copied"`; a failed copy
  shows `Copy failed` in the error tint instead.
- On insecure origins (`http://` without a secure context) it falls back to a
  hidden textarea + `execCommand('copy')` instead of failing silently.

---

## Click feedback

Every control (`.v2-btn`, `.v2-iconbtn`, `.v2-seg__btn`, `.v2-search`, the
sidebar toggle, the dock's `More` button and anything with `data-v2-copy`) gets
the same press treatment: a 1 px push, a 0.985 inward scale and an 8 %
`currentColor` wash. No elevation, no ripple library.

For your own actions, show the same transient label the copy handler uses:

```js
SynteqV2.tip(button, 'Refreshed');                    // ok tint, 1.5 s
SynteqV2.tip(button, 'Auto-refresh paused', { kind: 'warn' });
SynteqV2.tip(button, 'Request failed', { kind: 'err', duration: 2500 });
```

The tip is fixed-positioned above the anchor (below when there is no room),
clamped to the viewport, `role="status"` for assistive tech, and only one exists
at a time — rapid clicks replace it instead of stacking.

---

## Theme

Set `data-theme="dark"` or `data-theme="light"` on `<html>`. Switches at runtime:

```js
SynteqV2.setTheme('light');
SynteqV2.toggleTheme();
SynteqV2.getTheme(); // → 'dark' | 'light'
```

Add `data-v2-toggle-theme` to any button for automatic wiring.  
Theme preference is persisted in `localStorage` under key `sq-v2-theme`.

---

## Sections & Line Separators

V2 has no cards. Content is organized into `.v2-section` blocks separated by a single `1px` top border. Every section fills the space between the topbar and the dock and **centres its content vertically**, while the section column is **centred horizontally** at `--v2-content-max` (default `1200px`).

```html
<div class="v2-section">
  <div class="v2-section__head">
    <span class="v2-section__title">Resource Usage</span>
    <span class="v2-section__meta">updated 5s ago</span>
  </div>
  <!-- content -->
</div>
```

Add `.v2-section--top` to opt out of vertical centring, or `.v2-section--compact`
to drop the full-viewport minimum height. Nested sections (for example inside a
live preview) never inherit the viewport height.

For inline stat separation, use the stat strip (vertical hairlines between items):

```html
<div class="v2-stat-strip">
  <div class="v2-stat">
    <span class="v2-stat__label">vCPU</span>
    <div class="v2-stat__value">4 <span class="v2-unit">cores</span></div>
  </div>
  <div class="v2-stat">...</div>
</div>
```

---

## Gauges

Add `data-v2-gauge="72"` to the track element and `.v2-gauge__fill` inside it. `initGauges()` runs automatically on DOMContentLoaded.

```html
<div class="v2-gauge" data-v2-gauge="72"
     role="progressbar" aria-label="CPU" aria-valuenow="72"
     aria-valuemin="0" aria-valuemax="100">
  <div class="v2-gauge__head">
    <span class="v2-gauge__label">CPU</span>
    <span class="v2-gauge__value">72<span class="v2-gauge__max"> / 100%</span></span>
  </div>
  <div class="v2-gauge__track">
    <div class="v2-gauge__fill"></div>
  </div>
</div>
```

Update imperatively:

```js
const fill = document.querySelector('.v2-gauge__fill');
SynteqV2.renderGauge(fill, 88);                       // auto-colors: ok / warn / err
SynteqV2.renderGauge(fill, 100, { kind: 'brand' });   // quorum / bandwidth gauge
SynteqV2.renderGauge(fill, 42,  { kind: 'neutral' }); // no state colour
```

Color thresholds: `< 75%` → green, `75–89%` → amber, `≥ 90%` → red.

`kind` options:

| Value | Fill colour | Use for |
|---|---|---|
| `auto` (default) | ok / warn / err by threshold | CPU, memory, disk |
| `brand` | `--v2-brand` | quorum progress, bandwidth |
| `neutral` | `--v2-text-strong` | secondary/comparison bars |

---

## Bar Chart (Network I/O)

```js
// samples: Array of [inPct, outPct] — each 0–100
SynteqV2.renderBars(document.getElementById('net-bars'), [
  [12, 4], [18, 6], [35, 10], [52, 16], ...
], { minCols: 24, stepSec: 5 });
```

| Option | Default | Purpose |
|---|---|---|
| `minCols` | `0` | Pad the series with empty leading columns so a short series still renders slim bars instead of a few fat ones |
| `stepSec` | `null` | Seconds per sample; turns the tooltip into `T-30s ↓ 3.2% ↑ 1.1%` |

```html
<div class="v2-bars" id="net-bars"
     role="img" aria-label="Network I/O chart"
     style="--v2-bars-cols:24;"></div>
```

When the series is empty the container gets `data-v2-bars-empty="true"` (styled at 35 % opacity) so you can show a "collecting samples…" hint next to it.

---

## Sparkline

```js
SynteqV2.renderSparkline(
  document.getElementById('cpu-spark'),
  [18, 22, 31, 40, 36, 34, 38, 35, 33, 34] // raw values, auto-scaled
);
```

```html
<svg class="v2-spark" id="cpu-spark"
     viewBox="0 0 200 40" preserveAspectRatio="none"
     role="img" aria-label="CPU trend"></svg>
```

Add `.v2-spark--out` to use the outbound (red) color palette.
`.v2-spark--tall` raises the chart to 56 px (or set `--v2-spark-h` on any
instance). When fewer than two samples are available the runtime clears the path
and sets `data-v2-spark-empty="true"` instead of leaving stale data on screen.

The sparkline is drawn in **viewBox units** (the `<svg viewBox>` above, defaulting to
`0 0 200 40`), so the same path scales to any rendered width without overflowing.
The series is remembered and redrawn on resize; `SynteqV2.initSparklines()` renders
every `.v2-spark` automatically, including `<svg class="v2-spark" data-v2-spark="12,18,9,22">`.

---

## Data Table

Slim, text-first tables for peer lists, ledger rows, log summaries — hairline rows
only, tabular numbers, no zebra striping.

```html
<div class="v2-table-wrap">
  <table class="v2-table">
    <thead>
      <tr>
        <th scope="col">Peer</th>
        <th scope="col" class="v2-table__num">Head epoch</th>
        <th scope="col" class="v2-table__num">Lag</th>
        <th scope="col">Source</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="v2-table__mono">oct3SUwRsi…v2v4Bm</td>
        <td class="v2-table__num">1,756,258</td>
        <td class="v2-table__num">8</td>
        <td class="v2-table__mute">epoch_root</td>
      </tr>
      <tr class="is-stale">…</tr>
    </tbody>
  </table>
</div>
```

| Class | Purpose |
|---|---|
| `.v2-table-wrap` | Horizontal scroll container with a thin scrollbar (long addresses / wide tables) |
| `.v2-table` | `border-collapse`, `--v2-text-sm`, tabular numbers, hover row |
| `.v2-table__num` | Right-aligned mono cell (counts, epochs, bytes) |
| `.v2-table__mono` | Mono cell, default alignment (hashes, addresses) |
| `.v2-table__mute` | Quiet metadata cell |
| `tr.is-stale` / `td.is-stale` | Dims cached/stale rows without hiding them |
| `.v2-table--fixed` | `table-layout: fixed` for equal-width columns |

Cells never wrap (`white-space: nowrap`) — truncate long values in the cell with
`.v2-mono` + your own `text-overflow` or keep the table inside `.v2-table-wrap`.

---

## Log Viewer

Mono rows with level accents, built for streaming tails.

```html
<div class="v2-log v2-log--scroll v2-log--bordered" role="log" aria-label="Node log tail">
  <div class="v2-log__row">
    <span class="v2-log__ts">14:33:05</span>
    <span class="v2-log__level">INFO</span>
    <span class="v2-log__comp">consensus</span>
    <span class="v2-log__msg">component = consensus event = post_finalize_root_verified epoch = 1756254</span>
  </div>
  <div class="v2-log__row v2-log__row--warn">
    <span class="v2-log__ts">14:33:07</span>
    <span class="v2-log__level v2-log__level--warn">WARN</span>
    <span class="v2-log__comp">p2p</span>
    <span class="v2-log__msg">event = frame_budget_rejected reason = frame_count_budget</span>
  </div>
</div>
```

| Class | Purpose |
|---|---|
| `.v2-log` | Flex column, mono 11 px, 1.55 line-height |
| `.v2-log--scroll` | `max-height: var(--v2-log-h, 420px)` + thin scrollbar + `overscroll-behavior: contain` |
| `.v2-log--bordered` | Hairline top + bottom separators |
| `.v2-log__row` | One line: ts · level · component · message, 2 px transparent left rail |
| `.v2-log__row--warn` / `--error` | Amber / red left rail (error also tints the row) |
| `.v2-log__level--warn` / `--error` / `--fatal` | Level text colour |
| `.v2-log__empty` | Centered placeholder for "waiting for log stream…" |

On `≤720px` the component column is hidden; on `≤420px` the timestamp is hidden as
well, so the message keeps full width on phones.

---

## Controls

```html
<!-- Button variants -->
<button class="v2-btn">Default</button>
<button class="v2-btn v2-btn--primary">Primary</button>
<button class="v2-btn v2-btn--brand">Brand</button>
<button class="v2-btn v2-btn--danger">Danger</button>
<button class="v2-btn v2-btn--ghost">Ghost</button>
<button class="v2-btn v2-btn--icon" aria-label="Options">...</button>
<button class="v2-btn v2-btn--block">Full width</button>

<!-- Segmented bar -->
<div class="v2-seg" role="group" aria-label="Actions">
  <button class="v2-seg__btn">Console</button>
  <button class="v2-seg__btn">Power</button>
  <button class="v2-seg__btn">Reboot</button>
</div>

<!-- Badges -->
<span class="v2-badge v2-badge--ok">Running</span>
<span class="v2-badge v2-badge--warn">Degraded</span>
<span class="v2-badge v2-badge--err">Error</span>
<span class="v2-badge v2-badge--brand">New</span>

<!-- Keyboard pill -->
<kbd class="v2-kbd">⌘K</kbd>
```

---

## Motion

Mount animation fires automatically on `.v2-stagger` children.  
For scroll-triggered stagger, add `data-v2-stagger` to the container — the JS runtime observes it and adds `.v2-stagger` on entry.

```html
<div data-v2-stagger>
  <!-- each child fades up in sequence -->
  <div>...</div>
  <div>...</div>
</div>
```

Skeleton shimmer for loading states:
```html
<span class="v2-skeleton" style="width:120px;height:14px;display:block;">&nbsp;</span>
```

All motion is automatically suppressed when `prefers-reduced-motion: reduce` is active (set in `base.css`).

---

## Key-Value Rows

```html
<div class="v2-kv">
  <div class="v2-kv__row">
    <span class="v2-kv__label">Hostname</span>
    <span class="v2-kv__value v2-mono">octra</span>
  </div>
  <div class="v2-kv__row">
    <span class="v2-kv__label">OS</span>
    <span class="v2-kv__value">Ubuntu 24.04 LTS</span>
  </div>
</div>
```

Each row gets a `1px` top border automatically. No manual rules needed.

---

## Icons

All icons are inline SVG with `aria-hidden="true"`. Size and tint via utility classes:

```html
<svg class="v2-icon v2-icon--16 v2-icon--mute" viewBox="0 0 24 24" aria-hidden="true">
  <!-- Lucide or any 24×24 stroke icon path -->
</svg>
```

| Class | Size |
|---|---|
| `v2-icon--14` | 14 × 14 px |
| `v2-icon--16` | 16 × 16 px |
| `v2-icon--18` | 18 × 18 px |
| `v2-icon--20` | 20 × 20 px |

Tint helpers: `v2-icon--mute`, `v2-icon--brand`, `v2-icon--ok`, `v2-icon--warn`, `v2-icon--err`.

---

## Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| `> 1080px` | Centred content column, all dock destinations visible |
| `≤ 1080px` | Dock items narrow; drag-to-scroll + `More` drop-up activate |
| `≤ 900px` | `.v2-grid--auto` collapses to one column |
| `≤ 860px` | Dock brand/footer compact, 72px nav items, 44px+ touch targets |
| `≤ 720px` | Two/three column grids collapse to a single column |
| `≤ 520px` | Stat strip tightens, dock compresses (48px brand / 64px items) |
| `≤ 420px` | Topbar/bottomnav heights compress, breadcrumb separators hidden |
| `≤ 380px` | Breadcrumb hidden, dock brand 42px / items 58px |
| `landscape height ≤ 480px` | Dock compresses to 52px and items become horizontal |

---

## V2 vs V1 Differences

| | V1 | V2 |
|---|---|---|
| Surface hierarchy | 5-tier tonal elevation (canvas → raised → strong → muted → hover) | Flat — single canvas surface |
| Visual separation | Tonal background shift on cards | `1px` hairline separators only |
| Navigation | Fixed left sidebar | Sticky bottom dock with hide/show toggle |
| Page scroll | `min-height: 100%` | `height: 100dvh; overflow: hidden` — zero page scroll |
| Gauge | 86-tick discrete bar | Continuous smooth fill bar |
| Network chart | 48-bar stacked histogram (112px tall) | 24-col dual-segment bars (72px) |
| Motion | Transition-only | Fade-up mount + stagger + shimmer + IntersectionObserver |
| JS API | `SynteqUI.*` | `SynteqV2.*` |

---

## Accessibility

- All interactive elements support `:focus-visible` with a `2px solid` ring
- Gauge tracks carry `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Icon-only buttons require explicit `aria-label`
- Status dots use `aria-label` on the parent element
- `prefers-reduced-motion` is honored globally
- Color tokens maintain ≥ 4.5:1 contrast ratio (WCAG 2.2 AA) in both themes
