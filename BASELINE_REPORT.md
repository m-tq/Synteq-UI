# Phase 0: Baseline Report
**Date:** 2026-11-08  
**Project:** Synteq UI V2 → Production Framework

---

## Executive Summary

Baseline established from 14 CSS files (53,265 bytes raw / 11,970 gzipped) and 1 JS file (34,125 bytes / 9,397 gzipped). Budget ceiling: CSS ≤106 KB raw, JS ≤68 KB raw. Current state leaves ~100 KB total headroom for Tier A+B+C components plus framework quality features.

**Critical finding:** Existing code violates rules 3 and 4 in 37+ locations. These are documented here but NOT fixed in early phases per the workflow constraint. Phase 5 will address them only after explicit approval.

---

## 1. Inventory

### 1.1 CSS Classes (Public API)

**Shell & Layout (23):**
`.v2-app`, `.v2-app.nav-collapsed`, `.v2-aside`, `.v2-topbar`, `.v2-main`, `.v2-content`, `.v2-content.v2-scroll`, `.v2-content--fullscreen`, `.v2-section`, `.v2-section--top`, `.v2-section--compact`, `.v2-section__head`, `.v2-section__title`, `.v2-section__meta`, `.v2-grid`, `.v2-grid--2`, `.v2-grid--3`, `.v2-grid--auto`, `.v2-grid--auto-fit`, `.v2-stat-strip`, `.v2-rule`, `.v2-rule--strong`, `.v2-rule--dashed`

**Navigation Dock (15):**
`.v2-aside__brand`, `.v2-aside__brand-mark`, `.v2-nav`, `.v2-nav__item`, `.v2-nav__item--active`, `.v2-nav__badge`, `.v2-nav__more`, `.v2-nav__menu`, `.v2-nav__menu-item`, `.v2-nav__group-label` (hidden), `.v2-aside__footer`, `.v2-sidebar-toggle`, `.icon-menu`, `.icon-close`, `.v2-user`

**Topbar (11):**
`.v2-topbar`, `.v2-topbar.is-scrolled`, `.v2-topbar__left`, `.v2-topbar__right`, `.v2-topbar__crumb`, `.v2-topbar__sep`, `.v2-topbar__title`, `.v2-search`, `.v2-search__text`, `.v2-iconbtn`, `.v2-theme-toggle`

**Data Visualization (42):**
`.v2-stat`, `.v2-stat__label`, `.v2-stat__value`, `.v2-stat__delta`, `.v2-stat__delta--up`, `.v2-stat__delta--down`, `.v2-unit`, `.v2-kv`, `.v2-kv__row`, `.v2-kv__label`, `.v2-kv__value`, `.v2-gauge`, `.v2-gauge__head`, `.v2-gauge__label`, `.v2-gauge__value`, `.v2-gauge__max`, `.v2-gauge__track`, `.v2-gauge__fill`, `.v2-gauge__fill--ok`, `.v2-gauge__fill--warn`, `.v2-gauge__fill--err`, `.v2-gauge__fill--brand`, `.v2-spark`, `.v2-spark--tall`, `.v2-spark--out`, `.v2-spark__line`, `.v2-spark__area`, `.v2-spark__dot`, `.v2-bars`, `.v2-bars__col`, `.v2-bars__seg`, `.v2-bars__seg--in`, `.v2-bars__seg--out`, `.v2-legend`, `.v2-legend__item`, `.v2-legend__sw`, `.v2-status`, `.v2-dot`, `.v2-dot--ok`, `.v2-dot--warn`, `.v2-dot--err`, `.v2-dot--idle`

**Tables & Logs (14):**
`.v2-table-wrap`, `.v2-table`, `.v2-table--fixed`, `.v2-table__num`, `.v2-table__mono`, `.v2-table__mute`, `.v2-log`, `.v2-log--scroll`, `.v2-log--bordered`, `.v2-log__row`, `.v2-log__row--warn`, `.v2-log__row--error`, `.v2-log__level`, `.v2-log__comp`, `.v2-log__msg`, `.v2-log__empty`

