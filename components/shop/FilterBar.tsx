'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition, useState, useRef, useEffect } from 'react'
import { useCategoriesContext } from '@/context/CategoriesContext'
import { useLang } from '@/context/LanguageContext'
import { COLOR_HEX } from '@/lib/types'

export default function FilterBar({ total, sizes, brands, colors, materials, view }: {
  total: number
  sizes: string[]
  brands: string[]
  colors: string[]
  materials: string[]
  view: 'grid' | 'list'
}) {
  const { productCats } = useCategoriesContext()
  const { t } = useLang()
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [, startTransition] = useTransition()

  const activeCat = params.get('cat') ?? 'all'
  const isSale = params.get('sale') === 'true'
  const sort = params.get('sort') ?? ''
  const activeSize = params.get('size') ?? ''
  const activeBrand = params.get('brand') ?? ''
  const activeColor = params.get('color') ?? ''
  const activeMaterial = params.get('material') ?? ''
  const [minVal, setMinVal] = useState(params.get('minPrice') ?? '')
  const [maxVal, setMaxVal] = useState(params.get('maxPrice') ?? '')
  const [openDrop, setOpenDrop] = useState<'size' | 'brand' | 'color' | 'material' | 'price' | null>(null)
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

  const hasActiveFilters = isSale || activeSize || activeBrand || activeColor || activeMaterial || params.get('minPrice') || params.get('maxPrice')

  return (
    <div>
      {/* Row 1: categories + sale + sort + view */}
      <div className="filter-row-ay">
        <button className={`filter-chip-ay${activeCat === 'all' ? ' active' : ''}`} onClick={() => push({ cat: null })}>
          {t('filterAll')}
        </button>
        {productCats.filter(c => c.id !== 'all').map(c => (
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
          <option value="">{t('sortDefault')}</option>
          <option value="price_asc">{t('sortPriceAsc')}</option>
          <option value="price_desc">{t('sortPriceDesc')}</option>
          <option value="newest">{t('sortNewest')}</option>
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
        <div style={{ position: 'relative' }}>
          <button
            className={`filter-chip-ay${activeSize ? ' active' : ''}`}
            onClick={() => sizes.length > 0 ? setOpenDrop(openDrop === 'size' ? null : 'size') : undefined}
            style={sizes.length === 0 ? { opacity: 0.4, cursor: 'default' } : {}}
          >
            {activeSize ? `${t('filterSize')}: ${activeSize}` : t('filterSize')} ▾
          </button>
          {openDrop === 'size' && sizes.length > 0 && (
            <div className="filter-drop-ay">
              <div style={{ fontWeight: 700, fontSize: '11px', marginBottom: '8px', color: '#888', letterSpacing: '.5px', textTransform: 'uppercase' }}>{t('filterSize')}</div>
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
                  {t('filterClear')}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Brand dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className={`filter-chip-ay${activeBrand ? ' active' : ''}`}
            onClick={() => brands.length > 0 ? setOpenDrop(openDrop === 'brand' ? null : 'brand') : undefined}
            style={brands.length === 0 ? { opacity: 0.4, cursor: 'default' } : {}}
          >
            {activeBrand || t('filterBrand')} ▾
          </button>
          {openDrop === 'brand' && brands.length > 0 && (
            <div className="filter-drop-ay" style={{ minWidth: 200, maxHeight: 260, overflowY: 'auto' }}>
              <div style={{ fontWeight: 700, fontSize: '11px', marginBottom: '8px', color: '#888', letterSpacing: '.5px', textTransform: 'uppercase' }}>{t('filterBrand')}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {brands.map(b => (
                  <button
                    key={b}
                    onClick={() => { push({ brand: activeBrand === b ? null : b }); setOpenDrop(null) }}
                    style={{
                      textAlign: 'left', padding: '5px 8px', borderRadius: 5, fontSize: '13px',
                      fontWeight: activeBrand === b ? 700 : 400,
                      background: activeBrand === b ? '#f0f0f0' : 'transparent',
                    }}
                  >
                    {b}
                  </button>
                ))}
              </div>
              {activeBrand && (
                <button
                  onClick={() => { push({ brand: null }); setOpenDrop(null) }}
                  style={{ marginTop: '10px', fontSize: '11px', color: '#888', textDecoration: 'underline' }}
                >
                  {t('filterClear')}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Color dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className={`filter-chip-ay${activeColor ? ' active' : ''}`}
            onClick={() => colors.length > 0 ? setOpenDrop(openDrop === 'color' ? null : 'color') : undefined}
            style={colors.length === 0 ? { opacity: 0.4, cursor: 'default' } : {}}
          >
            {activeColor || t('filterColor')} ▾
          </button>
          {openDrop === 'color' && colors.length > 0 && (
            <div className="filter-drop-ay" style={{ minWidth: 200 }}>
              <div style={{ fontWeight: 700, fontSize: '11px', marginBottom: '10px', color: '#888', letterSpacing: '.5px', textTransform: 'uppercase' }}>{t('filterColor')}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => { push({ color: activeColor === c ? null : c }); setOpenDrop(null) }}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left', padding: '4px 6px', borderRadius: 5, fontWeight: activeColor === c ? 700 : 400, background: activeColor === c ? '#f0f0f0' : 'transparent', fontSize: '13px' }}
                  >
                    <span style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, border: '1px solid #ddd', background: COLOR_HEX[c] ?? '#ccc', display: 'inline-block' }} />
                    {c}
                  </button>
                ))}
              </div>
              {activeColor && <button onClick={() => { push({ color: null }); setOpenDrop(null) }} style={{ marginTop: '10px', fontSize: '11px', color: '#888', textDecoration: 'underline' }}>{t('filterClear')}</button>}
            </div>
          )}
        </div>

        {/* Material dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className={`filter-chip-ay${activeMaterial ? ' active' : ''}`}
            onClick={() => materials.length > 0 ? setOpenDrop(openDrop === 'material' ? null : 'material') : undefined}
            style={materials.length === 0 ? { opacity: 0.4, cursor: 'default' } : {}}
          >
            {activeMaterial || t('filterMaterial')} ▾
          </button>
          {openDrop === 'material' && materials.length > 0 && (
            <div className="filter-drop-ay" style={{ minWidth: 180, maxHeight: 260, overflowY: 'auto' }}>
              <div style={{ fontWeight: 700, fontSize: '11px', marginBottom: '8px', color: '#888', letterSpacing: '.5px', textTransform: 'uppercase' }}>{t('filterMaterial')}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {materials.map(m => (
                  <button key={m} onClick={() => { push({ material: activeMaterial === m ? null : m }); setOpenDrop(null) }}
                    style={{ textAlign: 'left', padding: '5px 8px', borderRadius: 5, fontSize: '13px', fontWeight: activeMaterial === m ? 700 : 400, background: activeMaterial === m ? '#f0f0f0' : 'transparent' }}>
                    {m}
                  </button>
                ))}
              </div>
              {activeMaterial && <button onClick={() => { push({ material: null }); setOpenDrop(null) }} style={{ marginTop: '10px', fontSize: '11px', color: '#888', textDecoration: 'underline' }}>{t('filterClear')}</button>}
            </div>
          )}
        </div>

        {/* Price dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className={`filter-chip-ay${(params.get('minPrice') || params.get('maxPrice')) ? ' active' : ''}`}
            onClick={() => setOpenDrop(openDrop === 'price' ? null : 'price')}
          >
            {params.get('minPrice') || params.get('maxPrice')
              ? `€${params.get('minPrice') || '0'} – €${params.get('maxPrice') || '∞'}`
              : t('filterPrice')} ▾
          </button>
          {openDrop === 'price' && (
            <div className="filter-drop-ay" style={{ minWidth: 220 }}>
              <div style={{ fontWeight: 700, fontSize: '11px', marginBottom: '10px', color: '#888', letterSpacing: '.5px', textTransform: 'uppercase' }}>{t('filterPrice')} (€)</div>
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
                  {t('filterApply')}
                </button>
                {(params.get('minPrice') || params.get('maxPrice')) && (
                  <button
                    style={{ fontSize: '11px', color: '#888', textDecoration: 'underline' }}
                    onClick={() => { setMinVal(''); setMaxVal(''); push({ minPrice: null, maxPrice: null }); setOpenDrop(null) }}
                  >
                    {t('filterClear')}
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
            onClick={() => { setMinVal(''); setMaxVal(''); push({ sale: null, size: null, brand: null, color: null, material: null, minPrice: null, maxPrice: null }) }}
          >
            {t('filterClearAll')}
          </button>
        )}
      </div>

      <div className="results-count">{total} {t('filterProducts')}</div>
    </div>
  )
}
