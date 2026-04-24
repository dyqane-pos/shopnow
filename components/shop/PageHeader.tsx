'use client'
import { useSearchParams } from 'next/navigation'
import { useCategoriesContext } from '@/context/CategoriesContext'

export default function PageHeader({ total }: { total: number }) {
  const params = useSearchParams()
  const { productCats, genders } = useCategoriesContext()

  const genderId = params.get('gender')
  const gender = genders.find(g => g.label === genderId) ?? genders[0]
  const catId = params.get('cat') ?? 'all'
  const cat = catId !== 'all' ? productCats.find(c => c.id === catId) : null
  const sidebar = params.get('sidebar')
  const q = params.get('q')

  const activeLabel = sidebar ?? cat?.label ?? (q ? `"${q}"` : 'Të gjitha')

  return (
    <div className="page-header-ay">
      <div className="breadcrumb-ay">
        <span>Dyqani</span>
        {gender && <><span className="bc-sep">›</span><span>{gender.label}</span></>}
        {(cat || sidebar) && <><span className="bc-sep">›</span><span>{cat?.label ?? sidebar}</span></>}
      </div>
      <div className="page-title-row-ay">
        <h1 className="page-title-ay">
          {activeLabel}
          {gender && <span className="page-title-sub"> for {gender.label}</span>}
        </h1>
        <span className="page-title-count-ay">{total.toLocaleString('sq-AL')}</span>
      </div>
    </div>
  )
}
