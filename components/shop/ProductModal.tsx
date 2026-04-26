'use client'
import Image from 'next/image'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition, useState, useEffect } from 'react'
import type { Product } from '@/lib/types'
import { fmt, fmtLek, disc } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/hooks/useToast'
import { useLang } from '@/context/LanguageContext'
import { useProductPresence } from '@/hooks/useProductPresence'
import { useAuthContext } from '@/context/AuthContext'
import { incrementViews } from '@/actions/products'

function getPhotos(product: Product): string[] {
  if (product.photos?.length) return product.photos
  if (product.photo_url) return [product.photo_url]
  return []
}

export default function ProductModal({ products }: { products: Product[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [, startTransition] = useTransition()
  const { addItem } = useCart()
  const { showToast } = useToast()
  const { t } = useLang()
  const { isAdmin } = useAuthContext()

  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [activePhoto, setActivePhoto] = useState(0)
  const [openSection, setOpenSection] = useState<string | null>(null)

  const modalId = params.get('modal')
  const product = products.find(p => String(p.id) === modalId)

  useProductPresence(product?.id ?? null)

  useEffect(() => {
    if (!product || isAdmin) return
    const key = `viewed-${product.id}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')
    incrementViews(product.id)
  }, [product?.id, isAdmin])

  if (!product) return null

  const close = () => {
    const next = new URLSearchParams(params.toString())
    next.delete('modal')
    const qs = next.toString()
    startTransition(() => router.push(`${pathname}${qs ? '?' + qs : ''}`, { scroll: false }))
  }

  const photos = getPhotos(product)
  const hasSale = product.old_price != null && product.old_price > product.price
  const sizes = product.sizes ?? []

  const handleAdd = () => {
    if (sizes.length > 0 && !selectedSize) {
      showToast(t('modalSize'), 'error')
      return
    }
    addItem(product, selectedSize ?? '', qty)
    showToast(`${product.name} u shtua në shportë`)
    close()
  }

  const toggle = (key: string) => setOpenSection(p => p === key ? null : key)
  const prevPhoto = () => setActivePhoto(i => (i - 1 + photos.length) % photos.length)
  const nextPhoto = () => setActivePhoto(i => (i + 1) % photos.length)

  return (
    <div className="modal-overlay-ay" onClick={close}>
      <div className="modal-panel-ay" onClick={e => e.stopPropagation()}>
        <button className="modal-close-ay" onClick={close}>×</button>

        {/* Photo gallery */}
        <div className="modal-gallery-ay">
          <div className="modal-img-ay" style={{ position: 'relative' }}>
            {photos.length > 0 ? (
              <Image
                src={photos[activePhoto]}
                alt={product.name}
                fill
                sizes="480px"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', background: '#f0f0ee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                {t('modalNoPhoto')}
              </div>
            )}

            {photos.length > 1 && (
              <>
                <button className="gallery-arrow-ay left" onClick={e => { e.stopPropagation(); prevPhoto() }}>‹</button>
                <button className="gallery-arrow-ay right" onClick={e => { e.stopPropagation(); nextPhoto() }}>›</button>
                <div className="gallery-counter-ay">{activePhoto + 1} / {photos.length}</div>
              </>
            )}
          </div>

          {photos.length > 1 && (
            <div className="gallery-thumbs-ay">
              {photos.map((url, idx) => (
                <button
                  key={idx}
                  className={`gallery-thumb-ay${activePhoto === idx ? ' active' : ''}`}
                  onClick={() => setActivePhoto(idx)}
                >
                  <Image src={url} alt={`${idx + 1}`} fill sizes="60px" style={{ objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="modal-brand-ay">{product.brand}</div>
        <div className="modal-name-ay">{product.name}</div>

        <div className="modal-price-ay">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
            <span className={`modal-price-new${hasSale ? ' sale' : ''}`}>{fmt(product.price)}</span>
            {hasSale && <span className="modal-price-old">{fmt(product.old_price!)}</span>}
            {hasSale && (
              <span style={{ fontSize: '12px', background: '#e8002d', color: '#fff', padding: '2px 6px', borderRadius: '3px', fontWeight: 800 }}>
                {disc(product.price, product.old_price!)}
              </span>
            )}
          </div>
          <div className="price-lek-ay">{fmtLek(product.price)}</div>
        </div>

        {/* Info badges */}
        <div className="modal-infos-ay">
          <div className="modal-info-item-ay">
            <span className="modal-info-icon-ay">🚚</span>
            <span className="modal-info-text-ay">{t('modalFreeShip')}</span>
            <span className="modal-info-badge-ay" style={{ background: '#e8f5e9', color: '#2e7d32' }}>{t('modalFree')}</span>
          </div>
          <div className="modal-info-item-ay">
            <span className="modal-info-icon-ay">📦</span>
            <span className="modal-info-text-ay">{t('modalDelivery')}</span>
            <span className="modal-info-badge-ay" style={{ background: '#1a1a1a', color: '#fff' }}>{t('modalWorth')}</span>
          </div>
          <div className="modal-info-item-ay">
            <span className="modal-info-icon-ay">↩</span>
            <span className="modal-info-text-ay">{t('modalReturn')}</span>
          </div>
        </div>

        {/* Size */}
        {sizes.length > 0 && (
          <div>
            <div className="modal-field-label-ay">{t('modalSize')}</div>
            <div className="size-grid-ay">
              {sizes.map(s => (
                <button key={s} className={`size-btn-ay${selectedSize === s ? ' selected' : ''}`} onClick={() => setSelectedSize(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div>
          <div className="modal-field-label-ay">{t('modalQty')}</div>
          <div className="qty-row-ay">
            <button className="qty-btn-ay" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
            <span className="qty-val-ay">{qty}</span>
            <button className="qty-btn-ay" onClick={() => setQty(q => q + 1)}>+</button>
          </div>
        </div>

        <button className="add-btn-ay" onClick={handleAdd}>
          {t('modalAddCart')} · {fmt(product.price * qty)}
        </button>

        {/* Accordion sections */}
        <div className="modal-accordions-ay">
          {product.description && (
            <div className="modal-acc-ay">
              <button className="modal-acc-trigger-ay" onClick={() => toggle('desc')}>
                <span>{t('modalDescSection')}</span>
                <span className="modal-acc-arrow-ay">{openSection === 'desc' ? '∧' : '∨'}</span>
              </button>
              {openSection === 'desc' && (
                <div className="modal-acc-body-ay">
                  <p style={{ lineHeight: 1.6, color: '#555' }}>{product.description}</p>
                </div>
              )}
            </div>
          )}

          <div className="modal-acc-ay">
            <button className="modal-acc-trigger-ay" onClick={() => toggle('details')}>
              <span>{t('modalDetails')}</span>
              <span className="modal-acc-arrow-ay">{openSection === 'details' ? '∧' : '∨'}</span>
            </button>
            {openSection === 'details' && (
              <div className="modal-acc-body-ay">
                <div className="modal-acc-row-ay"><span>{t('modalBrand')}</span><span>{product.brand}</span></div>
                <div className="modal-acc-row-ay"><span>{t('modalCategory')}</span><span style={{ textTransform: 'capitalize' }}>{product.category}</span></div>
                {product.gender && <div className="modal-acc-row-ay"><span>{t('modalGender')}</span><span>{product.gender}</span></div>}
                <div className="modal-acc-row-ay"><span>{t('modalRating')}</span><span>{'★'.repeat(Math.round(product.stars))} ({product.reviews} {t('modalReviews')})</span></div>
              </div>
            )}
          </div>

          <div className="modal-acc-ay">
            <button className="modal-acc-trigger-ay" onClick={() => toggle('sizefit')}>
              <span>{t('modalSizeFit')}</span>
              <span className="modal-acc-arrow-ay">{openSection === 'sizefit' ? '∧' : '∨'}</span>
            </button>
            {openSection === 'sizefit' && (
              <div className="modal-acc-body-ay">
                <p style={{ color: '#555', lineHeight: 1.6 }}>
                  {product.size_info || `${t('modalSizeText')} ${sizes.join(', ')}.`}
                </p>
              </div>
            )}
          </div>

          <div className="modal-acc-ay">
            <button className="modal-acc-trigger-ay" onClick={() => toggle('return')}>
              <span>{t('modalReturnPol')}</span>
              <span className="modal-acc-arrow-ay">{openSection === 'return' ? '∧' : '∨'}</span>
            </button>
            {openSection === 'return' && (
              <div className="modal-acc-body-ay">
                <p style={{ color: '#555', lineHeight: 1.6 }}>{product.return_policy || t('modalReturnText')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