**Controls (25):**
`.v2-btn`, `.v2-btn--ghost`, `.v2-btn--primary`, `.v2-btn--brand`, `.v2-btn--danger`, `.v2-btn--icon`, `.v2-btn--block`, `.v2-btn__stack`, `.v2-seg`, `.v2-seg__btn`, `.v2-seg__btn--active`, `.v2-seg__btn--icon`, `.v2-input`, `.v2-badge`, `.v2-badge--brand`, `.v2-badge--ok`, `.v2-badge--warn`, `.v2-badge--err`, `.v2-kbd`, `.v2-avatar`, `.v2-tip`, `.v2-tip--ok`, `.v2-tip--warn`, `.v2-tip--err`, `.v2-copy--ok`

**Icons (10):**
`.v2-icon`, `.v2-icon--14`, `.v2-icon--16`, `.v2-icon--18`, `.v2-icon--20`, `.v2-icon--mute`, `.v2-icon--brand`, `.v2-icon--ok`, `.v2-icon--warn`, `.v2-icon--err`, `.v2-ico-label`

**Motion & Utils (11):**
`.v2-fade-up`, `.v2-stagger`, `.v2-live`, `.v2-skeleton`, `.v2-row-hover`, `.v2-mono`, `.v2-mute`, `.v2-strong`, `.v2-semibold`, `.v2-sr-only`, `.is-stale`, `.is-active`, `.is-scrolled`

**Overlay Primitives (4):**
`.v2-toast-region`, `.v2-toast`, `.v2-dialog`, `.v2-command`

**Total: ~160 classes documented**

### 1.2 JS API (SynteqV2 global)

**Theme (3):**
- `setTheme(theme)` → string
- `getTheme()` → 'dark' | 'light'
- `toggleTheme()` → string

**Sidebar (3):**
- `sidebarToggle()`
- `sidebarOpen()`
- `sidebarClose()`

**Data Viz (3):**
- `renderGauge(fillEl, pct, opts?)`
- `renderBars(stageEl, samples, opts?)`
- `renderSparkline(svgEl, values)`

**Feedback (2):**
- `toast(message)`
- `tip(anchorEl, message, opts?)`

**Navigation (1):**
- `scrollToSection(id, opts?)` → boolean

**Init Helpers (4):**
- `initGauges()`
- `initSparklines()`
- `initNavDock()`
- `initNavScroll()`

**Undocumented but working (7):**
- Auto-init on DOMContentLoaded (theme, sidebar, gauges, sparklines, scroll-spy, dock, copy buttons, toast/dialog/command wiring, stagger observer)
- `[data-v2-sidebar-toggle]` auto-wired
- `[data-v2-toggle-theme]` auto-wired
- `[data-v2-copy]` delegated click handler
- `[data-v2-gauge="72"]` auto-init
- `[data-v2-stagger]` IntersectionObserver trigger
- `v2:navchange` custom event (dock listens for scroll-spy changes)

**Total: 16 public methods + 7 auto-wired behaviors**

### 1.3 Design Tokens

**Type (13):**
`--v2-font-sans`, `--v2-font-mono`, `--v2-text-xs` through `--v2-text-3xl` (7 sizes), `--v2-fw-regular/medium/semibold/bold` (4 weights), `--v2-leading-tight/base` (2 line-heights)

**Spacing (9):**
`--v2-space-1` through `--v2-space-9` (4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 56px)

**Radius (2):**
`--v2-radius-micro` (2px), `--v2-radius-control` (5px)

**Motion (5):**
`--v2-ease`, `--v2-dur-instant` (120ms), `--v2-dur-fast` (180ms), `--v2-dur-normal` (280ms), `--v2-dur-slow` (420ms)

**Layout Shell (6):**
`--v2-aside-w`, `--v2-topbar-h`, `--v2-bottomnav-h`, `--v2-content-max`, `--v2-nav-item-w`, `--v2-line-h`, `--v2-line-h-strong`

