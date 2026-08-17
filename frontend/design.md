# InternLink — Design System (Hallmark · locked)

/* Hallmark · pre-emit critique: P5 H4 E5 S5 R5 V4 */

**Scope:** Admin / Lecturer / Student app chrome (not marketing landing).  
**Genre:** Utilitarian editorial — academic ops dashboard, not SaaS template.  
**Theme:** Custom — navy anchor + single blue accent, semantic status only.

---

## Philosophy

InternLink is an internship management portal for a university faculty. UI should feel like **internal academic software**: flat surfaces, readable tables, restrained color. Avoid the “AI dashboard” look (gradient KPI cards, purple accents, dark hero panels, nested white boxes).

---

## Tokens (source of truth)

All app UI references `frontend/src/styles/designTokens.css`. Do not introduce inline hex outside tokens except legacy login brand `#0058be`.

| Token | Role |
|-------|------|
| `--il-brand-navy` | Wordmark “Intern”, login dark |
| `--il-brand-blue` | Primary actions, nav active, KPI left border |
| `--il-surface-*` | Page, card, muted, border |
| `--il-color-success/warning/danger/info` | Status only |
| `--il-radius-panel` (8px) | Max radius on panels — no `rounded-2xl` on blocks |
| `--il-font-sans` | Body (Plus Jakarta Sans) |
| `--il-font-display` | KPI numbers (Space Grotesk) |

---

## Layout rules

1. **Page** → `slate-50` / `--il-surface-bg`, no mesh on app pages.
2. **Section** → spacing (`space-y`, `gap`), not nested cards.
3. **Primary panel** → `Panel` / `.il-panel`: white + 1px border, **no shadow** (or hairline only).
4. **Toolbar** → `.il-toolbar`: flat row + bottom border, not floating card.
5. **Tables** → flat rows, `hover:bg-slate-50`, hairline `#e2e8f0`.

---

## Component voice

| Element | Treatment |
|---------|-----------|
| KPI | Flat white, `border-l-4` tone accent, no gradient fill |
| Sidebar | Light bg; wordmark Intern `#0b132b` + Link `#1d4ed8`; logo on blue-50 chip |
| Badges | Semantic colors; **no purple** for generic UI (use blue/amber/slate) |
| Avatars | Solid `bg-[#1d4ed8]`, no gradient |
| AI / insights banner | Light panel + left accent, not full-bleed dark gradient |
| Progress bars | Solid fill, no gradient track |
| Login | Only place allowed subtle mesh / gradient (brand) |

---

## Anti-patterns (forbidden in app chrome)

- `bg-gradient-to-*` on dashboard panels, KPI, sidebars
- Indigo / purple as default accent
- `rounded-2xl` / `rounded-3xl` on large blocks
- Nested card-in-card stacks
- Hover lift (`translateY`, heavy shadow)
- Glass blur on operational pages
- Italic display headings

---

## Motion

- Transitions ≤ 180ms
- Page enter: subtle opacity only (no 8px+ slide on every block)
- No shimmer except skeleton loaders

---

## Responsive (Hallmark gates)

- `overflow-x: clip` on `html` and `body`
- Grids: `minmax(0, 1fr)` where needed
- Mobile: section headers single column at ≤768px

---

## File map

| Concern | File |
|---------|------|
| Tokens | `src/styles/designTokens.css` |
| Panel | `src/components/common/Panel.tsx` |
| KPI | `src/components/common/KpiCard.tsx` |
| Toolbar | `src/components/common/Toolbar.tsx` |
| Page header | `src/components/common/PageHeader.tsx` |

When adding UI, extend tokens first — never one-off gradients in feature files.
