'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'
import type { Category } from '@/lib/types'
import { useCategoriesContext } from '@/context/CategoriesContext'

export default function FilterBar({ total }: { total: number }) {
  const { productCats } = useCategoriesContext()
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [, startTransition] = useTransition()

  const activeCat = params.get('cat') ?? 'all'
  const isSale = params.get('sale') === 'true'
  const sort = params.get('sort') ?? ''

  const push = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString())
    for (const [k, v] of Object.entries(updates)) {
      if (v === null) next.delete(k); else next.set(k, v)
    }
    startTransition(() => router.push(`${pathname}?${next.toString()}`))
  }

  return (
    <div>
      <div className="filter-row-ay">
        <button
          className={`filter-chip-ay${activeCat === 'all' ? ' active' : ''}`}
          onClick={() => push({ cat: null })}
        >
          Të gjitha
        </button>
        {productCats.map(c => (
          <button
            key={c.id}
            className={`filter-chip-ay${activeCat === c.id ? ' active' : ''}`}
            onClick={() => push({ cat: c.id })}
          >
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

        <select
          className="sort-select"
          value={sort}
          onChange={e => push({ sort: e.target.value || null })}
        >
          <option value="">Rendit: Parazgjedhja</option>
          <option value="price_asc">Çmimi: Ulët → Lartë</option>
          <option value="price_desc">Çmimi: Lartë → Ulët</option>
          <option value="newest">Më të rejat</option>
        </select>
      </div>
      <div className="results-count">{total} produkte</div>
    </div>
  )
}
