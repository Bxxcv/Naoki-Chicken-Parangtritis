// Pemetaan nama kategori bebas → kunci artwork. Urutan penting:
// kata kunci spesifik (tea, milo, ...) dicek SEBELUM kata umum
// (paket, ayam) agar "Paket Super Hemat Tea" jadi tea, bukan paket.
export function categoryKey(name) {
  const lower = (name || '').toLowerCase();
  if (/(tea|teh)/.test(lower)) return 'tea';
  if (/(milo|cokelat|coklat)/.test(lower)) return 'milo';
  if (/shake/.test(lower)) return 'milkshake';
  if (/(cafe|kafe|meal)/.test(lower)) return 'cafe';
  if (/(hot|plate)/.test(lower)) return 'hotplate';
  if (/(rice|ricebox|nasi|box)/.test(lower)) return 'ricebox';
  if (/(extra|topping|tambah)/.test(lower)) return 'extra';
  if (/ayam/.test(lower)) return 'ayam';
  if (/paket/.test(lower)) return 'paket';
  if (/(minum|drink|jus|kopi|susu)/.test(lower)) return 'minum';
  return 'paket';
}
