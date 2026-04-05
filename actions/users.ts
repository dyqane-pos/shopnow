'use server'
import { createServerSupabase, createServiceSupabase } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

async function requireSuperadmin() {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const service = createServiceSupabase()
  const { data: p } = await service.from('profiles').select('role').eq('id', user.id).maybeSingle()
  return p?.role === 'superadmin'
}

export async function setUserRole(userId: string, role: 'user' | 'admin' | 'superadmin') {
  if (!await requireSuperadmin()) return { error: 'Jo i autorizuar' }
  const service = createServiceSupabase()
  await service.from('profiles').update({ role }).eq('id', userId)
  revalidatePath('/admin/users')
  return { success: true }
}

export async function deleteUser(userId: string) {
  if (!await requireSuperadmin()) return { error: 'Jo i autorizuar' }
  const service = createServiceSupabase()
  const { error } = await service.auth.admin.deleteUser(userId)
  if (error) return { error: error.message }
  revalidatePath('/admin/users')
  return { success: true }
}
