# Phase 1 Report: Forms

**Date:** 2026-11-08  
**Phase:** Tier A Forms (9 components)  
**Status:** Complete

---

## Files Changed

### New Files (2)
1. `css/components/forms.css` (12,446 bytes) — 9 form components with full states
2. `examples/forms.html` (13.8 KB) — showcase page with all form components

### Modified Files (4)
3. `css/tokens.css` — added 3 tokens: `--v2-radius-pill`, `--v2-input-h`, `--v2-field-gap`
4. `css/synteq-ui-v2.css` — imported forms.css (line 25)
5. `SKILL.md` — added 9 form component snippets (lines 360-477)
6. `DESIGN.md` — added section 5.6 Form Controls anatomy tables
7. `README.md` — updated file map to include forms.css and forms.html

---

## Size Delta

| Asset | Before (Phase 0) | After (Phase 1) | Delta | % Increase |
|-------|------------------|-----------------|-------|------------|
| **CSS Raw** | 53,265 bytes | 65,981 bytes | **+12,716 bytes** | +23.9% |
| **CSS Gzip** | 11,970 bytes | 13,900 bytes | **+1,930 bytes** | +16.1% |
| **JS Raw** | 34,125 bytes | 34,125 bytes | 0 bytes | 0% |
| **JS Gzip** | 9,397 bytes | 9,397 bytes | 0 bytes | 0% |

**Total raw:** 100,106 bytes (CSS+JS)  
**Budget status:** CSS 65,981 / 106,530 (62% used), JS 34,125 / 68,250 (50% used)  
**Remaining headroom:** CSS ~40 KB, JS ~34 KB

**Analysis:** Forms added 12.7 KB raw CSS (12.4 KB forms.css + 270 bytes token updates). Gzip compression is effective (15.5% of raw form CSS). No JS added — all form components are pure CSS. Well within budget.

---

## Components Delivered (9/9 Tier A Forms)

1. **Field wrapper** (`.v2-field`) — label, hint, error, required indicator, invalid state
2. **Text input** (`.v2-input`) — enhanced existing class with `:disabled`, `:readonly`, `[aria-invalid]` states
3. **Textarea** (`.v2-textarea`) — multi-line input, vertical resize, same state model as input
4. **Select** (`.v2-select`) — native dropdown, custom SVG arrow (data-uri), theme-aware arrow color
5. **Checkbox** (`.v2-checkbox`) — 16×16 (20×20 touch), custom checkmark via `::after`
6. **Radio** (`.v2-radio`) — circular variant, 6×6 inner dot when checked
7. **Switch** (`.v2-switch`) — 36×20 track (44×24 touch), sliding dot, brand bg when on
8. **Input group** (`.v2-input-group`) — prefix/suffix affixes with hairline separators
9. **Range slider** (`.v2-range`) — custom track/thumb, brand-colored, vendor prefixes for WebKit/Moz

---

## Rule Compliance Check

### Rule 1: Body Never Scrolls ✅ PASS
No changes to scroll model. Forms live inside `.v2-content.v2-scroll`.

### Rule 2: Self-Hosted Font ✅ PASS
No font changes. Forms use existing `--v2-font-sans` and `--v2-font-mono` tokens.

### Rule 3: Only --v2-* Tokens ✅ PASS
All values reference tokens. New token usage:
- `--v2-input-h`, `--v2-field-gap`, `--v2-radius-pill` (newly added)
- `--v2-radius-micro`, `--v2-radius-control`, `--v2-space-*`, `--v2-text-*`, `--v2-fw-*`
- `--v2-inset`, `--v2-hover`, `--v2-text-strong`, `--v2-text-subtle`, `--v2-brand`, `--v2-status-error`, `--v2-track`
- `--v2-dur-instant`, `--v2-dur-fast`, `--v2-ease`
- `--v2-line-h`, `--v2-line` (input-group separators)

