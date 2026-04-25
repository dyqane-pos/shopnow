import { createServiceSupabase, getAdminProfile } from '@/lib/supabase-server'
import ProductTable from '@/components/admin/ProductTable'
import Link from 'next/link'
import type { Product } from '@/lib/types'

export default async function AdminProductsPage() {
  const admin = await getAdminProfile()
  let products: Product[] = []
  try {
    const supabase = createServiceSupabase()
    let query = supabase.from('products').select('*').order('created_at', { ascending: false })
    // Admin sheh vetëm produktet e veta; superadmin sheh të gjitha
    if (admin?.role === 'admin') {
      query = query.eq('created_by', admin.userId)
    }
    const { data } = await query
    products = data ?? []
  } catch {}

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <h1 className="admin-h1-ay" style={{ margin: 0 }}>Produktet ({products.length})</h1>
        <Link href="/admin/products/new" className="admin-btn-ay admin-btn-primary">+ Produkt i ri</Link>
      </div>
      <ProductTable products={products} />
    </div>
  )
}
