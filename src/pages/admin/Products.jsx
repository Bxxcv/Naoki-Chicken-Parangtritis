import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PageHeader from '../../components/admin/PageHeader.jsx';
import EmptyState from '../../components/admin/EmptyState.jsx';
import { useProducts, isEmpty, isLow, CATEGORIES } from '../../lib/products.jsx';
import { IconPlus, IconSearch, IconBox } from '../../components/admin/icons.jsx';
import { IconDrumstick, IconBag, IconCup } from '../../components/customer/icons.jsx';

const EMPTY_FORM = { id: '', name: '', category: 'Ayam', price: '', stock: '', low: '20', desc: '', image: '' };

// Tampil "15.000", simpan "15000" (digit saja, tanpa titik).
function formatRibuan(value) {
  if (value === '' || value == null) return '';
  return new Intl.NumberFormat('id-ID').format(Number(value) || 0);
}

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(price) || 0);
}

export default function Products() {
  const { products, categories, status, error, reload, save, remove, renameCategory, deleteCategory, configured } = useProducts();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Semua');
  const [editingCatId, setEditingCatId] = useState('');
  const [editingCatName, setEditingCatName] = useState('');
  const [catError, setCatError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const filtered = products.filter((p) => {
    const matchSearch = `${p.name} ${p.category}`.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'Semua' || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const catCounts = {};
  products.forEach((p) => { catCounts[p.category] = (catCounts[p.category] || 0) + 1; });

  const knownCategories = [...new Set([...CATEGORIES, ...products.map((p) => p.category)])];

  // Tutup popup dengan tombol Escape.
  useEffect(() => {
    if (!formOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setFormOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [formOpen]);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setPhotoFile(null);
    setPhotoPreview('');
    setFormError('');
    setFormOpen(true);
  };

  const openEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      low: String(product.lowAt || 20),
      desc: product.desc || '',
      image: product.image || '',
    });
    setPhotoFile(null);
    setPhotoPreview('');
    setFormError('');
    setFormOpen(true);
  };

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const onPrice = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 12);
    setForm((prev) => ({ ...prev, price: digits }));
  };

  const onPhoto = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFormError('File harus gambar (JPG/PNG).');
      return;
    }
    if (file.size > 1500000) {
      setFormError('Foto maksimal 1,5 MB — kecilkan dulu agar tersimpan.');
      return;
    }
    setFormError('');
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormError('Nama produk wajib diisi.');
      return;
    }
    if (!Number(form.price) || Number(form.price) <= 0) {
      setFormError('Harga harus angka lebih dari 0.');
      return;
    }
    setSaving(true);
    const result = await save(
      {
        id: form.id || undefined,
        name: form.name.trim(),
        category: form.category,
      price: Math.round(Number(form.price)),
      stock: Math.max(0, Math.round(Number(form.stock) || 0)),
      lowAt: Math.max(0, Math.round(Number(form.low) || 20)),
        desc: form.desc.trim(),
        image: form.image,
      },
      photoFile,
    );
    setSaving(false);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    setFormOpen(false);
    setForm(EMPTY_FORM);
    setPhotoFile(null);
    setPhotoPreview('');
  };

  const onDelete = async (product) => {
    if (!window.confirm(`Hapus "${product.name}" dari katalog?`)) return;
    const result = await remove(product.id);
    if (!result.ok) window.alert(result.error);
  };

  const startRenameCat = (cat) => {
    setEditingCatId(cat.id);
    setEditingCatName(cat.name);
    setCatError('');
  };

  const submitRenameCat = async (cat) => {
    const result = await renameCategory(cat.id, editingCatName);
    if (!result.ok) {
      setCatError(result.error);
      return;
    }
    setEditingCatId('');
    setEditingCatName('');
    if (catFilter === cat.name) setCatFilter(editingCatName.trim());
  };

  const onDeleteCat = async (cat) => {
    if (cat.count > 0) {
      setCatError(`"${cat.name}" berisi ${cat.count} produk — pindahkan/hapus dulu.`);
      return;
    }
    if (!window.confirm(`Hapus kategori "${cat.name}"?`)) return;
    const result = await deleteCategory(cat.id);
    if (!result.ok) {
      setCatError(result.error);
      return;
    }
    if (catFilter === cat.name) setCatFilter('Semua');
  };

  const catIcon = (name) => {
    const lower = (name || '').toLowerCase();
    if (lower.includes('ayam')) return IconDrumstick;
    if (lower.includes('paket')) return IconBag;
    if (lower.includes('minum')) return IconCup;
    return IconBag;
  };

  return (
    <>
      <PageHeader
        eyebrow="Manajemen produk"
        title="Produk"
        actions={
          <button type="button" className="btn-primary" onClick={openAdd} disabled={!configured}>
            <IconPlus size={17} /> Tambah produk
          </button>
        }
      />

      <div className="admin-body">
        {!configured && (
          <section className="panel">
            <EmptyState
              icon={<IconBox size={26} />}
              title="Backend belum terhubung"
              desc="Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di Vercel, jalankan migrasi 0002, lalu muat ulang. Tanpa backend, halaman ini sengaja kosong."
            />
          </section>
        )}

        {configured && status === 'error' && (
          <section className="panel">
            <EmptyState
              icon={<IconBox size={26} />}
              title="Produk tidak dapat dimuat"
              desc={error || 'Periksa koneksi dan migrasi database.'}
            />
            <div className="form-actions">
              <button type="button" className="btn-outline" onClick={reload}>Coba lagi</button>
            </div>
          </section>
        )}

        {configured && status === 'ready' && (
          <section className="panel">
            <div className="panel-head">
              <h3>Kelola kategori</h3>
              <span className="panel-meta">{categories.length} kategori</span>
            </div>
            {categories.length === 0 ? (
              <EmptyState
                icon={<IconBox size={26} />}
                title="Belum ada kategori"
                desc="Kategori terbentuk otomatis saat produk pertama disimpan."
              />
            ) : (
              <div className="cat-manage-grid">
                {categories.map((cat) => {
                  const Icon = catIcon(cat.name);
                  const editing = editingCatId === cat.id;
                  return (
                    <article className={`cat-manage-card cat-manage-card--${cat.tone}`} key={cat.id}>
                      <div className="cat-manage-top">
                        <Icon size={26} />
                        <span className="cat-manage-count">{cat.count}<small>menu</small></span>
                      </div>
                      {editing ? (
                        <input
                          type="text"
                          className="cat-manage-input"
                          value={editingCatName}
                          maxLength={30}
                          onChange={(e) => setEditingCatName(e.target.value)}
                          aria-label="Nama kategori baru"
                        />
                      ) : (
                        <h4>{cat.name}</h4>
                      )}
                      <div className="cat-manage-actions">
                        {editing ? (
                          <>
                            <button type="button" className="btn-primary btn-sm" onClick={() => submitRenameCat(cat)}>Simpan</button>
                            <button type="button" className="btn-outline btn-sm" onClick={() => setEditingCatId('')}>Batal</button>
                          </>
                        ) : (
                          <>
                            <button type="button" className="btn-outline btn-sm" onClick={() => startRenameCat(cat)}>Ubah</button>
                            <button type="button" className="btn-outline btn-sm btn-danger" onClick={() => onDeleteCat(cat)}>Hapus</button>
                          </>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
            {catError && <p className="form-error" role="alert">{catError}</p>}
          </section>
        )}

        {formOpen && configured && createPortal(
          <div
            className="modal-scrim"
            onClick={(e) => { if (e.target === e.currentTarget) setFormOpen(false); }}
          >
          <section className="admin-modal" role="dialog" aria-modal="true" aria-label={form.id ? 'Ubah produk' : 'Produk baru'}>
            <div className="panel-head">
              <div>
                <h3>{form.id ? 'Ubah produk' : 'Produk baru'}</h3>
                <span className="panel-meta">Tersimpan ke database + landing</span>
              </div>
              <button type="button" className="cart-close" onClick={() => setFormOpen(false)} aria-label="Tutup formulir">
                ×
              </button>
            </div>
            <form onSubmit={onSubmit}>
              <div className="form-grid">
                <label className="form-field">
                  <span>Nama produk *</span>
                  <input type="text" value={form.name} onChange={set('name')} placeholder="cth: Ayam Goreng Original" maxLength={60} />
                </label>
                <label className="form-field">
                  <span>Kategori (bisa baru)</span>
                  <input
                    type="text"
                    list="kategori-list"
                    value={form.category}
                    onChange={set('category')}
                    placeholder="cth: Ayam"
                    maxLength={30}
                  />
                  <datalist id="kategori-list">
                    {knownCategories.map((c) => <option key={c} value={c} />)}
                  </datalist>
                </label>
                <label className="form-field">
                  <span>Harga (Rp) *</span>
                  <div className="input-rp">
                    <span aria-hidden="true">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formatRibuan(form.price)}
                      onChange={onPrice}
                      placeholder="15.000"
                    />
                  </div>
                </label>
                <label className="form-field">
                  <span>Stok (porsi)</span>
                  <input type="number" min="0" step="1" value={form.stock} onChange={set('stock')} placeholder="50" />
                </label>
                <label className="form-field">
                  <span>Batas menipis</span>
                  <input type="number" min="0" step="1" value={form.low} onChange={set('low')} placeholder="20" />
                </label>
                <label className="form-field form-field--full">
                  <span>Deskripsi</span>
                  <input type="text" value={form.desc} onChange={set('desc')} placeholder="Deskripsi singkat untuk pelanggan" maxLength={120} />
                </label>
                <div className="form-field form-field--full">
                  <span>Foto</span>
                  <div className="photo-row">
                    <div className="photo-preview" aria-hidden="true">
                      {(photoPreview || form.image)
                        ? <img src={photoPreview || form.image} alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        : <IconBox size={22} />}
                    </div>
                    <label className="btn-outline btn-sm photo-pick">
                      Pilih foto
                      <input type="file" accept="image/*" onChange={onPhoto} hidden />
                    </label>
                  </div>
                  <small className="field-hint">JPG/PNG maks 1,5 MB, diupload ke Storage saat disimpan.</small>
                </div>
              </div>
              {formError && <p className="form-error" role="alert">{formError}</p>}
              <div className="form-actions">
                <button type="button" className="btn-outline" onClick={() => setFormOpen(false)} disabled={saving}>Batal</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Menyimpan...' : 'Simpan produk'}
                </button>
              </div>
            </form>
          </section>
          </div>,
          document.body,
        )}

        {configured && status !== 'error' && (
          <section className="panel">
            <div className="filter-bar">
              <label className="search-field">
                <IconSearch size={17} />
                <input type="search" placeholder="Cari nama produk..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <span className="visually-hidden">Cari produk</span>
              </label>
            </div>
            <div className="chip-row" role="tablist" aria-label="Filter kategori produk">
              {['Semua', ...Object.keys(catCounts).sort()].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={catFilter === cat}
                  className={`chip${catFilter === cat ? ' is-active' : ''}`}
                  onClick={() => setCatFilter(cat)}
                >
                  {cat}{cat !== 'Semua' ? ` (${catCounts[cat]})` : ''}
                </button>
              ))}
            </div>

            {status === 'loading' ? (
              <EmptyState
                icon={<IconBox size={26} />}
                title="Memuat produk..."
                desc="Mengambil data terbaru dari database."
              />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={<IconBox size={26} />}
                title="Belum ada produk"
                desc="Tambah produk pertama — langsung tampil di landing."
              />
            ) : (
              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Produk</th>
                      <th>Harga</th>
                      <th>Stok</th>
                      <th>Status</th>
                      <th style={{ width: 130 }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                  {filtered.map((p) => {
                    const empty = isEmpty(p);
                    const low = isLow(p);
                    return (
                      <tr key={p.id} className={empty ? 'row-danger' : low ? 'row-warning' : ''}>
                          <td>
                            <div className="product-cell">
                              <div className="product-image">
                                {p.image
                                  ? <img src={p.image} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                  : <IconBox size={20} />}
                              </div>
                              <span><strong>{p.name}</strong><br /><small>{p.category}</small></span>
                            </div>
                          </td>
                          <td className="num">{formatPrice(p.price)}</td>
                          <td className="num">{p.stock}</td>
                          <td>
                            {empty
                              ? <span className="status-badge badge-danger">Habis</span>
                              : low
                                ? <span className="status-badge badge-warning">Menipis</span>
                                : <span className="status-badge badge-success">Tersedia</span>}
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button type="button" className="btn-outline btn-sm" onClick={() => openEdit(p)}>Ubah</button>
                              <button type="button" className="btn-outline btn-sm btn-danger" onClick={() => onDelete(p)}>Hapus</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        <p className="panel-desc">Stok 0 = otomatis berlabel <strong>Habis</strong> dan abu-abu di landing.</p>
      </div>
    </>
  );
}
