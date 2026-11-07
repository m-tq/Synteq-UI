---
name: synteq-ui-v2
description: Implements clean, viewport-locked dashboard UIs using the Synteq UI V2 framework. Zero external dependencies, offline-first, Google Sans Code font, line-separator architecture (no cards), responsive sidebar with single toggle, inline SVG icons, dual-theme (dark/light). Use when building operator dashboards, cloud resource UIs, admin panels, or any text-first data-dense interface.
---

## Framework Identity

- **Name:** Synteq UI V2
- **Location in project:** `V2/` folder
- **Single CSS entry point:** `V2/css/synteq-ui-v2.css` — imports in order: `fonts.css` → `tokens.css` → `theme-dark.css` + `theme-light.css` → `base.css` → 8 component files (`icons`, `shell`, `sidebar`, `topbar`, `content`, `data`, `controls`, `motion`)
- **Single JS entry point:** `V2/js/synteq-ui-v2.js` — exposes `SynteqV2` global; auto-inits theme, dock, scroll-spy, toast, command palette, and data helpers
- **Font:** Google Sans Code, self-hosted at `V2/fonts/*.ttf` (Regular, Medium, SemiBold), loaded exclusively via `V2/css/fonts.css`
- **Zero external network requests** — fully offline-capable once files are on disk

---

## Six Non-Negotiable Rules

Every implementation MUST honor all six. Violating any one of them breaks the design system.

1. Body MUST never scroll — set `height: 100dvh; overflow: hidden` on both `html` and `body`. The only element that produces a scrollbar is `.v2-content.v2-scroll`.
2. Font MUST be Google Sans Code loaded from `V2/fonts/` via the `fonts.css` import — NEVER link to Google Fonts or any CDN.
3. MUST use only `--v2-*` CSS custom properties for any value that maps to a design token (color, spacing, radius, type size, motion). Never write raw hex, px, or rem values in component CSS.
4. MUST NOT use cards, `box-shadow`, or tonal backgrounds to separate content areas. Visual hierarchy comes exclusively from `.v2-section` top-border hairlines.
5. MUST have exactly ONE navigation dock toggle button — the topbar control with `data-v2-sidebar-toggle`. It hides/shows the sticky bottom dock; never add a second close button.
6. MUST use `aria-label` on every icon-only interactive element (buttons, links, icon controls).

---

## HTML Shell Template

Minimum boilerplate for any new V2 page. Adjust the `<title>`, breadcrumb copy, and nav items; keep everything else as-is.

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark" class="theme-dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>My Dashboard — Synteq UI V2</title>
  <link rel="stylesheet" href="V2/css/synteq-ui-v2.css" />
</head>
<body>

<div class="v2-app" id="app">

<!-- STICKY BOTTOM NAVIGATION DOCK -->
  <aside class="v2-aside" aria-label="Primary navigation" id="sidebar">

    <a href="#" class="v2-aside__brand" aria-label="App home">
      <span class="v2-aside__brand-mark" aria-hidden="true">
        <!-- 12×12 inline SVG logo mark -->
      </span>
      AppName
    </a>

    <nav class="v2-nav" aria-label="Primary navigation links">
      <a href="#" class="v2-nav__item v2-nav__item--active" aria-current="page">
        <svg class="v2-icon v2-icon--16" viewBox="0 0 24 24" aria-hidden="true"><!-- icon path --></svg>
        Nav Item
      </a>
      <a href="#" class="v2-nav__item">
        <svg class="v2-icon v2-icon--16" viewBox="0 0 24 24" aria-hidden="true"><!-- icon path --></svg>
        Another Item
      </a>
    </nav>

    <div class="v2-aside__footer">
      <span class="v2-dot" aria-label="Online"></span>
      <a href="#" class="v2-user" aria-label="Account: User Name">
        <span class="v2-avatar" aria-hidden="true">UN</span>
        <span class="v2-user__info">
          <span class="v2-user__name">User Name</span>
          <span class="v2-user__email">user@example.com</span>
        </span>
      </a>
    </div>
  </aside>

  <!-- TOPBAR — the ONE sidebar toggle lives here -->
  <header class="v2-topbar" role="banner">
    <button class="v2-sidebar-toggle"
            data-v2-sidebar-toggle
            aria-label="Toggle navigation"
            aria-expanded="true"
            aria-controls="sidebar">
      <svg class="v2-icon v2-icon--18 icon-menu" viewBox="0 0 24 24" aria-hidden="true">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>

    <div class="v2-topbar__left">
      <span class="v2-topbar__title">Page Title</span>
    </div>

    <div class="v2-topbar__right">
      <button class="v2-iconbtn v2-theme-toggle" data-v2-toggle-theme aria-label="Toggle theme">
        <svg class="v2-icon v2-icon--16 v2-icon--moon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>
    </div>
  </header>

  <!-- MAIN — only this element scrolls -->
  <main class="v2-main" aria-label="Main content">
    <div class="v2-content v2-scroll" id="main-content">

      <!-- sections go here -->

    </div>
  </main>

