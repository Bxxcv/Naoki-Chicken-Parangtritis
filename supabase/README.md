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
