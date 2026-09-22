# LANDING PAGE AUDIT — Naoki Chicken Parangtritis

Status: PROPOSED IMPLEMENTATION BACKLOG

## Observed current sections
1. Navbar
2. Hero video
3. Order-channel strip
4. Menu + categories + product cards
5. Red CTA band
6. Order steps
7. FAQ
8. Footer
9. Cart drawer/floating cart

## Highest-value gaps to address
### P0 — conversion / integrity
- Real order CTA should lead to the actual ordering flow.
- Tracking CTA must lead to a real tracking route/section.
- Footer links must map to their real destinations.
- Social links must be real or clearly disabled until verified.
- Outlet information should be configuration-driven, not permanent placeholder copy.

### P1 — content depth
- Featured/bestseller block from actual product data.
- Configurable promotion/highlight block.
- Service/order-mode status based on outlet settings.
- Outlet location + opening hours + contact block.
- Final CTA before footer.

### P2 — visual richness
- Real-food gallery / ambience block when assets exist.
- Brand story/value block using verified content.
- Real customer reviews only when sourced from a trusted/consented data source.

## Guardrails
- Never invent business facts.
- Do not fake reviews or metrics.
- Do not add raw-material ERP or unrelated admin complexity to make the landing page look full.
- Keep existing red/gold/cream design system.
- Maintain responsive, mobile-first behavior.

## Backend questions every new section must answer
- Source table/config:
- Field(s):
- Admin editor:
- Empty state:
- Cache/realtime need:

## Acceptance criteria
- The landing page feels complete without decorative filler.
- Every CTA has a valid destination or a clearly bounded temporary state.
- No new runtime or build errors.
- Existing cart/menu behavior still works.
- New content is configurable where practical.
