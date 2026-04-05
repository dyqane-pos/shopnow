import { createServiceSupabase } from '@/lib/supabase-server'
import CategoriesManager from '@/components/admin/CategoriesManager'
import type { Category } from '@/lib/types'

export default async function AdminCategoriesPage() {
  let categories: Category[] = []
  try {
    const supabase = createServiceSupabase()
    const { data } = await supabase.from('categories').select('*').order('type').order('sort_order')
    categories = data ?? []
  } catch {}

  return (
    <div>
      <h1 className="admin-h1-ay">Kategoritë</h1>
      <CategoriesManager categories={categories} />
    </div>
  )
}
