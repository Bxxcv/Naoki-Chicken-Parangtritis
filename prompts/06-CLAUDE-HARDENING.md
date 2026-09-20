# CLAUDE — HARDENING & REPLACEMENT READINESS

Read all relevant docs, especially TESTING, SECURITY, ROADMAP, and the master skill.

Audit the current implementation against the project's replacement goal.

Check:
- auth
- RLS
- role boundaries
- cross-order access
- price/totals trust
- duplicate order submission
- status transitions
- stock consistency
- cash reconciliation
- responsive behavior
- error handling
- logs/audit trail

Classify each finding:
PASS / FAIL / NOT VERIFIED / BLOCKED.

Do not invent test evidence.
Do not claim Olsera replacement readiness until the affected workflow has actual behavior-level verification.