**Color (per theme: 20):**
Surface: `--v2-canvas`, `--v2-sidebar`, `--v2-hover`, `--v2-inset`  
Text: `--v2-text`, `--v2-text-strong`, `--v2-text-subtle`, `--v2-text-on-accent`  
Line: `--v2-line`, `--v2-line-strong`, `--v2-line-accent`  
Semantic: `--v2-brand`, `--v2-status-running`, `--v2-status-warning`, `--v2-status-error`  
Telemetry: `--v2-tel-in`, `--v2-tel-out`, `--v2-track`  
Utility: `--v2-glyph`

**Total: 55 structural tokens + 20 color tokens per theme = 75 tokens**

### 1.4 localStorage Keys (2)

- `sq-v2-theme` ('dark' | 'light')
- `sq-v2-sidebar` ('open' | 'closed')

### 1.5 Data Attributes (9)

- `data-theme="dark|light"` on `<html>`
- `data-v2-sidebar-toggle` (topbar button)
- `data-v2-toggle-theme` (theme toggle button)
- `data-v2-copy="text"` (clipboard button)
- `data-v2-gauge="0-100"` (gauge auto-init)
- `data-v2-stagger` (mount animation trigger)
- `data-v2-bars-empty` (set by JS when series is empty)
- `data-v2-spark-empty` (set by JS when < 2 samples)
- `data-v2-toast`, `data-v2-dialog-open`, `data-v2-search-trigger`, `data-v2-command` (production wiring)

---

## 2. Baseline Sizes

### 2.1 Raw Bytes

| Asset | Files | Raw Bytes | Notes |
|-------|-------|-----------|-------|
| CSS Total | 14 | 53,265 | fonts.css (734) + tokens (1522) + themes (962) + base (2823) + master (533) + 8 components (46,691) |
| JS Total | 1 | 34,125 | Single runtime file |
| **Sum** | **15** | **87,390** | **Baseline measurement** |

### 2.2 Gzipped Bytes

| Asset | Gzipped | Compression Ratio |
|-------|---------|-------------------|
| CSS | 11,970 | 22.5% of raw |
| JS | 9,397 | 27.5% of raw |
| **Sum** | **21,367** | **24.4% of raw** |

### 2.3 Budget Ceiling (2x baseline per asset)

| Asset | Baseline Raw | Ceiling (2x) | Headroom |
|-------|--------------|--------------|----------|
| CSS | 53,265 | 106,530 | 53,265 bytes (~50 KB) |
| JS | 34,125 | 68,250 | 34,125 bytes (~33 KB) |

**Reality check:** Tier A+B components will add ~30-40 KB CSS, Tier C framework features ~15-20 KB total (CSS+JS). Final projection: ~95 KB CSS / ~55 KB JS raw, both under ceiling.

---

## 3. Rule Violations (Existing Code)

Per the six hard rules restated:

### Rule 1: Body Never Scrolls ✅ PASS
`html, body { height: 100%; overflow: hidden; }` in base.css:11-16. Only `.v2-content.v2-scroll` scrolls. No violations found.

### Rule 2: Self-Hosted Font ✅ PASS
fonts.css loads 3 TTF files from `../fonts/`. No CDN links. No violations.

### Rule 3: Only --v2-* Tokens ❌ VIOLATIONS FOUND (19 instances)

**Raw px values in components (not via tokens):**
1. `data.css:112,119` – `border-radius: 999px` on gauge tracks (should be a --v2-radius-pill token or keep as exception for circular caps)
2. `data.css:136` – `--v2-spark-h: 56px` (.v2-spark--tall override, acceptable as scoped modifier)
3. `data.css:237` – `border-radius: 3px` (scrollbar thumb)
4. `data.css:283` – `font-size: 11px` (log viewer, matches --v2-text-xs but hardcoded)
5. `data.css:295` – `border-radius: 4px` (scrollbar thumb)
6. `data.css:325,337` – `font-size: 10px` (log level/comp labels, no token)
7. `sidebar.css:135` – `font-size: 9px` (More button label, no token)
8. `shell.css:15` – `--v2-nav-current: 0px` (collapsed state, acceptable as computed value)
9. `shell.css:42,47,48` – Breakpoint-specific token overrides (48px, 52px topbar/nav heights, acceptable per sanctioned-breakpoint exception)

