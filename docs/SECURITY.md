# SECURITY BASELINE

## Rules
- Supabase anon key is public by design, service-role key is never public.
- No secrets in Git.
- No payment provider secrets in Vite variables.
- RLS required for user/outlet scoped data.
- Server-side validation for order totals, discounts, permissions, and status transitions.
- Never expose arbitrary order lookup by sequential numeric IDs.
- Prefer UUIDs and scoped access tokens/ownership checks.
- Audit privileged actions.
- Do not trust client stock, payment, or totals.

## Abuse cases to test
- user reads another user's order
- staff reads another outlet's data
- kitchen mutates price
- customer marks payment paid
- customer changes completed order
- negative quantity
- absurd quantity
- discount bypass
- duplicate order submission
- duplicate webhook (future gateway)
