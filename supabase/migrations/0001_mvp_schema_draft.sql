-- DRAFT ONLY. NOT EXECUTED PRODUCTION SQL.
-- See docs/DATABASE.md and docs/SECURITY.md before applying.

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

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid not null references outlets(id) on delete restrict,
  customer_id uuid references customers(id) on delete set null,
  order_number text not null unique,
  order_type text not null check (order_type in ('dine_in','takeaway','pickup','delivery')),
  order_status text not null default 'pending' check (order_status in ('pending','confirmed','preparing','ready','completed','cancelled')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','pending','paid','failed','expired','refunded')),
  subtotal_idr bigint not null default 0 check (subtotal_idr >= 0),
  discount_idr bigint not null default 0 check (discount_idr >= 0),
  delivery_fee_idr bigint not null default 0 check (delivery_fee_idr >= 0),
  total_idr bigint not null default 0 check (total_idr >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
  method text not null check (method in ('cash','manual_qris','gateway')),
  status text not null default 'unpaid' check (status in ('unpaid','pending','paid','failed','expired','refunded')),
  amount_idr bigint not null check (amount_idr >= 0),
  provider_reference text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists inventory_items (
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid not null references outlets(id) on delete cascade,
  product_id uuid not null unique references products(id) on delete cascade,
  stock_qty bigint not null default 0 check (stock_qty >= 0),
  low_stock_threshold bigint not null default 5 check (low_stock_threshold >= 0),
  is_unlimited boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists stock_movements (
  id uuid primary key default gen_random_uuid(),
  inventory_item_id uuid not null references inventory_items(id) on delete cascade,
  movement_type text not null,
  quantity_delta bigint not null,
  reason text,
  reference_type text,
  reference_id uuid,
  actor_id uuid,
  created_at timestamptz not null default now()
);
