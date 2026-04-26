'use client'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import type { Product } from '@/lib/types'
import { fmt, fmtLek, disc } from '@/lib/utils'
import { useWishlist } from '@/hooks/useWishlist'
import { useCategoriesContext } from '@/context/CategoriesContext'

export default function ProductCard({ product, view = 'grid' }: { product: Product; view?: 'grid' | 'list' }) {
  const router = useRouter()
  const params = useSearchParams()
  const [, startTransition] = useTransition()
  const { isWished, toggle } = useWishlist(product.id)
  const { eurToAll } = useCategoriesContext()

  const openModal = () => {
    const next = new URLSearchParams(params.toString())
    next.set('modal', String(product.id))
    startTransition(() => router.push(`?${next.toString()}`, { scroll: false }))
  }

  const sizes = product.sizes ?? []
  const hasSale = product.old_price != null && product.old_price > product.price

  const WishBtn = (
    <button
      className={`wish-btn-ay${isWished ? ' active' : ''}`}
      onClick={e => { e.stopPropagation(); toggle() }}
      title="Shto në wishlist"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.8">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    </button>
  )

  if (view === 'list') {
    return (
      <div className="card-list-ay" onClick={openModal}>
        <div className="card-list-img-ay" style={{ position: 'relative' }}>
          {product.photo_url ? (
            <Image src={product.photo_url} alt={product.name} fill sizes="110px" style={{ objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#f0f0ee' }} />
          )}
          {hasSale && <span className="discount-badge-ay">{disc(product.price, product.old_price!)}</span>}
        </div>

        <div className="card-list-info-ay">
          <div className="card-brand-ay">{product.brand}</div>
          <div className="card-name-ay">{product.name}</div>
          {sizes.length > 0 && (
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
              {sizes.slice(0, 8).map(s => (
                <span key={s} className="hsize-ay" onClick={e => e.stopPropagation()}>{s}</span>
              ))}
            </div>
          )}
        </div>

        <div className="card-list-price-ay">
          <span className={`price-new-ay${hasSale ? ' sale' : ''}`}>{fmt(product.price)}</span>
          {hasSale && <span className="price-old-ay">{fmt(product.old_price!)}</span>}
          <span className="price-lek-ay">{fmtLek(product.price, eurToAll)}</span>
        </div>

        <div style={{ position: 'relative', marginLeft: '8px' }}>
          {WishBtn}
        </div>
      </div>
    )
  }

  return (
    <div className="card-ay" onClick={openModal}>
      <div className="card-img-ay">
        {product.photo_url ? (
          <Image src={product.photo_url} alt={product.name} fill sizes="25vw" style={{ objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#f0f0ee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '11px' }}>
            Pa foto
          </div>
        )}

        {hasSale && (
          <span className="discount-badge-ay">{disc(product.price, product.old_price!)}</span>
        )}

        {WishBtn}

        {sizes.length > 0 && (
          <div className="hsizes-ay">
            {sizes.slice(0, 6).map(s => (
              <span key={s} className="hsize-ay" onClick={e => e.stopPropagation()}>{s}</span>
            ))}
          </div>
        )}
      </div>

      <div className="card-info-ay">
        <div className="card-brand-ay">{product.brand}</div>
        <div className="card-name-ay">{product.name}</div>
        <div className="card-price-ay">
          <span className={`price-new-ay${hasSale ? ' sale' : ''}`}>{fmt(product.price)}</span>
          {hasSale && <span className="price-old-ay">{fmt(product.old_price!)}</span>}
          <span className="price-lek-ay">{fmtLek(product.price, eurToAll)}</span>
        </div>
      </div>
    </div>
  )
}