</div>

<script src="V2/js/synteq-ui-v2.js"></script>
</body>
</html>
```

---

## Quick Component Reference

Copy-paste blueprints. All snippets are self-contained and work inside `.v2-content.v2-scroll`.

### Sidebar nav item (active + default)

```html
<!-- Active item (current page) -->
<a href="#" class="v2-nav__item v2-nav__item--active" aria-current="page">
  <svg class="v2-icon v2-icon--16" viewBox="0 0 24 24" aria-hidden="true"><!-- path --></svg>
  Instances
  <span class="v2-nav__badge">4</span>
</a>

<!-- Default item -->
<a href="#" class="v2-nav__item">
  <svg class="v2-icon v2-icon--16" viewBox="0 0 24 24" aria-hidden="true"><!-- path --></svg>
  Networks
</a>
```

### Section with head

```html
<div class="v2-section">
  <div class="v2-section__head">
    <span class="v2-section__title">
      <svg class="v2-icon v2-icon--14" viewBox="0 0 24 24" aria-hidden="true"><!-- path --></svg>
      Section Title
    </span>
    <span class="v2-section__meta">updated 5s ago</span>
  </div>
  <!-- section content -->
</div>
```

### Stat strip (3 stats)

```html
<div class="v2-stat-strip">
  <div class="v2-stat">
    <span class="v2-stat__label">vCPU</span>
    <div class="v2-stat__value">4 <span class="v2-unit">cores</span></div>
  </div>
  <div class="v2-stat">
    <span class="v2-stat__label">RAM</span>
    <div class="v2-stat__value">8 <span class="v2-unit">GB</span></div>
  </div>
  <div class="v2-stat">
    <span class="v2-stat__label">Storage</span>
    <div class="v2-stat__value">160 <span class="v2-unit">GB SSD</span></div>
  </div>
</div>
```

### KV list (3 rows)

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
  <div class="v2-kv__row">
    <span class="v2-kv__label">Region</span>
    <span class="v2-kv__value">AMS1 — Amsterdam</span>
  </div>
</div>
```

Each row gets a `1px` top border automatically. No extra CSS needed.

### Gauge

`data-v2-gauge` on the outer element drives `initGauges()` on load. Provide `role="progressbar"` + aria attributes for accessibility.

```html
<div class="v2-gauge" data-v2-gauge="72"
     role="progressbar" aria-label="CPU usage"
     aria-valuenow="72" aria-valuemin="0" aria-valuemax="100">
  <div class="v2-gauge__head">
    <span class="v2-gauge__label">CPU</span>
    <span class="v2-gauge__value">72<span class="v2-gauge__max"> / 100%</span></span>
  </div>
  <div class="v2-gauge__track">
    <div class="v2-gauge__fill"></div>
  </div>
</div>
```

To override auto-coloring with brand tint (e.g. bandwidth):

```html
<div class="v2-gauge__track">
  <div class="v2-gauge__fill v2-gauge__fill--brand"></div>
</div>
```

### Segmented button bar

```html
<div class="v2-seg" role="group" aria-label="Instance actions">
  <button class="v2-seg__btn" aria-label="Open console">
    <svg class="v2-icon v2-icon--14" viewBox="0 0 24 24" aria-hidden="true"><!-- path --></svg>
    Console
  </button>
  <button class="v2-seg__btn" aria-label="Power options">Power</button>
  <button class="v2-seg__btn" aria-label="Reboot instance">Reboot</button>
</div>
```

