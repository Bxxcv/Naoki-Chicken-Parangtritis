// Mock menu data for Naoki Chicken Parangtritis.
// PROPOSED data — not connected to Supabase yet. Replace with real fetch when backend is wired.

export const categories = [
  { id: 'all', label: 'Semua', icon: 'grid' },
  { id: 'fried', label: 'Ayam Goreng', icon: 'drumstick' },
  { id: 'combo', label: 'Paket Nasi', icon: 'rice' },
  { id: 'sides', label: 'Sides', icon: 'fries' },
  { id: 'drinks', label: 'Minuman', icon: 'drink' },
  { id: 'spicy', label: 'Pedas', icon: 'spicy' },
];

export const products = [
  {
    id: 1,
    name: 'Ayam Goreng Klasik',
    desc: 'Ayam goreng resep rahasia Naoki — renyah di luar, juicy di dalam.',
    price: 15000,
    category: 'fried',
    rating: 4.9,
    sold: 320,
    badge: 'Best Seller',
    icon: 'drumstick',
  },
  {
    id: 2,
    name: 'Ayam Goreng Pedas',
    desc: 'Ayam goreng dengan bumbu pedas khas Parangtritis.',
    price: 17000,
    category: 'spicy',
    rating: 4.8,
    sold: 210,
    badge: null,
    icon: 'spicy',
  },
  {
    id: 3,
    name: 'Paket Nasi Ayam',
    desc: 'Nasi hangat + ayam goreng + sambal + lalapan segar.',
    price: 25000,
    category: 'combo',
    rating: 4.9,
    sold: 180,
    badge: 'Hemat',
    icon: 'rice',
  },
  {
    id: 4,
    name: 'Bucket Ayam 6 pcs',
    desc: 'Enam potong ayam goreng untuk berbagi bersama keluarga.',
    price: 75000,
    category: 'fried',
    rating: 5.0,
    sold: 95,
    badge: 'Family',
    icon: 'bucket',
  },
  {
    id: 5,
    name: 'French Fries',
    desc: 'Kentang goreng renyah dengan taburan bumbu pilihan.',
    price: 12000,
    category: 'sides',
    rating: 4.7,
    sold: 150,
    badge: null,
    icon: 'fries',
  },
  {
    id: 6,
    name: 'Es Teh Manis',
    desc: 'Teh manis dingin segar menemani ayam gorengmu.',
    price: 5000,
    category: 'drinks',
    rating: 4.6,
    sold: 240,
    badge: null,
    icon: 'drink',
  },
];

export function formatIDR(n) {
  return `Rp${n.toLocaleString('id-ID')}`;
}