**Raw colors in components:**
10-28. `rgba(0, 0, 0, .28/.45/.10)` in box-shadow (9 instances: tip, topbar, sidebar menu/overflow, controls) – violates flat-surface rule 4 simultaneously

**Verdict:** 19 raw-value violations. Most are minor (scrollbar radii, sub-11px type, 999px circular caps). The box-shadow violations are structural and addressed under Rule 4.

### Rule 4: No Cards, No box-shadow ❌ VIOLATIONS FOUND (9 instances)

**box-shadow found:**
1. `controls.css:72` – `.v2-tip` (transient anchored label, 0 6px 18px rgba…)
2. `sidebar.css:66-69` – `.v2-nav` overflow edge-fade shadows (inset 24px 0 18px -18px, both edges)
3. `sidebar.css:109` – `.v2-nav__item--active` (inset 0 3px 0 brand – this is a top accent bar, not elevation, borderline acceptable)
4. `sidebar.css:163` – `.v2-nav__menu` drop-up (0 16px 40px rgba…)
5. `topbar.css:17-18` – `.v2-topbar.is-scrolled` (0 1px 20px / 0 1px 12px rgba…, both themes)

**Analysis:**
- Tip and menu drop-up shadows violate the flat-surface model (they imply elevation).
- Topbar scroll shadow was likely added for depth but contradicts rule 4.
- Nav overflow edge-fades are functional (show clipped content) but use shadow instead of a CSS mask or gradient overlay.
- Active nav item inset shadow is a hairline accent bar, not elevation – defensible as a variant of the border primitive.

**Tonal backgrounds (color-mix for state):**
- 14 instances of `color-mix(in srgb, var(--v2-brand|status-*) N%, transparent)` for hover/active/badge states. These are semantic tints on SMALL inline elements (badges, buttons, active nav), which the architecture notes allow. NOT a violation for section-level separation, so acceptable under the intent of rule 4.

**Verdict:** 8 structural box-shadow violations (tip, menu, topbar, nav overflow fades). The active-item inset bar is defensible. Tonal tints on controls are permitted per DESIGN.md semantics.

### Rule 5: Exactly ONE Sidebar Toggle ✅ PASS
Single `data-v2-sidebar-toggle` button in topbar. No duplicate toggles found in aside or elsewhere.

### Rule 6: Icon-Only Elements Need aria-label ⚠️ PARTIAL

**CSS defines icon-only classes:** `.v2-btn--icon`, `.v2-iconbtn`, `.v2-sidebar-toggle`, `.v2-theme-toggle`, `.v2-nav__more`  
**Grep in examples:** 30 aria-label in dashboard.html, 36 in components.html  
**Finding:** The CSS framework itself cannot enforce this (it is an HTML contract). The docs (SKILL.md, DESIGN.md) clearly state the requirement. Examples comply. Framework is in spec.

**Verdict:** PASS at framework level. Enforcing this in user markup requires the Phase 4 linter tool.

---

## 4. Doc/Code Mismatches

### 4.1 Undocumented JS APIs
**Found in code but missing from SKILL.md JS API table:**
- `toast(message)` – implemented, wired via `[data-v2-toast]`, used in production controls
- `initNavScroll()` – scroll-spy + smooth nav, auto-runs but not in public API table
- `scrollToSection(id, opts)` – documented in README.md but missing from SKILL.md table
- Command palette wiring (`[data-v2-search-trigger]`, `[data-v2-command]`) – fully implemented in initProductionControls, not in SKILL.md snippets
- Dialog helpers (`[data-v2-dialog-open]`, `[data-v2-dialog-close]`) – wired, not documented

**Resolution:** Phase 4 will sync SKILL.md JS API table with full public surface.

### 4.2 Missing Component Docs
**Present in CSS but no SKILL.md snippet:**
- `.v2-dialog`, `.v2-command` (overlay primitives exist in controls.css:179-181)
- `.v2-toast-region`, `.v2-toast` (exist, wired, but only 1-line mention in controls.css)
- Progress, spinner, skeleton (skeleton shimmer exists in motion.css, but no gauge-style progress bar beyond the fill bar)

