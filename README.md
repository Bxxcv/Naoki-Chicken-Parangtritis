# Naoki Chicken Parangtritis — MVP Blueprint & Starter

**Project goal:** build a production-oriented digital ordering + management system to progressively replace the current Olsera workflow at **Naoki Chicken Parangtritis**.

## Locked decisions
- Scope now: **Naoki Chicken Parangtritis only**.
- Architecture: reusable enough for later multi-outlet expansion, but no premature SaaS/multi-outlet UI.
- Frontend: **React + Vite**.
- Styling: **Bootstrap + project CSS**. Do not mix React and Vue in the same app; Vue is not needed.
- Backend/data: **Supabase (PostgreSQL/Auth/Storage/Realtime when justified)**.
- Deployment: **Vercel**.
- Source control: **GitHub**.
- Payment gateway: **planned later**; keep a provider-agnostic payment abstraction now.
- Manual QRIS and Cash are supported by the design plan.
- Inventory is intentionally simple: product availability/stock, adjustments, alerts, history. No recipe/BOM/raw-material ERP in MVP.
- Order modes: **Dine-in, Takeaway, Pickup, Delivery**.
- Outlet settings can enable/disable order modes and payment methods.
- Owner has full access to the Parangtritis outlet.

## What this ZIP contains
- `docs/` — source-of-truth product, UX, database, security, testing, rollout, and AI workflow docs.
- `prompts/` — compact prompts for Lovable/DesignArena and Claude Free.
- `skills/` — project-specific Claude operating skill adapted from the supplied token-efficient skills.
- `supabase/` — draft schema/seed guidance; nothing here should be treated as executed production state.
- `src/` — minimal React/Vite starter shell, intentionally not pretending to be the finished app.
- `reference-ui/` — the two visual references supplied for this project.

## Important
This is a **planning + implementation starter**, not a claim that the replacement for Olsera is already production-ready. Build in phases and verify every critical flow.
