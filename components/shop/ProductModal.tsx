'use client'
import Image from 'next/image'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition, useState } from 'react'
import type { Product } from '@/lib/types'
import { fmt, disc } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/hooks/useToast'

export default function ProductModal({ products }: { products: Product[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [, startTransition] = useTransition()
  const { addItem } = useCart()
  const { showToast } = useToast()

  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)

  const modalId = params.get('modal')
  const product = products.find(p => String(p.id) === modalId)

  if (!product) return null

  const close = () => {
    const next = new URLSearchParams(params.toString())
    next.delete('modal')
    const qs = next.toString()
    startTransition(() => router.push(`${pathname}${qs ? '?' + qs : ''}`, { scroll: false }))
  }

  const hasSale = product.old_price != null && product.old_price > product.price
  const sizes = product.sizes ?? []

  const handleAdd = () => {
    if (sizes.length > 0 && !selectedSize) {
      showToast('Zgjidh madhësinë', 'error')
      return
    }
    addItem(product, selectedSize ?? '', qty)
    showToast(`${product.name} u shtua në shportë`)
    close()
  }

  return (
    <div className="modal-overlay-ay" onClick={close}>
      <div className="modal-panel-ay" onClick={e => e.stopPropagation()}>
        <button className="modal-close-ay" onClick={close}>×</button>

        <div className="modal-img-ay" style={{ position: 'relative' }}>
          {product.photo_url ? (
            <Image src={product.photo_url} alt={product.name} fill sizes="480px" style={{ objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#f0f0ee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
              Pa foto
            </div>
          )}
        </div>

        <div className="modal-brand-ay">{product.brand}</div>
        <div className="modal-name-ay">{product.name}</div>

        <div className="modal-price-ay">
          <span className={`modal-price-new${hasSale ? ' sale' : ''}`}>{fmt(product.price)}</span>
          {hasSale && <span className="modal-price-old">{fmt(product.old_price!)}</span>}
          {hasSale && <span style={{ fontSize: '12px', background: '#e8002d', color: '#fff', padding: '2px 6px', borderRadius: '3px', fontWeight: 800 }}>{disc(product.price, product.old_price!)}</span>}
        </div>

        {sizes.length > 0 && (
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#888', marginBottom: '8px' }}>Madhësia</div>
            <div className="size-grid-ay">
              {sizes.map(s => (
                <button
                  key={s}
                  className={`size-btn-ay${selectedSize === s ? ' selected' : ''}`}
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#888', marginBottom: '8px' }}>Sasia</div>
          <div className="qty-row-ay">
            <button className="qty-btn-ay" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
            <span className="qty-val-ay">{qty}</span>
            <button className="qty-btn-ay" onClick={() => setQty(q => q + 1)}>+</button>
          </div>
        </div>

        <button className="add-btn-ay" onClick={handleAdd}>
          Shto në shportë · {fmt(product.price * qty)}
        </button>
      </div>
    </div>
  )
}
