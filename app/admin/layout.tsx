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

// Emails që kanë akses admin gjithmonë (backup nëse profiles DB dështon)
const ADMIN_EMAILS = ['sh.kuka@gmail.com']

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let isAdmin = false

  try {
    const supabase = createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // 1. Kontrollo email direkt (fallback i sigurt)
    if (user.email && ADMIN_EMAILS.includes(user.email)) {
      isAdmin = true
    }

    // 2. Provo profiles tabelën
    if (!isAdmin) {
      const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user.id).maybeSingle()
      if (profile && ['admin', 'superadmin'].includes(profile.role ?? '')) {
        isAdmin = true
      }
    }

    // 3. Provo user_metadata (vendoset nga trigger)
    if (!isAdmin) {
      const metaRole = user.user_metadata?.role as string | undefined
      if (metaRole && ['admin', 'superadmin'].includes(metaRole)) {
        isAdmin = true
      }
    }
  } catch (e: unknown) {
    const err = e as { digest?: string }
    if (err?.digest?.startsWith('NEXT_REDIRECT')) throw e
  }

  if (!isAdmin) redirect('/login')

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
