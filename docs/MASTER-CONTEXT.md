# MASTER CONTEXT — DO NOT LOSE PROJECT DIRECTION

## Identity
Project: **Naoki Chicken Parangtritis Digital Ordering & Management System**.

## Real business context
- The Parangtritis outlet is managed independently by its local partner and is no longer operated by the central Naoki Chicken party.
- The outlet currently uses Olsera for operations.
- The purpose of this project is to **progressively replace the relevant Olsera workflow** with a system owned/controlled by the outlet.
- The developer works in the kitchen and does not have access to every current Olsera admin screen. Therefore, unknown Olsera behavior must not be invented.

## Scope lock
Build for **Naoki Chicken Parangtritis first**.
Do not build a public multi-restaurant SaaS in MVP.
Keep the domain/data model reusable enough for later expansion.

## Locked stack
- React
- Vite
- Bootstrap 5 + project-specific CSS
- Supabase PostgreSQL/Auth/Storage (Realtime only when justified)
- Vercel deployment
- GitHub source control
- Android + SPCK/Termux development workflow
- Payment gateway integration is a **later phase**, not MVP core.

## Product goal
Replace the operational value of Olsera over time with:
- customer online ordering
- POS/cashier
- kitchen order display
- product management
- simple stock
- customer management
- expenses/cash management
- payment configuration
- reporting/analytics
- staff roles/permissions

## Product non-goals for MVP
- raw-material ERP
- recipe/BOM production costing
- public SaaS billing
- multi-restaurant onboarding
- complex loyalty engine
- AI chatbot
- fake analytics with no source data
- payment gateway integration before payment abstraction is stable

## Truth labels
Every implementation claim must be classified as one of:
- OBSERVED
- FROM PUBLIC SOURCE
- PROPOSED
- CODED
- TESTED
- VERIFIED
- PRODUCTION-VERIFIED

Never label a proposal as verified.
