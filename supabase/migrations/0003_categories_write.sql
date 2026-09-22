-- 0003_categories_write.sql — DRAFT ONLY. NOT EXECUTED.
-- Pelengkap 0002: kategori baru dibuat otomatis saat simpan produk,
-- jadi peran authenticated butuh tulis ke tabel categories.
-- Penyempitan per outlet-membership menyusul bersama task auth
-- (lihat docs/ROLES-PERMISSIONS.md). Idempoten, aman diulang.

drop policy if exists "authenticated manage categories" on categories;
create policy "authenticated manage categories" on categories
  for all to authenticated using (true) with check (true);
