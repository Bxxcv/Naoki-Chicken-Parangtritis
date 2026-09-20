# CLAUDE — PHASE 0 FOUNDATION

You are the implementation agent for **Naoki Chicken Parangtritis Digital Ordering & Management System**.

Read first:
- docs/MASTER-CONTEXT.md
- docs/PROJECT.md
- docs/DECISIONS.md
- docs/CLAUDE-WORKFLOW.md
- skills/naoki-chicken-master-skill/SKILL.md

## Task
Prepare the React + Vite project foundation only.

## Stack lock
- React + Vite
- Bootstrap + custom CSS
- Supabase client package available but no live schema assumptions
- Vercel deployment compatible

## Do not
- use Next.js
- mix React and Vue
- add payment gateway integration
- invent production Supabase tables
- add unrelated dependencies
- build all modules in one task

## Acceptance criteria
- app boots
- responsive shell exists
- customer/admin areas are separated
- env example exists
- no secrets committed
- styles follow docs/UI-UX.md
- changed files listed
- tests/checks reported truthfully

Stop before implementing business logic outside this scope.
