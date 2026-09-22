-- 0002_products_backend.sql — DRAFT ONLY. NOT EXECUTED.
-- Wajib baca sebelum menjalankan:
--   docs/DATABASE.md, docs/SECURITY.md, docs/ROLES-PERMISSIONS.md,
--   docs/DATA-SEED.md, supabase/README.md
--
-- Cara pakai: jalankan manual di Supabase Dashboard > SQL Editor,
-- PROJECT DEVELOPMENT dulu, verifikasi RLS, baru production.
-- File ini idempoten (aman dijalankan ulang).
--
-- Cakupan: outlet + kategori + products + bucket foto + RLS.
-- TIDAK menyentuh orders/payments (fase berikutnya, butuh auth).

create extension if not exists "pgcrypto";

-- 1. Tabel (selaras 0001_mvp_schema_draft.sql) -------------------------
create table if not exists outlets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  timezone text not null default 'Asia/Jakarta',
  created_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid not null references outlets(id) on delete cascade,
  name text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create unique index if not exists categories_outlet_name_uidx
  on categories (outlet_id, name);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid not null references outlets(id) on delete cascade,
  category_id uuid references categories(id) on delete set null,
  name text not null,
  description text,
  image_url text,
  price_idr bigint not null check (price_idr >= 0),
  stock_mode text not null default 'unlimited' check (stock_mode in ('unlimited','finite')),
  stock_qty bigint not null default 0 check (stock_qty >= 0),
  low_stock_threshold bigint not null default 5 check (low_stock_threshold >= 0),
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_updated_at on products;
create trigger products_updated_at
  before update on products
  for each row execute function set_updated_at();

-- 2. Seed identitas saja (BUKAN harga/stok — lihat docs/DATA-SEED.md) --
insert into outlets (name, slug, timezone)
values ('Naoki Chicken Parangtritis', 'parangtritis', 'Asia/Jakarta')
on conflict (slug) do nothing;

insert into categories (outlet_id, name, sort_order)
select id, 'Ayam', 1 from outlets where slug = 'parangtritis'
on conflict (outlet_id, name) do nothing;

insert into categories (outlet_id, name, sort_order)
select id, 'Paket', 2 from outlets where slug = 'parangtritis'
on conflict (outlet_id, name) do nothing;

insert into categories (outlet_id, name, sort_order)
select id, 'Minuman', 3 from outlets where slug = 'parangtritis'
on conflict (outlet_id, name) do nothing;

-- 3. Bucket foto produk (publik baca, tulis terbatas) -------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- 4. RLS: fail closed ----------------------------------------------------
-- Baca publik: hanya produk tersedia (landing butuh item Habis yg
-- is_available=true + stok 0). Tulis: authenticated saja; penyempitan
-- per outlet-membership menyusul bersama task auth (skill stop cond).
alter table outlets enable row level security;
alter table categories enable row level security;
alter table products enable row level security;

drop policy if exists "public read outlets" on outlets;
create policy "public read outlets" on outlets
  for select using (true);

drop policy if exists "public read categories" on categories;
create policy "public read categories" on categories
  for select using (true);

drop policy if exists "public read available products" on products;
create policy "public read available products" on products
  for select using (is_available = true);

drop policy if exists "authenticated manage products" on products;
create policy "authenticated manage products" on products
  for all to authenticated using (true) with check (true);

drop policy if exists "public read product images" on storage.objects;
create policy "public read product images" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "authenticated upload product images" on storage.objects;
create policy "authenticated upload product images" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images');

drop policy if exists "authenticated update product images" on storage.objects;
create policy "authenticated update product images" on storage.objects
  for update to authenticated using (bucket_id = 'product-images');

drop policy if exists "authenticated delete product images" on storage.objects;
create policy "authenticated delete product images" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images');
