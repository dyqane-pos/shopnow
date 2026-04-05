import { createServerSupabase } from '@/lib/supabase-server'
import CategoriesManager from '@/components/admin/CategoriesManager'
import type { Category } from '@/lib/types'

export default async function AdminCategoriesPage() {
  const supabase = createServerSupabase()
  const { data } = await supabase.from('categories').select('*').order('type').order('sort_order')
  const categories: Category[] = data ?? []

  return (
    <div>
      <h1 className="admin-h1-ay">Kategoritë</h1>
      <CategoriesManager categories={categories} />
    </div>
  )
}
