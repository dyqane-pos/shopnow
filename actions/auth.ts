'use server'
import { createServerSupabase, createServiceSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(_prev: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = createServerSupabase()
  const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  // Kontrollo rolin për redirect të duhur
  let redirectTo = '/'
  try {
    const service = createServiceSupabase()
    const { data: profile } = await service
      .from('profiles').select('role').eq('id', authData.user.id).maybeSingle()
    if (profile && ['admin', 'superadmin'].includes(profile.role ?? '')) {
      redirectTo = '/admin'
    }
  } catch {}

  revalidatePath('/', 'layout')
  redirect(redirectTo)
}

export async function register(_prev: unknown, formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = createServerSupabase()
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
  if (error) return { error: error.message }
  if (!data.user) return { error: 'Regjistrimi dështoi.' }
  await supabase.from('profiles').upsert({ id: data.user.id, name, role: 'user' })
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = createServerSupabase()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
