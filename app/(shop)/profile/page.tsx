import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase-server'
import { ini, fmt } from '@/lib/utils'
import type { Order } from '@/lib/types'
import ProfileOrders from '@/components/shop/ProfileOrders'

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
    <div className="profile-page-ay">
      <div className="profile-hero-ay">
        <div className="avatar-ay">{ini(name)}</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '16px' }}>{name}</div>
          <div style={{ color: '#888', fontSize: '12px' }}>{user.email}</div>
        </div>
      </div>

      <h2 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '1rem' }}>Porositë e mia</h2>

      {!orders?.length ? (
        <div className="empty-ay">
          <h3>Asnjë porosi</h3>
          <p>Bëj porosinë e parë nga dyqani.</p>
        </div>
      ) : (
        <ProfileOrders orders={orders as Order[]} />
      )}
    </div>
  )
}
