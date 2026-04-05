'use server'
import { createServerSupabase } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function saveCategory(_prev: unknown, formData: FormData) {
  const supabase = createServerSupabase()
  const rawId = formData.get('id') as string | null
  const label = formData.get('label') as string
  const type = formData.get('type') as 'product' | 'gender' | 'sidebar'
  const sortOrderRaw = formData.get('sort_order') as string | null
  if (!label) return { error: 'Etiketa është e detyrueshme' }
  const id = rawId ? rawId : label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  if (!id) return { error: 'ID e kategorisë nuk mund të gjenerohet' }
  const sort_order = sortOrderRaw ? Number(sortOrderRaw) : 0
  const { error } = await supabase.from('categories').upsert({ id, label, type, sort_order, is_active: true })
  if (error) return { error: error.message }
  revalidatePath('/admin/categories')
  revalidatePath('/')
  return { success: true }
}

export async function updateCategoryLabel(id: string, label: string) {
  const supabase = createServerSupabase()
  await supabase.from('categories').update({ label }).eq('id', id)
  revalidatePath('/admin/categories')
  revalidatePath('/')
}

export async function deleteCategory(id: string) {
  const supabase = createServerSupabase()
  await supabase.from('categories').delete().eq('id', id)
  revalidatePath('/admin/categories')
  revalidatePath('/')
}

export async function moveCategory(id: string, direction: 'up' | 'down') {
  const supabase = createServerSupabase()
  const { data: cat } = await supabase.from('categories').select('*').eq('id', id).single()
  if (!cat) return
  const { data: neighbor } = await supabase.from('categories').select('*').eq('type', cat.type)
    .eq('sort_order', direction === 'up' ? cat.sort_order - 1 : cat.sort_order + 1).single()
  if (!neighbor) return
  await Promise.all([
    supabase.from('categories').update({ sort_order: neighbor.sort_order }).eq('id', cat.id),
    supabase.from('categories').update({ sort_order: cat.sort_order }).eq('id', neighbor.id),
  ])
  revalidatePath('/admin/categories')
  revalidatePath('/')
}
