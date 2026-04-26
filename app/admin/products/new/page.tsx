import { createServiceSupabase } from '@/lib/supabase-server'
import ProductWizard from '@/components/admin/ProductWizard'
import Link from 'next/link'

async function fetchCategoryTags(): Promise<Record<string, string[]>> {
  try {
    const service = createServiceSupabase()
    const { data } = await service.from('category_tags').select('category_id, tag_label')
    if (!data || data.length === 0) return {}
    const map: Record<string, string[]> = {}
    for (const { category_id, tag_label } of data) {
      if (!map[category_id]) map[category_id] = []
      map[category_id].push(tag_label)
    }
    return map
  } catch { return {} }
}

export default async function NewProductPage() {
  const categoryTags = await fetchCategoryTags()
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
        <Link href="/admin/products" className="admin-btn-ay admin-btn-ghost">← Kthehu</Link>
        <h1 className="admin-h1-ay" style={{ margin: 0 }}>Produkt i ri</h1>
      </div>
      <ProductWizard categoryTags={Object.keys(categoryTags).length > 0 ? categoryTags : undefined} />
    </div>
  )
}
