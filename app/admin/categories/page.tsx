import { createServiceSupabase } from '@/lib/supabase-server'
import CategoriesManager from '@/components/admin/CategoriesManager'
import CategoryTagsManager from '@/components/admin/CategoryTagsManager'
import type { Category } from '@/lib/types'
import { CATEGORIES } from '@/lib/types'

export default async function AdminCategoriesPage() {
  let categories: Category[] = []
  let categoryTags: Record<string, string[]> = {}

  try {
    const supabase = createServiceSupabase()
    const [{ data: cats }, { data: tagRows }] = await Promise.all([
      supabase.from('categories').select('*').order('type').order('sort_order'),
      supabase.from('category_tags').select('category_id, tag_label'),
    ])
    categories = cats ?? []
    if (tagRows) {
      for (const { category_id, tag_label } of tagRows) {
        if (!categoryTags[category_id]) categoryTags[category_id] = []
        categoryTags[category_id].push(tag_label)
      }
    }
  } catch {}

  const productCats = categories.filter(c => c.type === 'product').length > 0
    ? categories.filter(c => c.type === 'product')
    : CATEGORIES.map((c, i) => ({ id: c.id, label: c.label, type: 'product' as const, sort_order: i, is_active: true }))

  return (
    <div>
      <h1 className="admin-h1-ay">Kategoritë</h1>
      <CategoriesManager categories={categories} />

      <h2 style={{ fontSize: '16px', fontWeight: 800, margin: '2rem 0 1rem' }}>
        Tagjet e Sidebarit sipas Kategorisë
      </h2>
      <CategoryTagsManager productCats={productCats} categoryTags={categoryTags} />
    </div>
  )
}
