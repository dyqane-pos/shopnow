'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { fmt } from '@/lib/utils'
import { useToast } from '@/hooks/useToast'
import { useLang } from '@/context/LanguageContext'
import { useAuth } from '@/hooks/useAuth'
import CheckoutModal from './CheckoutModal'

export default function CartDrawer() {
  const { items, removeItem, updateQty, cartTotal, clearCart } = useCart()
  const { showToast } = useToast()
  const { t } = useLang()
  const { user, loading } = useAuth()
  const [showCheckout, setShowCheckout] = useState(false)

  if (items.length === 0) {
    return (
      <div className="cart-page-ay">
        <h1 className="admin-h1-ay">{t('cartTitle')}</h1>
        <div className="empty-ay">
          <h3>{t('cartEmpty')}</h3>
          <p style={{ marginBottom: '1rem' }}>{t('cartEmptySub')}</p>
          <Link href="/" className="add-btn-ay" style={{ display: 'inline-block', width: 'auto', padding: '12px 24px' }}>
            {t('cartGoShop')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page-ay">
      <h1 className="admin-h1-ay">{t('cartTitle')} ({items.length})</h1>

      {items.map(item => (
        <div key={`${item.product_id}-${item.size}`} className="cart-item-ay">
          <div className="cart-item-img-ay" style={{ position: 'relative' }}>
            {item.photo_url ? (
              <Image src={item.photo_url} alt={item.name} fill sizes="90px" style={{ objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: '#f0f0ee' }} />
            )}
          </div>

          <div className="cart-item-info-ay">
            <div style={{ fontWeight: 700, marginBottom: '2px' }}>{item.brand}</div>
            <div style={{ color: '#555', marginBottom: '4px' }}>{item.name}</div>
            {item.size && <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>{t('cartSize')} {item.size}</div>}

            <div className="qty-row-ay" style={{ gap: '8px' }}>
              <button className="qty-btn-ay" onClick={() => updateQty(item.product_id, item.size, item.qty - 1)}>−</button>
              <span className="qty-val-ay">{item.qty}</span>
              <button className="qty-btn-ay" onClick={() => updateQty(item.product_id, item.size, item.qty + 1)}>+</button>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700, marginBottom: '8px' }}>{fmt(item.price * item.qty)}</div>
            <button
              onClick={() => removeItem(item.product_id, item.size)}
              style={{ fontSize: '11px', color: '#e8002d', fontWeight: 600 }}
            >
              {t('cartRemove')}
            </button>
          </div>
        </div>
      ))}

      <div className="cart-total-ay">
        {t('cartTotal')} {fmt(cartTotal)}
      </div>

      {!loading && !user ? (
        <Link href="/login" className="checkout-btn-ay" style={{ display: 'block', textAlign: 'center' }}>
          🔐 Hyr për të vazhduar me porosinë
        </Link>
      ) : (
        <button className="checkout-btn-ay" onClick={() => setShowCheckout(true)}>
          {t('cartCheckout')}
        </button>
      )}

      {showCheckout && (
        <CheckoutModal
          items={items}
          total={cartTotal}
          onClose={() => setShowCheckout(false)}
          onSuccess={() => { clearCart(); setShowCheckout(false) }}
          showToast={showToast}
        />
      )}
    </div>
  )
}
