import type { Product } from '@/lib/types'
import ProductCard from './ProductCard'

export default function ProductGrid({ products, view = 'grid' }: { products: Product[]; view?: 'grid' | 'list' }) {
  if (products.length === 0) {
    return (
      <div className="empty-ay">
        <h3>Asnjë produkt</h3>
        <p>Provo të ndryshosh filtrat ose kërkimin.</p>
      </div>
    )
  }

  return (
    <div className={view === 'list' ? 'list-ay' : 'grid-ay'}>
      {products.map(p => (
        <ProductCard key={p.id} product={p} view={view} />
      ))}
    </div>
  )
}
