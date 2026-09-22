import PageHeader from '../../components/admin/PageHeader.jsx';
import EmptyState from '../../components/admin/EmptyState.jsx';
import { IconPlus, IconStock } from '../../components/admin/icons.jsx';

// PROPOSED: stok mengikuti data resmi outlet setelah terhubung.
// Konvensi terverifikasi: tanpa angka contoh — lihat Dashboard/Orders/Kitchen.
export default function Stock() {
  return (
    <>
      <PageHeader
        eyebrow="Manajemen stok"
        title="Stok"
        actions={
          <button type="button" className="btn-primary"><IconPlus size={17} /> Atur stok</button>
        }
      />

      <div className="admin-body">
        <section className="panel">
          <div className="panel-head">
            <h3>Stok produk saleable</h3>
            <span className="panel-meta">Per outlet Parangtritis</span>
          </div>
          <EmptyState
            icon={<IconStock size={26} />}
            title="Belum ada data stok"
            desc="Stok produk, batas minimum, dan riwayat perubahan tercatat setelah outlet terhubung."
          />
        </section>
      </div>
    </>
  );
}
