# CLAUDE — DATABASE PHASE

Read:
- docs/MASTER-CONTEXT.md
- docs/DATABASE.md
- docs/ROLES-PERMISSIONS.md
- docs/ORDER-PAYMENT-STATES.md
- docs/SECURITY.md
- supabase/migrations/0001_mvp_schema_draft.sql
- skills/naoki-chicken-master-skill/SKILL.md

## Goal
Turn the draft into a safe Supabase MVP schema and RLS plan.

## Constraints
- inspect existing objects before adding duplicates
- do not claim execution
- do not weaken security
- server-authoritative totals
- outlet scoping must be explicit
- keep payment provider integration deferred
- use migrations, not destructive rewrites

## Output
1. proposed migration(s)
2. RLS policy plan
3. assumptions
4. verification checklist
5. files changed

Stop if a requirement requires production data that is not available.