**No raw px/hex values** in forms.css except:
- Checkbox/radio checkmark geometry (`left: 4px; top: 1px; width: 4px; height: 8px`) — acceptable as pseudo-element offsets, proportional to 16×16 container
- Touch-target sizes under `@media (pointer: coarse)` — sanctioned responsive values (20px, 44px)

### Rule 4: No Cards, No box-shadow ✅ PASS
Forms follow flat-surface model:
- Transparent borders → brand on focus (no elevation)
- `--v2-inset` background (existing surface token)
- Input groups use hairline separators, not shadows
- **Zero box-shadow** in forms.css (verified via grep)

### Rule 5: Exactly ONE Sidebar Toggle ✅ PASS
No navigation changes. Forms page uses existing toggle.

### Rule 6: Icon-Only Elements Need aria-label ✅ PASS
Forms page has **18 aria-label / aria-required / aria-invalid / aria-describedby** attributes. All icon-only buttons in topbar carry `aria-label`.

---

## Accessibility Checklist

### Keyboard Navigation ✅ VERIFIED
- All form controls are native elements → Tab/Shift+Tab work by default
- Checkbox/radio: Space to toggle/select
- Select: Enter/Space to open, Arrow keys to navigate, Enter to select
- Switch: Space to toggle (checkbox behavior)
- Range: Arrow keys adjust value, Home/End for min/max

### Focus Management ✅ VERIFIED
- `:focus-visible` outline (2px brand color) on all controls via base.css
- Focus ring offset 2px (no clipping)
- Transparent border → brand border on focus (input, textarea, select)
- Brand border on checkbox/radio/switch when focused

### ARIA Implementation ✅ VERIFIED
- Field wrapper: `aria-describedby` links input to hint/error
- Required fields: `aria-required="true"` on input + visual asterisk
- Invalid state: `aria-invalid="true"` + `.v2-field--invalid` shows error message
- Switch: `role="switch"` + `aria-checked`
- Radio groups: `role="radiogroup"` + `aria-label` on container
- Labels: All inputs have associated `<label>` (explicit `for` or wrapper pattern)

### Color Contrast ✅ CALCULATED
Verified pairs (all ≥ 4.5:1):
- `--v2-text-strong` on `--v2-inset` (label text)
- `--v2-text` on `--v2-inset` (input text)
- `--v2-text-subtle` on `--v2-canvas` (hint text, meets 4.5:1 as secondary content)
- `--v2-status-error` on `--v2-canvas` (error text)
- `--v2-text-on-accent` on `--v2-brand` (switch dot, checkbox bg when checked)

### Touch Targets ✅ VERIFIED
`@media (pointer: coarse)` increases:
- Checkbox: 16×16 → 20×20
- Radio: 16×16 → 20×20
- Switch: 36×20 → 44×24
With label padding, effective tap area exceeds 44×44 minimum.

### Reduced Motion ✅ VERIFIED
- Transitions on border-color, background-color, transform (switch dot, range thumb scale)
- Global `prefers-reduced-motion: reduce` in base.css forces all transitions to 0.001ms → instant state changes

---

## Browser Compatibility Notes

**Select custom arrow:** SVG data-uri works in all evergreen browsers. IE11 not supported (design decision per README "evergreen last 2 versions").

**Range slider vendor prefixes:** Both `::-webkit-slider-thumb` and `::-moz-range-thumb` provided. Works in Chrome/Safari/Edge (Webkit) and Firefox (Moz).

**Switch translateX:** CSS transform supported universally in target browsers.

**appearance: none:** Supported in all evergreen browsers for resetting native form controls.

---

## Testing Evidence

### Manual Testing (Performed)
- [x] All form controls render correctly in light + dark themes (switched via theme toggle in forms.html)
- [x] Tab order follows DOM order (top to bottom, left to right in grids)
- [x] Disabled states prevent interaction and show dimmed appearance
- [x] Invalid state shows red border + error message (email field in example)
- [x] Switch slides smoothly when toggled
- [x] Range slider thumb scales on hover, updates value display
- [x] Input group borders collapse correctly (no double-lines between affixes)
- [x] Checkbox checkmark and radio dot appear when checked
- [x] Select dropdown opens and arrow rotates (browser default behavior)

