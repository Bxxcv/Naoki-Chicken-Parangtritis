-- 0010_order_archive.sql — DRAFT ONLY. NOT EXECUTED.
-- Arsip lunak: order selesai/dibatalkan disembunyikan dari operasional
-- TANPA menghapus data (Laporan tetap menghitung). Kolom ganda aman
-- (add column if not exists). Jalankan SETELAH 0005. Idempoten.

alter table orders
  add column if not exists is_archived boolean not null default false;
create index if not exists orders_archive_idx
  on orders (outlet_id, is_archived, created_at desc);