**Resolution:** Tier A overlays (dialog, toast) get full treatment in Phase 2. Progress/spinner/skeleton in Phase 3.

### 4.3 Contradictions
**NONE FOUND.** Docs and code are internally consistent. The only gaps are omissions (undocumented working features), not conflicts.

---

## 5. Proposed Component List (Tiered)

### Tier A: Core Forms & Overlays (~18-22 KB CSS, ~8 KB JS)

**Forms (NEW):**
1. `.v2-field` wrapper (label + hint + error, flex column, gap, `aria-describedby` wiring)
2. Input states: `:invalid`, `:disabled`, `:read-only` (existing `.v2-input` gets `[aria-invalid]`, error ring, dimmed state)
3. `<textarea>` restyled (same radius/inset as input, auto-grows via `field-sizing: content` or min-height)
4. `<select>` native restyled (inset bg, custom arrow via background-image SVG data-uri, border on focus)
5. Checkbox (custom `appearance: none`, 16×16, checkmark via ::after, `--v2-brand` when `:checked`)
6. Radio (circular variant of checkbox, dot fill instead of checkmark)
7. Switch (checkbox styled as 32×20 track with sliding dot, `--v2-brand` active, motion transition)
8. Input group / affix (`.v2-input-group`, flex row, prefix/suffix text or icon, hairline separators)
9. Range slider (`<input type="range">`, custom track/thumb, `--v2-brand` fill, respects reduced motion)

**Overlays (EXISTING + POLISH):**
10. Tabs (`.v2-tabs`, roving `tabindex`, arrow keys, `aria-selected`, hairline bottom border on tablist)
11. Accordion (`<details>`/`<summary>` restyled, custom arrow rotate, hairline between items, smooth `max-height` transition with `prefers-reduced-motion` guard)
12. Menu button/dropdown (existing `.v2-nav__menu` pattern generalized: `.v2-menu-trigger` + `.v2-menu`, Escape close, arrow nav, typeahead, focus return)
13. Popover (tooltip variant: non-modal, anchored, `Escape` close, no scrim, 1px border + canvas bg like menu)
14. Dialog polish (existing `<dialog>` + `.v2-dialog` gains size modifiers `--sm/--md/--lg`, confirm/alert ARIA roles, focus trap via `inert` on other content)
15. Toast upgrade (existing `.v2-toast` gains kinds `--info/--ok/--warn/--err`, dismiss button, queue system in JS, pause-on-hover, `aria-live="polite"` for all, assertive for errors)

**Justification:** Forms close the biggest gap (no styled inputs). Tabs/accordion/menu/popover/dialog/toast are standard kit expectations. All fit the flat-surface model (1px borders, no shadow except legacy toast—Phase 5 fixes it). Size: ~18 KB CSS (9 form components × ~800 bytes, 6 overlays × ~1.2 KB average), ~8 KB JS (tabs/accordion/menu/popover/toast state + keyboard nav).

**Risk:** Switch and range may need browser-specific `::-webkit-slider-*` / `::-moz-range-*` pseudo-elements (adds ~300 bytes per component for vendor prefixes). Dialog focus trap requires `inert` polyfill check or manual tab capture (~400 bytes JS).

### Tier B: Data-Dense & Navigation (~12-16 KB CSS, ~4 KB JS)

**Advanced Table (NEW):**
16. Sticky header (existing `.v2-table` gets `thead { position: sticky; top: 0; z-index: 1; background: var(--v2-canvas); }`)
17. Sortable headers (`.v2-table__th--sortable`, `aria-sort="ascending|descending|none"`, click handler in JS, up/down arrow icon swap)
18. Row selection (checkbox in first column, `.v2-table__row.is-selected` state, shift-click range, `SynteqV2.getTableSelection(tableEl)` API)
19. Density modifier (`data-v2-density="compact"` reduces padding from --space-3 to --space-2)
20. Toolbar (`.v2-table-toolbar`, flex row above table, search input + actions, hairline bottom)
21. Pagination (`.v2-pagination`, page numbers + prev/next, `aria-label="Page N of M"`, click handler)
22. Empty/loading rows (`.v2-table__empty`, centered "No data" row; `.v2-table__row.is-loading` with skeleton cells)

