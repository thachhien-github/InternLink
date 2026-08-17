# Frontend — InternLink

React 19 + Vite + Tailwind 4. Portals: SuperAdmin / Lecturer / Student — wired to backend API (mock optional via env).

## Local dev (API mode)

1. **Backend** — from repo root:

   ```bash
   dotnet run --project backend/InternLink/InternLink.API/InternLink.API.csproj --launch-profile http
   ```

   API: `http://localhost:7109`

2. **Frontend env** — copy example and keep mock off:

   ```bash
   cd frontend
   cp .env.example .env.local
   ```

3. **Frontend**:

   ```bash
   npm install
   npm run dev
   ```

   App: `http://localhost:5173`

**Demo accounts** (seed): `superadmin` / `lecturer1` / `student1` — password `Password123!`

**Verify:** `npm run typecheck` · `npm run build` · `npm run smoke:m6` · `npm run smoke:m7`

Demo script: [`../docs/Demo-UI-Script.md`](../docs/Demo-UI-Script.md)

## UI rules (F0)

Keep the shell flat and academic — avoid AI-generic chrome.

### Radius

| Use | Class / token | Size |
|-----|---------------|------|
| Chip, compact control | `rounded` / `--il-radius-sm` | 4px |
| Button, input, nav item | `rounded-md` / `--il-radius-base` | 6px |
| Panel, dropdown | `rounded-lg` / `--il-radius-panel` | 8px |
| Modal | `--il-radius-modal` | 10px |

**Avoid by default:** `rounded-2xl`, `rounded-3xl`, `rounded-full` on large blocks (avatars / status dots only).

### Cards vs panels

- Prefer `.il-panel` or `Panel`: white + 1px border, no hover lift.
- Cards only for interactive containers (modal, form workspace).
- Do not wrap every KPI / filter / list row in a shadowed card.
- Page headers use `.il-toolbar` / `PageHeader` (border-bottom), not a floating card.

### Color & chrome

- Brand: navy `#0b132b` + blue `#1d4ed8` (not indigo/purple gradients).
- App shell: solid white header/sidebar, page bg `var(--il-surface-bg)` (`#f8fafc`).
- No glass blur on dashboard chrome; `.il-glass-panel` is login-only.
- Nav active: `.il-nav-active` (solid navy).
- Buttons: `.il-btn` / `.il-btn-primary|secondary|ghost`.

### Tokens

Source of truth: `src/styles/designTokens.css`.

Plan: [`../docs/Frontend-UI-Plan.md`](../docs/Frontend-UI-Plan.md).