### Button variants

```html
<button class="v2-btn">Default</button>
<button class="v2-btn v2-btn--primary">Primary</button>
<button class="v2-btn v2-btn--ghost">Ghost</button>
<button class="v2-btn v2-btn--danger">Danger</button>
<button class="v2-btn v2-btn--block">Full width</button>

<!-- Icon-only button — aria-label required -->
<button class="v2-btn v2-iconbtn" aria-label="Options">
  <svg class="v2-icon v2-icon--16" viewBox="0 0 24 24" aria-hidden="true"><!-- path --></svg>
</button>
```

### Badge variants

```html
<span class="v2-badge">Default</span>
<span class="v2-badge v2-badge--ok">Running</span>
<span class="v2-badge v2-badge--warn">Degraded</span>
<span class="v2-badge v2-badge--err">Error</span>
<span class="v2-badge v2-badge--brand">New</span>
```

### Status: one signal per state, never both

- **dot + text** - `<span class="v2-status"><span class="v2-dot"></span> Running</span>`
- **badge + text** - `<span class="v2-badge v2-badge--ok">Running</span>`

Nesting a `.v2-dot` inside a `.v2-badge` says the same thing twice and is
deprecated: the badge colour already carries the state.

### Bar chart (JS-rendered)

HTML declares the container; JS populates it. Set `--v2-bars-cols` to match your sample count.

```html
<div class="v2-bars" id="net-bars"
     role="img" aria-label="Network I/O chart"
     style="--v2-bars-cols: 24;"></div>
```

```js
// samples: Array of [inPct, outPct], each value 0–100
SynteqV2.renderBars(document.getElementById('net-bars'), [
  [12, 4], [18, 6], [35, 10], [52, 16], [44, 14], [38, 12],
  [30, 8], [34, 10], [42, 13], [48, 15], [52, 16], [45, 14]
]);
```

### Sparkline (JS-rendered)

```html
<svg class="v2-spark" id="cpu-spark"
     viewBox="0 0 200 40" preserveAspectRatio="none"
     role="img" aria-label="CPU usage trend"></svg>
```

```js
// raw values — auto-scaled to fit the viewBox
SynteqV2.renderSparkline(
  document.getElementById('cpu-spark'),
  [18, 22, 31, 40, 36, 34, 38, 35, 33, 34, 29, 36, 42, 38, 34]
);
```

Add `.v2-spark--out` to the `<svg>` to use the outbound (red) color palette instead of the default inbound (green).

Add `.v2-spark--tall` (56 px) or set `--v2-spark-h` for a custom height. Fewer than
two values clears the path and sets `data-v2-spark-empty="true"`.

### Data table

```html
<div class="v2-table-wrap">
  <table class="v2-table">
    <thead>
      <tr><th scope="col">Peer</th><th scope="col" class="v2-table__num">Lag</th><th scope="col">Source</th></tr>
    </thead>
    <tbody>
      <tr>
        <td class="v2-table__mono">oct3SUwRsi…v2v4Bm</td>
        <td class="v2-table__num">8</td>
        <td class="v2-table__mute">epoch_root</td>
      </tr>
      <tr class="is-stale"><td>…</td><td class="v2-table__num">—</td><td>cached</td></tr>
    </tbody>
  </table>
</div>
```

Cell modifiers: `__num` (right, mono), `__mono`, `__mute`, row/cell `is-stale`,
`.v2-table--fixed` for equal columns. Wrap in `.v2-table-wrap` when rows can overflow.

### Log viewer

```html
<div class="v2-log v2-log--scroll v2-log--bordered" role="log" aria-label="Log tail">
  <div class="v2-log__row">
    <span class="v2-log__ts">14:33:05</span>
    <span class="v2-log__level">INFO</span>
    <span class="v2-log__comp">consensus</span>
    <span class="v2-log__msg">event = post_finalize_root_verified epoch = 1756254</span>
  </div>
  <div class="v2-log__row v2-log__row--warn">
    <span class="v2-log__ts">14:33:07</span>
    <span class="v2-log__level v2-log__level--warn">WARN</span>
    <span class="v2-log__comp">p2p</span>
    <span class="v2-log__msg">event = frame_budget_rejected reason = frame_count_budget</span>
  </div>
</div>
```

