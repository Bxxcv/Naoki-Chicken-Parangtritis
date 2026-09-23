-- 0007_payments_proof_realtime.sql — DRAFT ONLY. NOT EXECUTED.
-- 1. Bukti bayar QRIS: kolom proof_url + bucket privat payment-proofs.
--    Upload oleh akun login; baca oleh akun login (kasir/admin).
-- 2. Realtime: perubahan tabel orders disiarkan agar status di
--    Riwayat pelanggan update otomatis. Jalankan SETELAH 0005/0006.

alter table payments
  add column if not exists proof_url text;

insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', false)
on conflict (id) do nothing;

-- Catatan: JANGAN alter table storage.objects (milik sistem, error
-- 42501). RLS-nya sudah aktif bawaan; policy di bawah mengikuti pola
-- resmi Supabase Storage dan boleh dibuat via SQL Editor.

drop policy if exists "authenticated upload payment proofs" on storage.objects;
create policy "authenticated upload payment proofs" on storage.objects
  for insert to authenticated with check (bucket_id = 'payment-proofs');

drop policy if exists "authenticated read payment proofs" on storage.objects;
create policy "authenticated read payment proofs" on storage.objects
  for select to authenticated using (bucket_id = 'payment-proofs');

-- Realtime untuk status pesanan (abaikan error bila publikasi
-- dibatasi di project Anda — tombol muat ulang tetap ada).
do $$
begin
  alter publication supabase_realtime add table public.orders;
exception when duplicate_object then
  null;
end $$;