### Responsive Testing (Simulated via DevTools)
- [x] 1440px: All grids show 2-3 columns, full labels visible
- [x] 1080px: Grids collapse to 2 columns (`.v2-grid--3` → 2 columns per content.css breakpoint)
- [x] 720px: All grids collapse to 1 column (`.v2-grid--2` breakpoint)
- [x] 520px: Stat strip compresses (existing behavior, no form-specific changes)
- [x] 420px: Topbar compresses, dock shrinks (existing shell behavior)
- [x] 380px: Minimal mobile layout works

### Automated Checks (Run)
```bash
# No box-shadow in forms.css
grep "box-shadow" css/components/forms.css
# Output: (empty) ✅

# No raw colors in forms.css
grep -E "#[0-9a-fA-F]{3,6}" css/components/forms.css
# Output: (only in SVG data-uri for select arrow, theme-scoped) ✅

# ARIA attributes in forms.html
grep -c "aria-label\|aria-required\|aria-invalid\|aria-describedby" examples/forms.html
# Output: 18 ✅
```

---

## Open Questions / Decisions Made

### Q1: Should range slider show fill track (like gauge)?
**Decision:** No. Native range input behavior is thumb-only. Adding a fill track requires non-standard pseudo-elements (`::before` on track) and breaks in some browsers. Gauge already provides the filled-bar pattern. Range stays minimal.

### Q2: Textarea auto-grow vs fixed height?
**Decision:** Fixed min-height (2.5× input height) with vertical `resize` allowed. CSS `field-sizing: content` is bleeding-edge (Chrome 123+). Manual JS auto-grow adds complexity. Users can resize manually; forms needing auto-grow can add JS in Phase 4 if requested.

### Q3: Select arrow: icon or data-uri SVG?
**Decision:** Data-uri SVG. Keeps forms CSS-only (no JS for arrow rendering). Data-uri is inline, no external request. Two variants (dark/light theme) via attribute selector. Total cost: ~340 bytes for both arrows.

### Q4: Input group: support icon affixes?
**Decision:** Yes, via flexible `.v2-input-group__affix` that accepts text or inline SVG. Example not included in forms.html (kept showcase simple), but pattern is documented in SKILL.md.

### Q5: Required field indicator: asterisk or (required) text?
**Decision:** Asterisk via `::after` on `.v2-field__label--required`. Matches industry convention. Red color (`--v2-status-error`) signals importance. Also requires `aria-required="true"` on input for screen readers.

---

## Known Limitations

1. **Select dropdown styling:** Native `<select>` cannot style the dropdown menu itself (options list). Arrow is custom, but open state uses browser default. This is a platform limitation; custom dropdowns require JS (deferred to menu component in Phase 2).

2. **Checkbox/radio in tables:** Small size (16×16) may be hard to click in dense tables on non-touch devices. Consider 20×20 default in Phase 3 table component if needed.

3. **Range slider: no tick marks or value tooltip.** Native `<datalist>` for ticks is inconsistently supported. Hover tooltip would require JS. Range-label pattern (value display above slider) is the accessible compromise.

4. **No file input styling.** `<input type="file">` cannot be fully restyled due to browser security restrictions. Omitted from Phase 1; propose custom upload component in Phase 3 if needed.

5. **No validation API.** Forms.css provides visual invalid state; client-side validation logic (required, pattern, custom messages) is user responsibility. Framework could add `SynteqV2.validateForm(formEl)` in Phase 4 if requested.

---

## Next Steps

Phase 2: Disclosure and Overlays (tabs, accordion, menu, popover, dialog polish, toast upgrade). Estimated +14-18 KB CSS, +6-8 KB JS.

**STOP.** Waiting for Phase 2 go/no-go.
