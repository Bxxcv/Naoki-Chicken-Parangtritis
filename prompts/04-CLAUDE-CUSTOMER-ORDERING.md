# CLAUDE — CUSTOMER ORDERING

Read relevant docs before coding:
MASTER-CONTEXT, REQUIREMENTS, USER-FLOWS, DATABASE, ORDER-PAYMENT-STATES, UI-UX, SECURITY, CLAUDE-WORKFLOW, SKILL.

Implement one module only: customer menu → cart → checkout → order creation → tracking shell.

Rules:
- server/authenticated source of truth for product price
- never trust client totals
- order type must respect outlet settings
- payment gateway is not implemented yet
- preserve responsive UI
- do not rewrite admin modules

Acceptance:
- add/remove/update quantity
- subtotal derived correctly
- invalid/unavailable product rejected
- order created with authoritative totals
- status tracking is read-only for customer
- loading/error/empty states exist
- mobile interaction is usable

Return changed files + tests + known limitations.
