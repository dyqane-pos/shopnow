'use server'
import { createServerSupabase, createServiceSupabase } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function createAdmin(_prev: unknown, formData: FormData) {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Jo i autorizuar' }
  const { data: p } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (p?.role !== 'superadmin') return { error: 'Vetëm superadmin mund të krijojë adminë' }

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const service = createServiceSupabase()
  const { data: newUser, error } = await service.auth.admin.createUser({
    email, password, email_confirm: true, user_metadata: { name },
  })
  if (error) return { error: error.message }
  await service.from('profiles').upsert({ id: newUser.user.id, name, role: 'admin' })
  revalidatePath('/admin/admins')
  return { success: true }
}

export async function toggleAdminRole(userId: string, currentRole: string) {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const { data: p } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (p?.role !== 'superadmin') return
  await supabase.from('profiles').update({ role: currentRole === 'admin' ? 'user' : 'admin' }).eq('id', userId)
  revalidatePath('/admin/admins')
}
