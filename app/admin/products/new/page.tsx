import ProductForm from '@/components/admin/ProductForm'
import Link from 'next/link'

export default function NewProductPage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
        <Link href="/admin/products" className="admin-btn-ay admin-btn-ghost">← Kthehu</Link>
        <h1 className="admin-h1-ay" style={{ margin: 0 }}>Produkt i ri</h1>
      </div>
      <ProductForm />
    </div>
  )
}
