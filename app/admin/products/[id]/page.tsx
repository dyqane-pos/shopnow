import { createServiceSupabase, getAdminProfile } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'
import Link from 'next/link'
import type { Product } from '@/lib/types'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const admin = await getAdminProfile()
  const supabase = createServiceSupabase()
  const { data } = await supabase.from('products').select('*').eq('id', params.id).single()
  if (!data) notFound()

  // Admin mund të ndryshojë vetëm produktet e veta
  if (admin?.role === 'admin' && data.created_by !== admin.userId) notFound()

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
        <Link href="/admin/products" className="admin-btn-ay admin-btn-ghost">← Kthehu</Link>
        <h1 className="admin-h1-ay" style={{ margin: 0 }}>Ndrysho: {data.name}</h1>
      </div>
      <ProductForm product={data as Product} />
    </div>
  )
}
