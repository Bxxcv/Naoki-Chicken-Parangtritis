# ARCHITECTURE DECISIONS

## ADR-001: React + Vite instead of Next.js
Reason: project will be built and maintained largely from Android; a lean Vite SPA is sufficient for this operational application and keeps the frontend simpler.

## ADR-002: Supabase backend
Reason: reduces backend boilerplate for a small team/solo builder while providing PostgreSQL/Auth/Storage and optional Realtime.

## ADR-003: No Vue in the same app
The phrase “React + Vue” is interpreted as a tooling/UI ambiguity. We choose **React** as the app framework. CSS can be Bootstrap + custom CSS. Mixing React and Vue in one app would add complexity without MVP value.

## ADR-004: Payment gateway later
Reason: provider choice and webhook contract should be decided after the local order/payment domain is stable.

## ADR-005: Simple stock
Reason: outlet needs practical saleability control, not raw-material ERP.

## ADR-006: Parangtritis-first
Reason: direct operational access makes this the most reliable pilot and reduces scope. Architecture remains reusable.
