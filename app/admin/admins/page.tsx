import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminsManager from '@/components/admin/AdminsManager'
import type { Profile } from '@/lib/types'

export default async function AdminAdminsPage() {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: me } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (me?.role !== 'superadmin') {
    return (
      <div>
        <h1 className="admin-h1-ay">Adminët</h1>
        <div className="empty-ay"><h3>Vetëm superadmin mund ta aksesojë këtë faqe.</h3></div>
      </div>
    )
  }

  const { data } = await supabase.from('profiles').select('*').in('role', ['admin', 'superadmin']).order('created_at')
  const admins: Profile[] = data ?? []

  return (
    <div>
      <h1 className="admin-h1-ay">Adminët ({admins.length})</h1>
      <AdminsManager admins={admins} />
    </div>
  )
}
