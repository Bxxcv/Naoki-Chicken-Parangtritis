# DEPLOYMENT — VERCEL + SUPABASE

## Environments
Start with:
- local development
- Supabase development/project
- Vercel preview
- production later

Avoid changing production directly from an Android editor without a tested migration path.

## Vercel env
Expected public client variables:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

Never put secret service-role credentials in `VITE_*` variables.

## Git workflow
Small commits with one purpose:
- feat: customer menu shell
- feat: order schema
- feat: cashier
- fix: order status guard

Do not commit `.env` files.
