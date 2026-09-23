-- 0005_orders.sql — DRAFT ONLY. NOT EXECUTED.
-- Alur pesanan pelanggan: customers → orders → order_items +
-- order_status_history + payments. Mandiri (create if not exists)
-- agar jalan walau 0001 belum/tidak dijalankan.
-- Nomor order acak (NK-YYMMDD-XXXX), BUKAN urut — lihat docs/SECURITY.md.
-- Jalankan manual di SQL Editor SETELAH 0002/0003/0004. Idempoten.

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  address text,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid not null references outlets(id) on delete restrict,
  customer_id uuid references customers(id) on delete set null,
  order_number text not null unique,
  order_type text not null check (order_type in ('dine_in','takeaway','pickup','delivery')),
  order_status text not null default 'pending'
    check (order_status in ('pending','confirmed','preparing','ready','completed','cancelled')),
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid','pending','paid','failed','expired','refunded')),
  subtotal_idr bigint not null default 0 check (subtotal_idr >= 0),
  discount_idr bigint not null default 0 check (discount_idr >= 0),
  delivery_fee_idr bigint not null default 0 check (delivery_fee_idr >= 0),
  total_idr bigint not null default 0 check (total_idr >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_number_idx on orders (order_number);
create index if not exists orders_status_idx on orders (outlet_id, order_status, created_at desc);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name_snapshot text not null,
  unit_price_idr bigint not null check (unit_price_idr >= 0),
  quantity bigint not null check (quantity > 0),
  line_total_idr bigint not null check (line_total_idr >= 0),
  notes text
);

create table if not exists order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  from_status text,
  to_status text not null,
  actor_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  method text not null check (method in ('cash','manual_qris')),
  status text not null default 'unpaid'
    check (status in ('unpaid','pending','paid','failed','expired','refunded')),
  amount_idr bigint not null check (amount_idr >= 0),
  provider_reference text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists orders_updated_at on orders;
create trigger orders_updated_at
  before update on orders
  for each row execute function set_updated_at();

-- RLS ------------------------------------------------------------------
-- Tamu boleh buat (insert) + baca via nomor order. Nomor acak tak
-- berurutan sehingga tak bisa ditebak (risiko baca-publik diterima
-- untuk MVP; pengetatan ikut task auth/ownership berikutnya).
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_status_history enable row level security;
alter table payments enable row level security;

drop policy if exists "guest insert customers" on customers;
create policy "guest insert customers" on customers
  for insert to anon, authenticated with check (true);

drop policy if exists "guest insert orders" on orders;
create policy "guest insert orders" on orders
  for insert to anon, authenticated with check (true);

drop policy if exists "guest read orders" on orders;
create policy "guest read orders" on orders
  for select to anon, authenticated using (true);

drop policy if exists "guest insert order_items" on order_items;
create policy "guest insert order_items" on order_items
  for insert to anon, authenticated with check (true);

drop policy if exists "guest read order_items" on order_items;
create policy "guest read order_items" on order_items
  for select to anon, authenticated using (true);

drop policy if exists "guest insert order_status_history" on order_status_history;
create policy "guest insert order_status_history" on order_status_history
  for insert to anon, authenticated with check (true);

drop policy if exists "guest read order_status_history" on order_status_history;
create policy "guest read order_status_history" on order_status_history
  for select to anon, authenticated using (true);

drop policy if exists "guest insert payments" on payments;
create policy "guest insert payments" on payments
  for insert to anon, authenticated with check (true);

drop policy if exists "guest read payments" on payments;
create policy "guest read payments" on payments
  for select to anon, authenticated using (true);

-- Tulis operasional (ubah status, koreksi) hanya authenticated.
drop policy if exists "authenticated manage orders" on orders;
create policy "authenticated manage orders" on orders
  for all to authenticated using (true) with check (true);

drop policy if exists "authenticated manage order_items" on order_items;
create policy "authenticated manage order_items" on order_items
  for all to authenticated using (true) with check (true);

drop policy if exists "authenticated manage order_status_history" on order_status_history;
create policy "authenticated manage order_status_history" on order_status_history
  for all to authenticated using (true) with check (true);

drop policy if exists "authenticated manage payments" on payments;
create policy "authenticated manage payments" on payments
  for all to authenticated using (true) with check (true);

drop policy if exists "authenticated manage customers" on customers;
create policy "authenticated manage customers" on customers
  for all to authenticated using (true) with check (true);