**Components (NEW):**
23. Breadcrumb (existing `.v2-topbar__crumb` generalized to `.v2-breadcrumb`, `<nav>` + `<ol>`, `aria-current="page"`, separator via ::after)
24. Tag/chip (badge variant: dismissible, `.v2-chip`, close button, `SynteqV2.chip.dismiss(el)` event)
25. Stepper/timeline (`.v2-stepper`, vertical line + circle markers, `aria-current="step"`, past/current/future states)
26. Code block (`.v2-code-block`, `<pre>` + `<code>`, mono font, inset bg, copy button in top-right, line numbers via CSS counter)
27. Tree (minimal: `.v2-tree`, nested `<ul>`, expand/collapse via `<details>`, indent via padding, icon rotate, max 3 levels to stay lightweight)

**Chart Extensions (SVG ONLY, NEW):**
28. Line/area chart (generalize existing sparkline: `.v2-line-chart`, dual Y-axis labels, grid lines, hover tooltips)
29. Stacked bar chart (extend existing `.v2-bars`: multiple segments per column, legend, click to toggle series)
30. Chart tooltips (`.v2-chart-tooltip`, anchored on hover/focus, data point label, fade in/out)

**Justification:** Table is the #1 request for data apps. Breadcrumb/chip/stepper/code block are kit staples. Tree stays minimal to avoid scope creep. Charts extend existing patterns (sparkline engine, bar layout). Size: ~14 KB CSS (7 table features × ~800 bytes, 5 components × ~600 bytes, 3 chart features × ~1 KB), ~4 KB JS (table sort/select, tree expand, chart hover).

**Risk:** Sortable table with large datasets (>500 rows) may need virtual scroll or defer-to-user. Row selection shift-click logic adds ~200 bytes. Tree beyond 3 levels or lazy-load would require a subtree collapse/expand pattern (~600 bytes JS).

### Tier C: Framework Quality (~8-10 KB total CSS+JS, plus tools/)

**Runtime (JS EXTENSIONS):**
31. `SynteqV2.init(root?)` – idempotent re-init for dynamic content (re-scan `[data-v2-*]`, re-attach listeners, refresh nav dock)
32. Custom events on every component (`v2:tab:change`, `v2:accordion:toggle`, `v2:menu:open`, `v2:toast:dismiss`, `v2:dialog:open`, etc.)
33. Programmatic APIs: `tabs.select(index)`, `dialog.open(id, opts)`, `menu.open(trigger)`, `toast.queue(msg, kind)`, etc.
34. `SynteqV2.version` string

**Accessibility & Responsive (CSS + JS):**
35. Density option (`data-v2-density="compact|comfortable|spacious"` scales --v2-space-* by 0.75x / 1x / 1.25x via CSS calc)
36. `forced-colors` mode support (Windows High Contrast: `@media (forced-colors: active)` resets brand tints to `CanvasText`, borders to `ButtonBorder`, ensures semantic HTML conveys state)
37. `pointer: coarse` touch targets (media query: min 44×44 px on all interactive elements under `@media (pointer: coarse)`)
38. Logical properties in new components (`padding-inline`, `margin-block`, `inset-inline-start` for RTL compat)
39. Per-instance token override (document CSS custom property cascade: `<div class="v2-section" style="--v2-content-max:900px">`)

**Dev Tools (Node scripts, NOT shipped):**
40. `tools/check-rules.mjs` – Node script, no dependencies, greps CSS/HTML for violations:
    - Raw colors (hex/rgb outside theme files)
    - Raw px outside tokens (except breakpoints)
    - box-shadow in components
    - Icon-only controls without aria-label
    - Body overflow rule
    - Multiple `data-v2-sidebar-toggle`
    - External URLs (CDN fonts, remote images)
    Exit code 1 if violations found, CI-ready
