import { createServerSupabase, createServiceSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import UsersTable from '@/components/admin/UsersTable'

export default async function AdminUsersPage() {
  let users: { id: string; name: string; email: string; role: 'user' | 'admin' | 'superadmin'; created_at: string }[] = []
  let isSuperadmin = false

  try {
    const supabase = createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: me } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (!me || !['admin', 'superadmin'].includes(me.role)) redirect('/')

    isSuperadmin = me.role === 'superadmin'

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name, role, created_at')
      .order('created_at', { ascending: false })

    const emailMap: Record<string, string> = {}
    try {
      const service = createServiceSupabase()
      const { data: authData } = await service.auth.admin.listUsers({ perPage: 1000 })
      authData?.users?.forEach(u => { emailMap[u.id] = u.email ?? '' })
    } catch {}

    users = (profiles ?? []).map(p => ({
      id: p.id,
      name: p.name,
      email: emailMap[p.id] ?? '—',
      role: p.role as 'user' | 'admin' | 'superadmin',
      created_at: p.created_at,
    }))
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ''
    if (msg.includes('NEXT_REDIRECT')) throw e
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <h1 className="admin-h1-ay" style={{ margin: 0 }}>Përdoruesit ({users.length})</h1>
      </div>

      {!isSuperadmin && (
        <div style={{ marginBottom: '1rem', padding: '10px 14px', background: '#fff3cd', borderRadius: '6px', fontSize: '12px', color: '#856404' }}>
          Vetëm superadmin mund të ndryshojë rolet ose të fshijë llogaritë.
        </div>
      )}

      <UsersTable users={users} isSuperadmin={isSuperadmin} />
    </div>
  )
}
