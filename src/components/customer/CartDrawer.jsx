import { useState } from 'react';
import { useCart, formatIDR } from '../../lib/cart.jsx';
import { useAuth } from '../../lib/auth.jsx';
import { useSettings } from '../../lib/settings.jsx';
import { ORDER_TYPES, validateCustomer, createOrder } from '../../lib/orders.js';
import { IconClose, IconBag, IconArrowRight } from './icons.jsx';

const PAYMENTS = [
  ['cash', 'Tunai di tempat'],
  ['manual_qris', 'QRIS (tunjukkan bukti ke kasir)'],
];

export default function CartDrawer() {
  const { items, setQty, remove, clear, count, total, open, setOpen } = useCart();
  const { user, signInWithGoogle } = useAuth();
  const { settings } = useSettings();
  const [step, setStep] = useState('cart');
  const [type, setType] = useState('takeaway');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [payment, setPayment] = useState('cash');
  const [formError, setFormError] = useState('');
  const [sending, setSending] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const channels = ORDER_TYPES.filter(([key]) => settings[key] !== 'false');
  const activeType = channels.some(([key]) => key === type) ? type : (channels[0] ? channels[0][0] : 'takeaway');

  const close = () => {
    setOpen(false);
    setTimeout(() => {
      setStep('cart');
      setFormError('');
    }, 300);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const invalid = validateCustomer({ name, phone, address, type: activeType });
    if (invalid) {
      setFormError(invalid);
      return;
    }
    setSending(true);
    const result = await createOrder({
      customer: { name, phone, address },
      type: activeType,
      items: items.map((i) => ({ id: i.id, name: i.name, qty: i.qty })),
      paymentMethod: payment,
      notes,
    });
    setSending(false);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    setReceipt(result);
    setStep('done');
    clear();
  };

  return (
    <>
      <div
        className={`cart-scrim${open ? ' is-visible' : ''}`}
        onClick={close}
        aria-hidden="true"
      />
      <aside
        className={`cart-drawer${open ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Keranjang belanja"
        aria-hidden={!open}
      >
        <div className="cart-head">
          <h2><IconBag size={20} /> {step === 'checkout' ? 'Checkout' : step === 'done' ? 'Pesanan dibuat' : `Keranjang (${count})`}</h2>
          <button type="button" className="cart-close" onClick={close}>
            <IconClose size={20} />
            <span className="visually-hidden">Tutup keranjang</span>
          </button>
        </div>

        {step === 'done' && receipt ? (          <div className="cart-empty">
            <p><strong>Pesanan diterima!</strong></p>
            <p className="receipt-number">{receipt.order_number}</p>
            <p>Simpan nomor ini untuk melacak pesanan. Total {formatIDR(receipt.total)} — bayar {payment === 'cash' ? 'tunai di tempat' : 'via QRIS ke kasir'}.</p>
            <button type="button" className="btn-gold" onClick={close}>Selesai</button>
          </div>
        ) : step === 'checkout' && !user ? (
          <div className="cart-empty">
            <p><strong>Masuk dulu yuk.</strong></p>
            <p>Checkout butuh akun agar pesanan tercatat dan anti fiktif. Keranjang Anda aman tersimpan.</p>
            <button
              type="button"
              className="btn-gold"
              disabled={sending}
              onClick={async () => {
                setSending(true);
                const res = await signInWithGoogle();
                setSending(false);
                if (!res.ok) setFormError(`${res.error} Minta admin mengaktifkan Google di dashboard Supabase.`);
              }}
            >
              {sending ? 'Membuka Google...' : 'Masuk dengan Google'}
            </button>
            {formError && <p className="form-error" role="alert">{formError}</p>}
            <button type="button" className="cart-clear" onClick={() => setStep('cart')}>
              Kembali ke keranjang
            </button>
          </div>
        ) : step === 'checkout' ? (
          <form className="checkout-form" onSubmit={onSubmit}>
            <div className="checkout-group">
              <span>Cara menikmati</span>
              <div className="chip-row" style={{ marginBottom: 0 }}>
                {channels.map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className={`chip${activeType === key ? ' is-active' : ''}`}
                    onClick={() => setType(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <label className="checkout-field">
              <span>Nama lengkap *</span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Anda" maxLength={60} />
            </label>
            <label className="checkout-field">
              <span>No. HP / WA *</span>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08..." maxLength={15} />
            </label>
            {activeType === 'delivery' && (
              <label className="checkout-field">
                <span>Alamat pengantaran *</span>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Jalan, nomor, patokan" maxLength={160} />
              </label>
            )}
            <label className="checkout-field">
              <span>Catatan (opsional)</span>
              <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="cth: es sedikit" maxLength={200} />
            </label>
            <div className="checkout-group">
              <span>Pembayaran</span>
              {PAYMENTS.map(([key, label]) => (
                <label className="pay-option" key={key}>
                  <input type="radio" name="payment" checked={payment === key} onChange={() => setPayment(key)} />
                  {label}
                </label>
              ))}
            </div>
            {formError && <p className="form-error" role="alert">{formError}</p>}
            <div className="cart-foot">
              <div className="cart-total">
                <span>Total bayar</span>
                <strong>{formatIDR(total)}</strong>
              </div>
              <button type="submit" className="btn-gold cart-checkout" disabled={sending}>
                {sending ? 'Mengirim...' : (<>Buat pesanan <IconArrowRight size={16} /></>)}
              </button>
              <button type="button" className="cart-clear" onClick={() => setStep('cart')}>
                Kembali ke keranjang
              </button>
            </div>
          </form>
        ) : items.length === 0 ? (
          <div className="cart-empty">
            <p><strong>Keranjang masih kosong.</strong></p>
            <p>Jelajahi menu dan tekan Tambah pada pilihan favoritmu.</p>
            <a href="#menu" className="btn-gold" onClick={() => setOpen(false)}>Lihat menu</a>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {items.map((item) => (
                <li className="cart-item" key={item.id}>
                  <div className="cart-item-info">
                    <strong>{item.name}</strong>
                    <span>{formatIDR(item.price)}</span>
                  </div>
                  <div className="cart-item-actions">
                    <button
                      type="button"
                      className="qty-btn"
                      aria-label={`Kurangi ${item.name}`}
                      onClick={() => setQty(item.id, item.qty - 1)}
                    >
                      −
                    </button>
                    <span className="qty-value" aria-label={`Jumlah ${item.name}`}>{item.qty}</span>
                    <button
                      type="button"
                      className="qty-btn"
                      aria-label={`Tambah ${item.name}`}
                      onClick={() => setQty(item.id, item.qty + 1)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="cart-remove"
                      aria-label={`Hapus ${item.name} dari keranjang`}
                      onClick={() => remove(item.id)}
                    >
                      Hapus
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-foot">
              <div className="cart-total">
                <span>Estimasi total</span>
                <strong>{formatIDR(total)}</strong>
              </div>
              <p className="cart-note">Harga mengikuti data outlet; total resmi dihitung ulang saat checkout.</p>
              <button type="button" className="btn-gold cart-checkout" onClick={() => { setFormError(''); setStep('checkout'); }}>
                Lanjut checkout
              </button>
              <button type="button" className="cart-clear" onClick={clear}>
                Kosongkan keranjang
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
