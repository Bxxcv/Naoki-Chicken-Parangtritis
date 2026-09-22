import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from './supabase.js';

// SATU sumber data produk: database Supabase. Diedit di Admin > Produk,
// otomatis tampil di landing. localStorage produk DIHAPUS (termasuk sisa
// sesi lama) — kebenaran ada di database, bukan browser.
//
// Status:
//   'unconfigured' = env belum diisi (jujur kosong, tanpa data palsu)
//   'loading' | 'ready' | 'error'

const OUTLET_SLUG = 'parangtritis';
const LEGACY_KEY = 'naoki-products-v1';

export const CATEGORIES = ['Ayam', 'Paket', 'Minuman'];

// Habis ⟺ disembunyikan outlet ATAU stok 0/kurang.
export function isEmpty(product) {
  if (!product) return true;
  if (product.is_available === false) return true;
  return (Number(product.stock) || 0) <= 0;
}

function toUI(row) {
  return {
    id: row.id,
    name: row.name,
    desc: row.description || '',
    price: Number(row.price_idr) || 0,
    category: (row.categories && row.categories.name) || 'Ayam',
    image: row.image_url || '',
    stock: Number(row.stock_qty) || 0,
    is_available: row.is_available !== false,
  };
}

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState(isSupabaseConfigured ? 'loading' : 'unconfigured');
  const [error, setError] = useState('');

  // Bersihkan sisa sesi localStorage lama (satu kali).
  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_KEY);
    } catch {
      // Abaikan: bukan data penting.
    }
  }, []);

  const reload = useCallback(async () => {
    if (!supabase) {
      setStatus('unconfigured');
      setProducts([]);
      return;
    }
    setStatus('loading');
    setError('');
    const { data: outlet, error: outletError } = await supabase
      .from('outlets')
      .select('id')
      .eq('slug', OUTLET_SLUG)
      .maybeSingle();

    if (outletError || !outlet) {
      setStatus('error');
      setError('Outlet parangtritis belum ada — jalankan migrasi 0002 di Supabase.');
      setProducts([]);
      return;
    }

    const { data, error: listError } = await supabase
      .from('products')
      .select('id,name,description,image_url,price_idr,stock_qty,is_available,categories(name)')
      .eq('outlet_id', outlet.id)
      .order('name', { ascending: true });

    if (listError) {
      setStatus('error');
      setError(`Gagal memuat produk: ${listError.message}`);
      setProducts([]);
      return;
    }

    setProducts((data || []).map(toUI));
    setStatus('ready');
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const uploadPhoto = useCallback(async (file) => {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().slice(0, 4);
    const path = `products/${OUTLET_SLUG}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) throw new Error(uploadError.message);
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    return data.publicUrl;
  }, []);

  const categoryId = useCallback(async (outletId, name) => {
    const { data, error: findError } = await supabase
      .from('categories')
      .select('id')
      .eq('outlet_id', outletId)
      .eq('name', name)
      .maybeSingle();
    if (findError) throw new Error(findError.message);
    if (data) return data.id;
    const { data: created, error: createError } = await supabase
      .from('categories')
      .insert({ outlet_id: outletId, name })
      .select('id')
      .single();
    if (createError) throw new Error(createError.message);
    return created.id;
  }, []);

  const outletId = useCallback(async () => {
    const { data, error: outletError } = await supabase
      .from('outlets')
      .select('id')
      .eq('slug', OUTLET_SLUG)
      .single();
    if (outletError || !data) throw new Error('Outlet parangtritis belum ada — jalankan migrasi 0002.');
    return data.id;
  }, []);

  // save(product, photoFile?) — photoFile diupload ke Storage saat simpan.
  const save = useCallback(async (product, photoFile) => {
    if (!supabase) return { ok: false, error: 'Backend belum terhubung.' };
    try {
      const oid = await outletId();
      const cid = await categoryId(oid, product.category);
      let imageUrl = product.image || '';
      if (photoFile) imageUrl = await uploadPhoto(photoFile);

      const payload = {
        outlet_id: oid,
        category_id: cid,
        name: product.name,
        description: product.desc || '',
        image_url: imageUrl,
        price_idr: Math.round(Number(product.price)),
        stock_mode: 'finite',
        stock_qty: Math.max(0, Math.round(Number(product.stock) || 0)),
        is_available: true,
      };

      if (product.id) {
        const { error: updateError } = await supabase
          .from('products')
          .update(payload)
          .eq('id', product.id);
        if (updateError) throw new Error(updateError.message);
      } else {
        const { error: insertError } = await supabase.from('products').insert(payload);
        if (insertError) throw new Error(insertError.message);
      }
      await reload();
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message || 'Gagal menyimpan produk.' };
    }
  }, [categoryId, outletId, reload, uploadPhoto]);

  const remove = useCallback(async (id) => {
    if (!supabase) return { ok: false, error: 'Backend belum terhubung.' };
    const { error: deleteError } = await supabase.from('products').delete().eq('id', id);
    if (deleteError) return { ok: false, error: deleteError.message };
    await reload();
    return { ok: true };
  }, [reload]);

  const value = useMemo(
    () => ({ products, status, error, reload, save, remove, configured: isSupabaseConfigured }),
    [products, status, error, reload, save, remove],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts harus dipakai di dalam ProductsProvider');
  return ctx;
}
