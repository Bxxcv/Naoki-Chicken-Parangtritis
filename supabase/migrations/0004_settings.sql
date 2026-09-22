-- 0004_settings.sql — DRAFT ONLY. NOT EXECUTED.
-- Pengaturan outlet (info, jam/hari buka, kanal, status paksa) sebagai
-- key-value per outlet. Baca publik (landing butuh status buka),
-- tulis authenticated (lihat docs/ROLES-PERMISSIONS.md).
-- Jalankan manual di SQL Editor SETELAH 0002 + 0003. Idempoten.

create table if not exists settings (
  outlet_id uuid not null references outlets(id) on delete cascade,
  key text not null,
  value text not null default '',
  updated_at timestamptz not null default now(),
  primary key (outlet_id, key)
);

drop trigger if exists settings_updated_at on settings;
create trigger settings_updated_at
  before update on settings
  for each row execute function set_updated_at();

alter table settings enable row level security;

drop policy if exists "public read settings" on settings;
create policy "public read settings" on settings
  for select using (true);

drop policy if exists "authenticated manage settings" on settings;
create policy "authenticated manage settings" on settings
  for all to authenticated using (true) with check (true);
