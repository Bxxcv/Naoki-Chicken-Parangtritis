# MUSE SPARK — LANDING PAGE EXECUTION TASK

## Target
Muse Spark 1.3 via OpenCode Zen, `high` variant.

## Context lock
Project: Naoki Chicken Parangtritis Digital Ordering & Management System.
Goal: progressively replace the outlet's Olsera workflow with an owned system.
MVP scope: Parangtritis first; architecture reusable later.
Stack: React + Vite + Bootstrap 5/custom CSS + Supabase + Vercel + GitHub.

## Current landing already has
- sticky navbar
- video hero
- service-channel strip
- product/category browsing
- cart drawer + floating cart
- CTA red band
- order steps
- FAQ
- footer

## First task
Audit and improve ONLY the customer landing page.
Do not expand admin modules unless a landing dependency requires it.

## Required outcome
The landing page must stop feeling empty while remaining truthful and useful.
Prioritize:
1. clear primary order CTA;
2. outlet/service status;
3. featured/bestseller menu block using real product flags/data;
4. configurable promotion/highlight area;
5. concise brand/value section using verified information only;
6. outlet/location/hours/contact block fed from configuration/admin data;
7. ambience/gallery only with real assets or safe placeholders;
8. service/order mode selector tied to outlet settings;
9. final strong CTA;
10. mobile sticky order action when it does not conflict with cart UI.

## Critical integrity rules
- Never invent production facts.
- Never fabricate reviews, ratings, prices, hours, address, phone, social URLs, delivery coverage, or payment claims.
- If required data is unavailable, implement a configurable empty state rather than fake content.
- Do not use mock analytics.
- Do not break Supabase product loading.
- Do not trust browser price/state as the financial source of truth.
- Do not rewrite the architecture.

## Known issues to inspect during this task
- Navigation semantics must match actual sections/routes.
- “Lacak pesanan” must not point to an unrelated section.
- Footer links must not all point to the same anchor.
- Social buttons must not imply real social accounts if URLs are unverified.
- “Alamat, jam buka, dan kontak resmi menunggu konfirmasi outlet” should be represented as configurable outlet data, not left as an unfinished-looking production copy block.

## Verification
Run:
- npm run build
- route check for `/`
- runtime/console check when available
- responsive check at narrow phone and desktop widths
- asset URL check

## Output
Return only:
STATUS
FOUND
CHANGED
TEST
LIMITATION
NEXT
