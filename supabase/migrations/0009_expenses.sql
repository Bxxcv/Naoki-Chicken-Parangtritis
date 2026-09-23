-- 0009_expenses.sql — DRAFT ONLY. NOT EXECUTED.
-- Pengeluaran outlet: nominal, kategori, catatan, waktu, sumber kas,
-- pencatat. Tulis/baca operasional saja (authenticated).
-- Jalankan SETELAH 0002. Idempoten.

create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid not null references outlets(id) on delete restrict,
  amount_idr bigint not null check (amount_idr > 0),
  category text not null,
  note text,
  spent_at timestamptz not null default now(),
  source text not null default 'kas',
  created_by uuid,
  created_at timestamptz not null default now()
);
create index if not exists expenses_outlet_time_idx
  on expenses (outlet_id, spent_at desc);

alter table expenses enable row level security;

drop policy if exists "authenticated manage expenses" on expenses;
create policy "authenticated manage expenses" on expenses
  for all to authenticated using (true) with check (true);
