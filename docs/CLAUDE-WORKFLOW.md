# CLAUDE FREE VIBE-CODING WORKFLOW

## Rule 1
Do not ask Claude to build the entire system in one prompt.

## Rule 2
Claude must read these docs before coding a related module:
- `docs/MASTER-CONTEXT.md`
- relevant feature doc
- `skills/naoki-chicken-master-skill/SKILL.md`

## Task packet format
Each task given to Claude should contain:
1. Goal
2. Files in scope
3. Existing behavior
4. Required behavior
5. Do-not-touch list
6. Acceptance criteria
7. Tests

## Recommended order
1. project shell
2. auth/role skeleton
3. products/categories
4. customer menu
5. cart/checkout
6. orders
7. kitchen
8. cashier/POS
9. stock
10. expenses/cash
11. reports
12. payment abstraction
13. future gateway
14. hardening

## Context discipline
- Do not paste all project files into chat.
- Keep the master context compact.
- Use one module per task.
- Require changed-file list and tests.
- If more than 5 files need coordinated edits, ask Claude to provide a patch summary before continuing.

## Stop conditions
Claude must stop instead of guessing when:
- DB schema is ambiguous
- authorization boundary is unclear
- payment semantics are unclear
- a destructive migration is proposed
- a provider contract is unknown
