-- 0006_order_ownership.sql — DRAFT ONLY. NOT EXECUTED.
-- Tautkan pesanan ke akun login (Google) agar halaman Riwayat bisa
-- menampilkan "order milik sendiri". Tamu tanpa akun tetap bisa pesan
-- (user_id NULL) + lacak via nomor. Jalankan SETELAH 0005. Idempoten.

alter table orders
  add column if not exists user_id uuid references auth.users(id) on delete set null;
create index if not exists orders_user_idx on orders (user_id, created_at desc);

-- Baca milik sendiri (authenticated, baris user_id = dirinya).
drop policy if exists "own read orders" on orders;
create policy "own read orders" on orders
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "own read order_items" on order_items;
create policy "own read order_items" on order_items
  for select to authenticated using (
    exists (select 1 from orders o where o.id = order_items.order_id and o.user_id = auth.uid())
  );

drop policy if exists "own read order_status_history" on order_status_history;
create policy "own read order_status_history" on order_status_history
  for select to authenticated using (
    exists (select 1 from orders o where o.id = order_status_history.order_id and o.user_id = auth.uid())
  );

drop policy if exists "own read payments" on payments;
create policy "own read payments" on payments
  for select to authenticated using (
    exists (select 1 from orders o where o.id = payments.order_id and o.user_id = auth.uid())
  );