`--scroll` caps the height (`--v2-log-h`, default 420 px), `--bordered` adds the
hairlines, `--row--warn/--error` colour the rail. Component hidden `≤720px`,
timestamp hidden `≤420px`.

---

## JS API Reference

All methods are on the `SynteqV2` global, available after `synteq-ui-v2.js` loads.

| Method | Signature | Notes |
|---|---|---|
| `setTheme` | `setTheme(theme: 'dark' \| 'light') → string` | Sets `data-theme` on `<html>`, persists to `localStorage` key `sq-v2-theme` |
| `getTheme` | `getTheme() → 'dark' \| 'light'` | Reads current `data-theme` attribute |
| `toggleTheme` | `toggleTheme() → string` | Flips between dark and light |
| `renderGauge` | `renderGauge(fillEl, pct, opts?)` | `pct` is 0–100. `opts.kind`: `'auto'` (default, thresholds), `'brand'` (quorum/bandwidth), `'neutral'` (no state colour). Also updates `aria-valuenow` on the progressbar parent. |
| `renderBars` | `renderBars(stageEl, samples, opts?)` | Each sample is `[inPct, outPct]`, 0–100. `opts.minCols` pads short series with empty columns; `opts.stepSec` labels tooltips as `T-30s`. Clears and rebuilds the container. Sets `data-v2-bars-empty` when there is no data. |
| `renderSparkline` | `renderSparkline(svgEl, values)` | Raw values, auto-scaled into the SVG `viewBox` (default `0 0 200 40`). Fewer than 2 values clears the path and sets `data-v2-spark-empty`. Series is remembered and redrawn on resize. |
| `scrollToSection` | `scrollToSection(id, opts?) → boolean` | Scrolls `.v2-content` to `#id`; `opts.behavior` = `'smooth' \| 'auto'`. Hash deep links (`/#logs`) and `hashchange` are handled automatically. |
| `tip` | `tip(anchorEl, message, opts?) → Element` | Transient anchored label (the copy handler shows "Copied" through it). `opts.kind` = `'ok' \| 'warn' \| 'err'`, `opts.duration` default 1500 ms. Fixed-positioned, viewport-clamped, `role="status"`, one at a time. |
| `initSparklines` | `initSparklines()` | Renders every `.v2-spark` from its stored series or `data-v2-spark="1,2,3"`. Called automatically on `DOMContentLoaded`. |
| `initNavDock` | `initNavDock()` | Adds drag-to-scroll and the `More` drop-up when dock destinations overflow. Called automatically on `DOMContentLoaded`. |
| `initGauges` | `initGauges()` | Processes all `[data-v2-gauge]` elements in the DOM. Called automatically on `DOMContentLoaded`. |
| `sidebarToggle` | `sidebarToggle()` | Toggles open/closed based on current state and viewport width |
| `sidebarOpen` | `sidebarOpen()` | Shows the sticky bottom dock and updates toggle accessibility state. |
| `sidebarClose` | `sidebarClose()` | Hides the sticky bottom dock and updates toggle accessibility state. |

---

## Sidebar Toggle Wiring (single button rule)

**There is exactly one sidebar toggle in the entire page.** It lives in `.v2-topbar` and carries `data-v2-sidebar-toggle`. The JS runtime wires it automatically — no manual event listener needed.

```html
<!-- In .v2-topbar — the ONLY toggle. Do not add another anywhere. -->
<button class="v2-sidebar-toggle"
        data-v2-sidebar-toggle
        aria-label="Toggle navigation"
        aria-expanded="true"
        aria-controls="sidebar">
  <svg class="v2-icon v2-icon--18 icon-menu" viewBox="0 0 24 24" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
</button>
```

**All viewports:** toggle adds/removes `.nav-collapsed` on `.v2-app#app`. The dock slides away and the content area expands without introducing page scroll.

The dock remains sticky at the bottom on mobile. Do **not** add group labels
(`.v2-nav__group-label`) inside the dock — the horizontal strip only renders
icon + label items. When destinations overflow the strip:

- the strip becomes drag-scrollable (mouse/pen) and accepts horizontal wheel input;
- a `More` button (with a drop-up listing every off-screen item) is injected automatically by `SynteqV2.initNavDock()`;
- the active item is scrolled into view whenever the scroll-spy changes.

