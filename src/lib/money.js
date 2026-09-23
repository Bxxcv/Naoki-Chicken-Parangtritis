// Format Rupiah untuk input: tampil "15.000", simpan digit "15000".
export function formatRibuan(value) {
  if (value === '' || value == null) return '';
  return new Intl.NumberFormat('id-ID').format(Number(value) || 0);
}

export function parseRupiah(text) {
  return Number(String(text || '').replace(/\D/g, '').slice(0, 13)) || 0;
}
