'use server'
import { createServerSupabase, createServiceSupabase } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

async function requireSuperadmin() {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: p } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  return p?.role === 'superadmin' ? supabase : null
}

export async function setUserRole(userId: string, role: 'user' | 'admin' | 'superadmin') {
  const sb = await requireSuperadmin()
  if (!sb) return { error: 'Jo i autorizuar' }
  await sb.from('profiles').update({ role }).eq('id', userId)
  revalidatePath('/admin/users')
  return { success: true }
}

export async function deleteUser(userId: string) {
  const sb = await requireSuperadmin()
  if (!sb) return { error: 'Jo i autorizuar' }
  const service = createServiceSupabase()
  const { error } = await service.auth.admin.deleteUser(userId)
  if (error) return { error: error.message }
  revalidatePath('/admin/users')
  return { success: true }
}
