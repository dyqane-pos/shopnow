import type { Product } from '@/lib/types'
import ProductCard from './ProductCard'

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="empty-ay">
        <h3>Asnjë produkt</h3>
        <p>Provo të ndryshosh filtrat ose kërkimin.</p>
      </div>
    )
  }

  return (
    <div className="grid-ay">
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
