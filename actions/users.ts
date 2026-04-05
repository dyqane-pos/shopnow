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

export async function createUser(_prev: unknown, formData: FormData) {
  if (!await requireSuperadmin()) return { error: 'Jo i autorizuar' }
  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string
  const role = (formData.get('role') as string) || 'user'
  if (!name || !email || !password) return { error: 'Të gjitha fushat janë të detyrueshme' }
  if (password.length < 6) return { error: 'Fjalëkalimi duhet të ketë minimumi 6 karaktere' }

  const service = createServiceSupabase()
  const { data, error } = await service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, role },
  })
  if (error) return { error: error.message }
  if (!data.user) return { error: 'Krijimi dështoi' }

  await service.from('profiles').upsert({ id: data.user.id, name, role })
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