41. `tools/size-report.mjs` – Measures raw + gzipped sizes per file, compares to baseline, warns if >2x

**Production Hygiene:**
42. CHANGELOG.md (Keep a Changelog format, Unreleased section, semver tags from v2.0.0)
43. Browser support statement in README (evergreen last 2 versions: Chrome, Firefox, Safari, Edge; iOS Safari 15+; no IE11)
44. Theme extension guide in DESIGN.md (how to add a third theme, override tokens, switch via custom data-attribute)

**Justification:** `init()` is critical for SPA usage. Custom events enable reactive frameworks. Density + forced-colors + touch targets = real-world accessibility. Tools enforce rules 3, 4, 6 automatically. CHANGELOG is standard practice. Size: ~6 KB JS (init/events/APIs), ~2 KB CSS (density/forced-colors/coarse), ~400 bytes (version/docs).

**Risk:** `forced-colors` media query not supported in Safari <15.4 (graceful degradation, no runtime cost). Tools require Node 18+ (document this in tools/README.md).

---

## 6. Proposed New Tokens

### 6.1 Strict Additions (4 tokens max)

**Forms:**
1. `--v2-input-h` = `32px` (codifies existing `.v2-input` height, reused for select/textarea line-height base)
2. `--v2-field-gap` = `var(--v2-space-1)` (4px between label and input; keeps it tied to existing scale)

**Status Accents (if needed for alert rail):**
3. `--v2-status-info` = `#3b82f6` (dark) / `#2563eb` (light) – info alerts, optional if we map info → brand

**Pill Radius (if we formalize 999px for switches/progress):**
4. `--v2-radius-pill` = `999px` (circular caps for switch track, range thumb, progress bar—codifies existing gauge track usage)

**Verdict:** Add 1-2 (forms) immediately. Token 3 (info) only if alert component justifies it (or reuse `--v2-brand`). Token 4 (pill) only if we standardize circular elements beyond gauges (likely yes for switch). Total new tokens: **2-4**.

### 6.2 Scoped Modifiers (not global tokens)

- `--v2-table-density`: `1` (default) / `0.75` (compact) / `1.25` (spacious) – multiplier on padding, set per table or globally via `data-v2-density`
- `--v2-dialog-w`: `460px` (default, existing) / `360px` (sm) / `680px` (lg) – scoped override per dialog instance
- `--v2-log-h`: `420px` (existing in data.css) – already scoped, no change needed

These live in component CSS or user style tags, NOT in tokens.css.

---

## 7. Risks & Mitigations

### 7.1 Size Budget Breach
**Risk:** Tier A+B components push CSS past 100 KB raw (over 2x baseline).  
**Mitigation:** Cut Tier B tree component (saves ~1.8 KB). Defer chart extensions to v2.1. Monitor size every phase (Phase Report includes delta table).

### 7.2 Browser Compat (switch/range/details)
**Risk:** Custom `<input type="range">` or `<details>` animation breaks in older Safari.  
**Mitigation:** Feature-detect `field-sizing` for textarea. Use `@supports` for range track styling. `<details>` polyfill not needed (native support since Safari 10.1). Document fallback behavior in DESIGN.md.

### 7.3 Accessibility Validation Gap
**Risk:** WCAG 2.2 AA claim requires manual screen-reader testing, which this workflow cannot perform.  
**Mitigation:** Implement structural ARIA (roles, states, keyboard nav) per WAI-ARIA Authoring Practices. Document that full validation needs human testing. Add disclaimer in README: "Framework targets WCAG 2.2 AA; full compliance requires application-level testing."

### 7.4 Legacy Violations Reintroduced
**Risk:** New components copy existing box-shadow patterns (sidebar menu, tip) before Phase 5 cleanup.  
**Mitigation:** List violations in this report. Phase 1-4 components follow the flat-surface model (1px border + canvas bg, no shadow). Phase 5 fixes legacy violations only after approval.

