import { createServiceSupabase, getAdminProfile } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'
import Link from 'next/link'
import type { Product } from '@/lib/types'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const admin = await getAdminProfile()
  const service = createServiceSupabase()

  const [{ data }, catTagResult] = await Promise.all([
    service.from('products').select('*').eq('id', params.id).single(),
    service.from('category_tags').select('category_id, tag_label'),
  ])
  const catTagRows = catTagResult.data

  if (!data) notFound()
  if (admin?.role === 'admin' && data.created_by !== admin.userId) notFound()

  let categoryTags: Record<string, string[]> | undefined
  if (catTagRows && catTagRows.length > 0) {
    const map: Record<string, string[]> = {}
    for (const { category_id, tag_label } of catTagRows) {
      if (!map[category_id]) map[category_id] = []
      map[category_id].push(tag_label)
    }
    categoryTags = map
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
        <Link href="/admin/products" className="admin-btn-ay admin-btn-ghost">← Kthehu</Link>
        <h1 className="admin-h1-ay" style={{ margin: 0 }}>Ndrysho: {data.name}</h1>
      </div>
      <ProductForm product={data as Product} categoryTags={categoryTags} />
    </div>
  )
}
