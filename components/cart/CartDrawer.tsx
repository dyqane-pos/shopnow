'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { fmt } from '@/lib/utils'
import { useToast } from '@/hooks/useToast'
import CheckoutModal from './CheckoutModal'

export default function CartDrawer() {
  const { items, removeItem, updateQty, cartTotal, clearCart } = useCart()
  const { showToast } = useToast()
  const [showCheckout, setShowCheckout] = useState(false)

  if (items.length === 0) {
    return (
      <div className="cart-page-ay">
        <h1 className="admin-h1-ay">Shporta</h1>
        <div className="empty-ay">
          <h3>Shporta është bosh</h3>
          <p style={{ marginBottom: '1rem' }}>Shto produkte për të vazhduar.</p>
          <Link href="/" className="add-btn-ay" style={{ display: 'inline-block', width: 'auto', padding: '12px 24px' }}>
            Shko te dyqani
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page-ay">
      <h1 className="admin-h1-ay">Shporta ({items.length})</h1>

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
            {item.size && <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>Madhësia: {item.size}</div>}

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
              Hiq
            </button>
          </div>
        </div>
      ))}

      <div className="cart-total-ay">
        Total: {fmt(cartTotal)}
      </div>

      <button className="checkout-btn-ay" onClick={() => setShowCheckout(true)}>
        Vazhdo me blerjen
      </button>

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
