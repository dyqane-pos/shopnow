import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase-server'
import Link from 'next/link'

const navLinks = [
  { href: '/admin/products', label: 'Produktet' },
  { href: '/admin/orders', label: 'Porositë' },
  { href: '/admin/users', label: 'Përdoruesit' },
  { href: '/admin/categories', label: 'Kategoritë' },
  { href: '/admin/admins', label: 'Adminët' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    const supabase = createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (!profile || !['admin', 'superadmin'].includes(profile.role)) redirect('/')
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ''
    if (msg.includes('NEXT_REDIRECT')) throw e
    redirect('/login')
  }

  return (
    <div className="admin-shell-ay">
      <nav className="admin-nav-ay">
        <div className="admin-nav-title-ay">
          <Link href="/" style={{ color: '#fff', fontWeight: 900, fontSize: '13px' }}>SHOPNOW°</Link>
          <div style={{ marginTop: '4px' }}>Admin Panel</div>
        </div>
        {navLinks.map(l => (
          <Link key={l.href} href={l.href} className="admin-nav-link-ay">{l.label}</Link>
        ))}
        <div style={{ borderTop: '1px solid #2a2a2a', marginTop: '1rem', paddingTop: '1rem' }}>
          <Link href="/" className="admin-nav-link-ay">← Kthehu te dyqani</Link>
        </div>
      </nav>
      <div className="admin-content-ay">{children}</div>
    </div>
  )
}
