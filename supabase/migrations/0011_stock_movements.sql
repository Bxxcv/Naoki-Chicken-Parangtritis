-- 0011_stock_movements.sql — DRAFT ONLY. NOT EXECUTED.
-- Riwayat perubahan stok saleable: setiap ubah stok produk tercatat
-- (delta, alasan, pencatat, waktu). Append-only: tanpa update/delete
-- untuk peran operasional. Jalankan SETELAH 0002. Idempoten.

create table if not exists stock_movements (
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid not null references outlets(id) on delete restrict,
  product_id uuid references products(id) on delete set null,
  product_name_snapshot text not null default '',
  quantity_delta bigint not null,
  stock_after bigint not null default 0,
  reason text not null default 'penyesuaian manual',
  actor_id uuid,
  created_at timestamptz not null default now()
);
create index if not exists stock_movements_outlet_time_idx
  on stock_movements (outlet_id, created_at desc);

alter table stock_movements enable row level security;

drop policy if exists "authenticated read stock_movements" on stock_movements;
create policy "authenticated read stock_movements" on stock_movements
  for select to authenticated using (true);

drop policy if exists "authenticated insert stock_movements" on stock_movements;
create policy "authenticated insert stock_movements" on stock_movements
  for insert to authenticated with check (true);