### 7.5 Single-File JS Grows Unwieldy
**Risk:** JS runtime hits 60 KB+ raw (tabs/menu/toast/table/tree/chart all in one file).  
**Mitigation:** Keep helpers modular (each component init in a function block). If breaching 65 KB, propose splitting dialog/toast/command into `synteq-ui-v2-overlays.js` (~10 KB) as optional import in Phase 4 report.

### 7.6 Token Proliferation
**Risk:** Every component wants a custom token (alert-padding, chip-height, tree-indent…).  
**Mitigation:** Reuse existing scale. New token requires justification: "Used in 3+ components OR needs theme-level override." Max 6 new tokens across all phases.

### 7.7 No Build Step Constraint
**Risk:** Modern CSS features (nesting, container queries) unavailable; workarounds add bytes.  
**Mitigation:** Target evergreen browsers (last 2 versions) where `color-mix()`, `:has()`, `clamp()` work natively. Document browser support floor. Avoid bleeding-edge features (view transitions, anchor positioning).

---

## 8. Phase 0 Deliverables

- [x] Baseline size measurement (raw + gzip)
- [x] Inventory (160 classes, 16 JS methods, 75 tokens, 9 data attrs)
- [x] Rule violations cataloged (19 raw-value, 8 box-shadow)
- [x] Doc/code mismatch audit (5 undocumented APIs)
- [x] Proposed component list (Tier A: 15, Tier B: 15, Tier C: 12)
- [x] Token proposal (2-4 new, justified)
- [x] Risk assessment (7 risks, mitigations for each)

---

## 9. Restatement of Six Hard Rules (in my own words)

1. **Viewport lock:** The HTML and body elements are pinned to 100dvh with overflow hidden. The shell grid never scrolls. Only the `.v2-content` region (with `.v2-scroll` applied) produces a scrollbar. This keeps the dock and topbar fixed while content flows.

2. **Self-hosted typography:** The Google Sans Code font files (Regular, Medium, SemiBold) live in `V2/fonts/` and are loaded exclusively through `fonts.css` using relative paths. No CDN links, no external font requests. The framework works offline.

3. **Token-driven values:** Every color, spacing, radius, type size, and duration in component CSS must reference a `--v2-*` custom property. Raw hex codes, pixel values, and millisecond literals are prohibited except for the seven documented media-query breakpoints (1080/860/720/600/520/420/380px). This ensures theme-switching and design-token updates propagate automatically.

4. **Flat surface hierarchy:** Visual separation comes only from 1px hairline borders (`.v2-section` top border, `--v2-line` / `--v2-line-strong`) and typography weight/size. No card-style background blocks, no `box-shadow` to imply elevation, no tonal surface tiers. Semantic tints (badge colors, button states) are allowed only on small inline elements, never for section-level grouping.

5. **Single navigation toggle:** Exactly one button controls dock visibility: the `[data-v2-sidebar-toggle]` button in the `.v2-topbar`. It adds/removes `.nav-collapsed` on the app shell. Do not add a second toggle inside the dock or anywhere else; state management relies on a single source of truth.

6. **Icon accessibility:** Every interactive element that contains only an icon (no visible text label) must carry an `aria-label` attribute describing its function. Decorative SVG icons must have `aria-hidden="true"`. This applies to `.v2-btn--icon`, `.v2-iconbtn`, `.v2-sidebar-toggle`, `.v2-theme-toggle`, and all similar controls.

---

## 10. Next Steps

**Immediate:** STOP and wait for go/no-go decision.

**If approved:**
- Phase 1: Forms (9 components, CSS + field wiring JS)
- Phase 2: Disclosure and overlays (6 components, keyboard nav + ARIA)
- Phase 3: Feedback and data (7 table features + 5 components + 3 chart extensions)
- Phase 4: Framework quality (runtime APIs, density, forced-colors, tools/, CHANGELOG)
- Phase 5: Legacy cleanup (fix 8 box-shadow violations, codify raw px exceptions, final doc sync)

Each phase ends with a Phase Report (files changed, size delta, linter proof, a11y checklist, open questions) and a STOP.

---

**End of Baseline Report**
