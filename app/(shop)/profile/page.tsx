import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase-server'
import type { Order } from '@/lib/types'
import ProfileContent from '@/components/shop/ProfileContent'

export default async function ProfilePage() {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
  ])

  const name = profile?.name || user.email || 'Përdorues'

  return (
    <ProfileContent
      name={name}
      email={user.email ?? ''}
      orders={(orders ?? []) as Order[]}
    />
  )
}
