'use client'
import Image from 'next/image'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition, useState } from 'react'
import type { Product } from '@/lib/types'
import { fmt, disc } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/hooks/useToast'

const SECTIONS = [
  { key: 'desc',    label: 'Përshkrimi' },
  { key: 'details', label: 'Detaje Produkti' },
  { key: 'sizefit', label: 'Madhësia & Forma' },
  { key: 'return',  label: 'Politika e Kthimit' },
]

export default function ProductModal({ products }: { products: Product[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [, startTransition] = useTransition()
  const { addItem } = useCart()
  const { showToast } = useToast()

  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [openSection, setOpenSection] = useState<string | null>(null)

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

  const toggle = (key: string) => setOpenSection(p => p === key ? null : key)

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
          {hasSale && (
            <span style={{ fontSize: '12px', background: '#e8002d', color: '#fff', padding: '2px 6px', borderRadius: '3px', fontWeight: 800 }}>
              {disc(product.price, product.old_price!)}
            </span>
          )}
        </div>

        {/* Info badges — transport, dërgesa, kthim */}
        <div className="modal-infos-ay">
          <div className="modal-info-item-ay">
            <span className="modal-info-icon-ay">🚚</span>
            <span className="modal-info-text-ay">Transport falas</span>
            <span className="modal-info-badge-ay" style={{ background: '#e8f5e9', color: '#2e7d32' }}>Falas</span>
          </div>
          <div className="modal-info-item-ay">
            <span className="modal-info-icon-ay">📦</span>
            <span className="modal-info-text-ay">7–14 ditë pune</span>
            <span className="modal-info-badge-ay" style={{ background: '#1a1a1a', color: '#fff' }}>Merit pritjen!</span>
          </div>
          <div className="modal-info-item-ay">
            <span className="modal-info-icon-ay">↩</span>
            <span className="modal-info-text-ay">30 ditë kthim</span>
          </div>
        </div>

        {/* Madhësia */}
        {sizes.length > 0 && (
          <div>
            <div className="modal-field-label-ay">Madhësia</div>
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

        {/* Sasia */}
        <div>
          <div className="modal-field-label-ay">Sasia</div>
          <div className="qty-row-ay">
            <button className="qty-btn-ay" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
            <span className="qty-val-ay">{qty}</span>
            <button className="qty-btn-ay" onClick={() => setQty(q => q + 1)}>+</button>
          </div>
        </div>

        <button className="add-btn-ay" onClick={handleAdd}>
          Shto në shportë · {fmt(product.price * qty)}
        </button>

        {/* Accordion seksione */}
        <div className="modal-accordions-ay">
          {/* Përshkrimi */}
          {product.description && (
            <div className="modal-acc-ay">
              <button className="modal-acc-trigger-ay" onClick={() => toggle('desc')}>
                <span>{SECTIONS[0].label}</span>
                <span className="modal-acc-arrow-ay">{openSection === 'desc' ? '∧' : '∨'}</span>
              </button>
              {openSection === 'desc' && (
                <div className="modal-acc-body-ay">
                  <p style={{ lineHeight: 1.6, color: '#555' }}>{product.description}</p>
                </div>
              )}
            </div>
          )}

          {/* Detaje produkti */}
          <div className="modal-acc-ay">
            <button className="modal-acc-trigger-ay" onClick={() => toggle('details')}>
              <span>{SECTIONS[1].label}</span>
              <span className="modal-acc-arrow-ay">{openSection === 'details' ? '∧' : '∨'}</span>
            </button>
            {openSection === 'details' && (
              <div className="modal-acc-body-ay">
                <div className="modal-acc-row-ay"><span>Brendi</span><span>{product.brand}</span></div>
                <div className="modal-acc-row-ay"><span>Kategoria</span><span style={{ textTransform: 'capitalize' }}>{product.category}</span></div>
                {product.gender && <div className="modal-acc-row-ay"><span>Gjinia</span><span>{product.gender}</span></div>}
                <div className="modal-acc-row-ay"><span>Vlerësimi</span><span>{'★'.repeat(Math.round(product.stars))} ({product.reviews} vlerësime)</span></div>
              </div>
            )}
          </div>

          {/* Madhësia & Forma */}
          <div className="modal-acc-ay">
            <button className="modal-acc-trigger-ay" onClick={() => toggle('sizefit')}>
              <span>{SECTIONS[2].label}</span>
              <span className="modal-acc-arrow-ay">{openSection === 'sizefit' ? '∧' : '∨'}</span>
            </button>
            {openSection === 'sizefit' && (
              <div className="modal-acc-body-ay">
                <p style={{ color: '#555', lineHeight: 1.6 }}>
                  Produkti është sipas madhësisë standarde. Nëse jeni midis dy madhësive, rekomandojmë të zgjidhni madhësinë më të madhe. Madhësitë e disponueshme: {sizes.join(', ')}.
                </p>
              </div>
            )}
          </div>

          {/* Kthimi */}
          <div className="modal-acc-ay">
            <button className="modal-acc-trigger-ay" onClick={() => toggle('return')}>
              <span>{SECTIONS[3].label}</span>
              <span className="modal-acc-arrow-ay">{openSection === 'return' ? '∧' : '∨'}</span>
            </button>
            {openSection === 'return' && (
              <div className="modal-acc-body-ay">
                <p style={{ color: '#555', lineHeight: 1.6 }}>
                  Mund ta ktheni produktin brenda <strong>30 ditëve</strong> nga data e blerjes. Produkti duhet të jetë i papërdorur dhe me etiketat origjinale. Kontaktoni ekipin tonë për të iniciuar kthimin.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