**Automatic close triggers (no code required):**
- Pressing `Escape` closes the `More` drop-up (the dock itself stays visible)
- Clicking a navigation item smooth-scrolls to its target section while the dock remains available

The sidebar itself has **no close button**. Do not add one — it creates a two-toggle situation that conflicts with sidebar state management.

Dock visibility preference is persisted under `localStorage` key `sq-v2-sidebar`.

---

## Theme Switching

Set initial theme on `<html>`:

```html
<html data-theme="dark">   <!-- or data-theme="light" -->
```

Switch at runtime:

```js
SynteqV2.setTheme('light');   // explicit
SynteqV2.toggleTheme();       // flip
SynteqV2.getTheme();          // → 'dark' | 'light'
```

Wire any button automatically — no JS needed:

```html
<button data-v2-toggle-theme aria-label="Toggle theme">...</button>
```

The JS runtime detects `prefers-color-scheme` on first load if no saved preference exists, then writes the result to `localStorage` key `sq-v2-theme`. Subsequent loads restore from localStorage.

---

## Icon Usage

All icons are inline SVG sourced from a 24×24 viewBox (Lucide or equivalent stroke-icon set). Always include `aria-hidden="true"` on decorative icons. Icon-only interactive elements need an `aria-label` on the button/link, not on the SVG.

```html
<!-- Decorative icon inside a labeled button -->
<button class="v2-iconbtn" aria-label="Copy to clipboard">
  <svg class="v2-icon v2-icon--16" viewBox="0 0 24 24" aria-hidden="true">
    <!-- Lucide copy icon paths -->
    <rect x="9" y="9" width="13" height="13" rx="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
</button>
```

**Size classes** (apply alongside `v2-icon`):

| Class | Rendered size |
|---|---|
| `v2-icon--14` | 14 × 14 px |
| `v2-icon--16` | 16 × 16 px |
| `v2-icon--18` | 18 × 18 px |
| `v2-icon--20` | 20 × 20 px |

**Tint classes** (optional, stack with size class):

| Class | Color |
|---|---|
| `v2-icon--mute` | Subtle/muted text color |
| `v2-icon--brand` | Brand accent |
| `v2-icon--ok` | Green / success |
| `v2-icon--warn` | Amber / warning |
| `v2-icon--err` | Red / error |

Base class `v2-icon` is always required. Example with size and tint:

```html
<svg class="v2-icon v2-icon--16 v2-icon--ok" viewBox="0 0 24 24" aria-hidden="true">
  <polyline points="20 6 9 17 4 12"/>
</svg>
```

---

## Common Mistakes to Avoid

1. **Adding a second sidebar close button.** The framework manages sidebar state through a single `data-v2-sidebar-toggle` button. A second close button (e.g. inside `.v2-aside`) creates two competing state sources and breaks the desktop/mobile toggle logic.

2. **Using `min-height: 100%` or `overflow: auto` on `body`/`html`.** V2's viewport lock requires `height: 100dvh; overflow: hidden` on both. Any deviation reintroduces a page scrollbar and breaks the shell grid.

3. **Hard-coding color or spacing values in component styles.** Writing `color: #fff` or `padding: 16px` bypasses the token system. Theme switching and future token updates will silently break those elements. Always use `var(--v2-text-strong)` and `var(--v2-space-4)`.

4. **Wrapping content in card elements with `box-shadow` or tonal backgrounds.** V2's flat surface model means every surface is the same canvas color. Visual grouping comes from `.v2-section` hairlines only. Introducing elevation or tonal wrappers breaks visual consistency.

5. **Linking to Google Fonts CDN for Google Sans Code.** The font is self-hosted in `V2/fonts/`. A CDN link introduces an external network request, breaks offline-first operation, and loads a different version of the typeface than the one the design was built against.

6. **Rendering a sparkline without a `viewBox`.** `renderSparkline` draws in viewBox units (default `0 0 200 40`). Keep a `viewBox` on the `<svg>` (any size works) instead of relying on rendered pixel dimensions — that is what keeps the path inside the chart at every breakpoint. Call `SynteqV2.initSparklines()` after dynamic content changes so new charts (and resized ones) are redrawn.
