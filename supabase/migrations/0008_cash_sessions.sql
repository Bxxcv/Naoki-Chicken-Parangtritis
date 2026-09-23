-- 0008_cash_sessions.sql — DRAFT ONLY. NOT EXECUTED.
-- Sesi kas POS: buka (modal awal) → penyesuaian kas (alasan wajib) →
-- tutup + rekonsiliasi. Kas yang diharapkan DITURUNKAN dari:
--   modal awal + penjualan tunai lunas + penyesuaian tercatat,
-- bukan dari ketikan kasir (docs/POS-CASHIER.md).
-- Penjualan dibaca dari payments (bukan diduplikasi ke sini).
-- Satu sesi terbuka per outlet. Jalankan SETELAH 0005. Idempoten.

create table if not exists cash_sessions (
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid not null references outlets(id) on delete restrict,
  opened_by uuid,
  opening_amount_idr bigint not null default 0 check (opening_amount_idr >= 0),
  status text not null default 'open' check (status in ('open','closed')),
  closing_amount_declared_idr bigint check (closing_amount_declared_idr is null or closing_amount_declared_idr >= 0),
  expected_amount_idr bigint,
  variance_idr bigint,
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  closed_by uuid
);
create unique index if not exists cash_sessions_one_open_uidx
  on cash_sessions (outlet_id) where (status = 'open');

create table if not exists cash_transactions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references cash_sessions(id) on delete cascade,
  kind text not null check (kind in ('in','out')),
  amount_idr bigint not null check (amount_idr > 0),
  reason text not null,
  actor_id uuid,
  created_at timestamptz not null default now()
);

alter table cash_sessions enable row level security;
alter table cash_transactions enable row level security;

drop policy if exists "authenticated manage cash_sessions" on cash_sessions;
create policy "authenticated manage cash_sessions" on cash_sessions
  for all to authenticated using (true) with check (true);

drop policy if exists "authenticated manage cash_transactions" on cash_transactions;
create policy "authenticated manage cash_transactions" on cash_transactions
  for all to authenticated using (true) with check (true);
