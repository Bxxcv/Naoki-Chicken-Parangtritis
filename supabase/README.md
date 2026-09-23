# Supabase implementation note

The project intentionally includes **planning-level** database files only.

Before applying a migration:
1. inspect the existing database state;
2. confirm the migration is compatible;
3. test in a non-production Supabase project;
4. verify RLS and behavior;
5. only then deploy.

Do not claim a migration is executed just because the file exists.

## Files
- `migrations/0001_mvp_schema_draft.sql` — skema awal (DRAFT).
- `migrations/0002_products_backend.sql` — outlet + kategori + products
  + bucket `product-images` + RLS (DRAFT). Jalankan manual di SQL Editor.
- `migrations/0003_categories_write.sql` — izin tulis kategori untuk
  authenticated (DRAFT). Jalankan menyusul 0002.
- `migrations/0005_orders.sql` — customers/orders/items/history/
  payments + RLS tamu & operasional (DRAFT).
- `migrations/0006_order_ownership.sql` — tautan order ke akun login
  (user_id) + baca milik sendiri (DRAFT).
- `migrations/0008_cash_sessions.sql` — sesi kas + penyesuaian +
  RLS operasional (DRAFT).
- `migrations/0009_expenses.sql` — pengeluaran outlet + RLS (DRAFT).
