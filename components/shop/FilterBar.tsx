'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition, useState, useRef, useEffect } from 'react'
import { useCategoriesContext } from '@/context/CategoriesContext'

export default function FilterBar({ total, sizes, view }: {
  total: number
  sizes: string[]
  view: 'grid' | 'list'
}) {
  const { productCats } = useCategoriesContext()
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [, startTransition] = useTransition()

  const activeCat = params.get('cat') ?? 'all'
  const isSale = params.get('sale') === 'true'
  const sort = params.get('sort') ?? ''
  const activeSize = params.get('size') ?? ''
  const [minVal, setMinVal] = useState(params.get('minPrice') ?? '')
  const [maxVal, setMaxVal] = useState(params.get('maxPrice') ?? '')
  const [openDrop, setOpenDrop] = useState<'size' | 'price' | null>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpenDrop(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const push = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString())
    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === '') next.delete(k); else next.set(k, v)
    }
    startTransition(() => router.push(`${pathname}?${next.toString()}`))
  }

  const applyPrice = () => {
    push({ minPrice: minVal || null, maxPrice: maxVal || null })
    setOpenDrop(null)
  }

  const hasActiveFilters = isSale || activeSize || params.get('minPrice') || params.get('maxPrice')

  return (
    <div>
      {/* Row 1: categories + sale + sort + view */}
      <div className="filter-row-ay">
        <button className={`filter-chip-ay${activeCat === 'all' ? ' active' : ''}`} onClick={() => push({ cat: null })}>
          Të gjitha
        </button>
        {productCats.map(c => (
          <button key={c.id} className={`filter-chip-ay${activeCat === c.id ? ' active' : ''}`} onClick={() => push({ cat: c.id })}>
            {c.label}
          </button>
        ))}
        <button
          className={`filter-chip-ay${isSale ? ' active' : ''}`}
          style={isSale ? { background: '#e8002d', borderColor: '#e8002d' } : { color: '#e8002d', borderColor: '#e8002d' }}
          onClick={() => push({ sale: isSale ? null : 'true' })}
        >
          SALE
        </button>

        <select className="sort-select" value={sort} onChange={e => push({ sort: e.target.value || null })}>
          <option value="">Rendit: Parazgjedhja</option>
          <option value="price_asc">Çmimi: Ulët → Lartë</option>
          <option value="price_desc">Çmimi: Lartë → Ulët</option>
          <option value="newest">Më të rejat</option>
        </select>

        {/* View toggle */}
        <div className="view-toggle-ay">
          <button
            className={`view-btn-ay${view === 'grid' ? ' active' : ''}`}
            onClick={() => push({ view: 'grid' })}
            title="Pamja grid"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <rect x="0" y="0" width="6" height="6" rx="1"/><rect x="10" y="0" width="6" height="6" rx="1"/>
              <rect x="0" y="10" width="6" height="6" rx="1"/><rect x="10" y="10" width="6" height="6" rx="1"/>
            </svg>
          </button>
          <button
            className={`view-btn-ay${view === 'list' ? ' active' : ''}`}
            onClick={() => push({ view: 'list' })}
            title="Pamja listë"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <rect x="0" y="1" width="16" height="3" rx="1"/><rect x="0" y="7" width="16" height="3" rx="1"/>
              <rect x="0" y="13" width="16" height="3" rx="1"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Row 2: advanced filters */}
      <div className="filter-row-ay" ref={dropRef} style={{ position: 'relative' }}>
        {/* Size dropdown */}
        {sizes.length > 0 && (
          <div style={{ position: 'relative' }}>
            <button
              className={`filter-chip-ay${activeSize ? ' active' : ''}`}
              onClick={() => setOpenDrop(openDrop === 'size' ? null : 'size')}
            >
              {activeSize ? `Madhësia: ${activeSize}` : 'Madhësia'} ▾
            </button>
            {openDrop === 'size' && (
              <div className="filter-drop-ay">
                <div style={{ fontWeight: 700, fontSize: '11px', marginBottom: '8px', color: '#888', letterSpacing: '.5px', textTransform: 'uppercase' }}>Madhësia</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {sizes.map(s => (
                    <button
                      key={s}
                      className={`size-btn-ay${activeSize === s ? ' selected' : ''}`}
                      onClick={() => { push({ size: activeSize === s ? null : s }); setOpenDrop(null) }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {activeSize && (
                  <button
                    onClick={() => { push({ size: null }); setOpenDrop(null) }}
                    style={{ marginTop: '10px', fontSize: '11px', color: '#888', textDecoration: 'underline' }}
                  >
                    Pastro
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Price dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className={`filter-chip-ay${(params.get('minPrice') || params.get('maxPrice')) ? ' active' : ''}`}
            onClick={() => setOpenDrop(openDrop === 'price' ? null : 'price')}
          >
            {params.get('minPrice') || params.get('maxPrice')
              ? `€${params.get('minPrice') || '0'} – €${params.get('maxPrice') || '∞'}`
              : 'Çmimi'} ▾
          </button>
          {openDrop === 'price' && (
            <div className="filter-drop-ay" style={{ minWidth: 220 }}>
              <div style={{ fontWeight: 700, fontSize: '11px', marginBottom: '10px', color: '#888', letterSpacing: '.5px', textTransform: 'uppercase' }}>Çmimi (€)</div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="number"
                  className="admin-input-ay"
                  style={{ width: 80, padding: '6px 8px' }}
                  placeholder="Min"
                  value={minVal}
                  onChange={e => setMinVal(e.target.value)}
                  min={0}
                />
                <span style={{ color: '#888' }}>—</span>
                <input
                  type="number"
                  className="admin-input-ay"
                  style={{ width: 80, padding: '6px 8px' }}
                  placeholder="Max"
                  value={maxVal}
                  onChange={e => setMaxVal(e.target.value)}
                  min={0}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button className="filter-chip-ay active" style={{ borderRadius: 6, padding: '5px 14px' }} onClick={applyPrice}>
                  Apliko
                </button>
                {(params.get('minPrice') || params.get('maxPrice')) && (
                  <button
                    style={{ fontSize: '11px', color: '#888', textDecoration: 'underline' }}
                    onClick={() => { setMinVal(''); setMaxVal(''); push({ minPrice: null, maxPrice: null }); setOpenDrop(null) }}
                  >
                    Pastro
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Clear all */}
        {hasActiveFilters && (
          <button
            style={{ fontSize: '11px', color: '#e8002d', fontWeight: 600, marginLeft: '4px' }}
            onClick={() => { setMinVal(''); setMaxVal(''); push({ sale: null, size: null, minPrice: null, maxPrice: null }) }}
          >
            × Pastro filtrat
          </button>
        )}
      </div>

      <div className="results-count">{total} produkte</div>
    </div>
  )
}
