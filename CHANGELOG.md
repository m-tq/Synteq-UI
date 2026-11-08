# Changelog

All notable changes to Synteq UI V2 will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-11-08

### Added

**Forms (Phase 1)**
- Field wrapper component (`.v2-field`) with label, hint, error states
- Enhanced text input with `:disabled`, `:readonly`, `[aria-invalid]` states
- Textarea component with vertical resize
- Select dropdown with custom SVG arrow (theme-aware)
- Checkbox component (16×16, 20×20 on touch, custom checkmark)
- Radio button component (circular variant with inner dot)
- Switch component (36×20 track, 44×24 on touch, sliding dot)
- Input group component (prefix/suffix with hairline separators)
- Range slider component (custom track/thumb, vendor prefixes)
- 3 new tokens: `--v2-radius-pill`, `--v2-input-h`, `--v2-field-gap`

**Overlays & Disclosure (Phase 2)**
- Tabs component with roving tabindex, arrow key navigation, brand underline
- Accordion component (native `<details>`, custom arrow, rotate animation)
- Menu dropdown component (keyboard nav, arrow keys, Escape close, typeahead-ready)
- Popover component (non-modal tooltip, auto-positioning, click-outside close)
- Dialog polish (size variants `--sm/--lg`, close button, footer actions, `alertdialog` role)
- Toast upgrade (4 kinds with icons, colored left border, dismiss button, pause-on-hover, slide animations)
- JavaScript APIs: `initTabs()`, `initMenus()`, `initPopovers()`, upgraded `toast(msg, opts)`

**Feedback & Status (Phase 3)**
- Alert component (4 kinds, 3px colored left border, icon + title + message, dismiss button)
- Progress bar (determinate + indeterminate, color variants, label + value display)
- Spinner component (rotating circle, 3 sizes)
- Breadcrumb component (navigation trail, separator, `aria-current` support)
- Empty state component (icon + title + message + action button, centered layout)
- Skeleton variants (text, title, circle, btn) for loading placeholders
- Tag/Chip component (dismissible badge, pill-shaped, color variants)

**Framework Quality (Phase 4)**
- `SynteqV2.version` property (returns `'2.0.0'`)
- `SynteqV2.init()` — idempotent re-init for dynamic content (calls all init helpers)
- Density control via `data-v2-density="compact|comfortable"` (scales spacing tokens)
- Forced-colors mode support (Windows High Contrast compatibility)
- Touch-friendly targets via `@media (pointer: coarse)` (44×44 minimum)
- Rule checker tool (`tools/check-rules.mjs`) — enforces six hard rules automatically
- Size report tool (`tools/size-report.mjs`) — measures raw + gzip, compares to baseline
- CHANGELOG.md (this file)
- Browser support statement in README (evergreen last 2 versions)

**Legacy Cleanup & Documentation (Phase 5)**
- Removed 8 box-shadow violations from baseline (topbar scroll indicator, sidebar overflow hints, nav menu drop-up, tip component, active nav items)
- Replaced with border-only alternatives (topbar: stronger border color, sidebar: removed scroll hints, nav items: top border instead of inset shadow, tip: hairline border)
- Added 12 missing component snippets to SKILL.md (tabs, accordion, menu, popover, dialog, toast, alert, progress, breadcrumb, empty, skeleton, tag)
- Added Theme Extension Guide to DESIGN.md (override tokens, create custom themes, token groups reference, forced-colors notes, best practices)
- Added Browser Support section to README.md (Chrome/Edge/Firefox/Safari minimum versions, required features, progressive enhancement notes)
- All 6 rules now fully compliant (0 violations in production code, linter false positives in comments/code examples only)

### Changed
- Updated README.md file map to include forms.html, overlays.html
- Enhanced existing `.v2-input` with comprehensive state support (was basic, now production-ready)
- Polished `.v2-skeleton` shimmer animation (was in motion.css, now has variants in feedback.css)
- Dialog backdrop blur reduced to 2px (was none, now subtle glassmorphism)
- Toast positioning accounts for collapsed nav dock (dynamic bottom offset)

### Fixed
- Tabs panel visibility via `aria-hidden` (was missing, now properly toggles)
- Menu keyboard focus tracking (roving focus now syncs with arrow keys)
- Popover viewport clamping (was clipping at edges, now 8px safe margin)
- Range slider thumb hover scale on touch devices (disabled via `@media (hover: none)`)

### Deprecated
- `.v2-dot` nested inside `.v2-badge` (badge color already signals state, dot is redundant)

### Performance
- CSS gzip compression: 13.6-16.9% efficiency across phases
- JS gzip compression: 19.9-20.5% efficiency for overlay features
- Zero external dependencies maintained (fully offline-capable)

### Security
- No external CDN requests (all fonts self-hosted)
- No inline script execution (framework is pure declarative HTML + imported JS)
- Data-uri SVGs for select/accordion arrows (no external image requests)

---

## [Unreleased]

### Planned for v2.1
- Advanced table features (sortable columns, row selection, pagination, toolbar)
- Chart extensions (line/area chart with axes, stacked bars, hover tooltips)
- Tree component (expand/collapse, max 3 levels)
- Stepper/Timeline component (vertical progress indicator)
- Code block component (syntax-free, copy button, line numbers)

---

## Version History

- **2.0.0** (2026-11-08) — Production release with forms, overlays, feedback, framework quality
- **1.0.0** (baseline) — Initial dashboard kit (shell, data viz, controls, motion)
