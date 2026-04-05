import { createServerSupabase } from '@/lib/supabase-server'

export default async function DebugPage() {
  let userEmail = 'NULL - jo i kyçur në server'
  let userId = ''
  let profile = null as { role: string } | null
  let envOk = {
    url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    anon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    service: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  }

  try {
    const supabase = createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      userEmail = user.email ?? 'pa email'
      userId = user.id
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
      profile = data
    }
  } catch (e) {
    userEmail = 'GABIM: ' + String(e)
  }

  return (
    <div style={{ fontFamily: 'monospace', padding: '2rem', fontSize: '14px' }}>
      <h2>Debug Auth</h2>
      <p><b>ENV vars:</b></p>
      <ul>
        <li>SUPABASE_URL: {envOk.url ? '✅' : '❌ MUNGON'}</li>
        <li>ANON_KEY: {envOk.anon ? '✅' : '❌ MUNGON'}</li>
        <li>SERVICE_KEY: {envOk.service ? '✅' : '❌ MUNGON'}</li>
      </ul>
      <p><b>Server-side user:</b> {userEmail}</p>
      <p><b>User ID:</b> {userId || 'asnjë'}</p>
      <p><b>Profile role:</b> {profile ? profile.role : 'NULL (nuk u gjet)'}</p>
    </div>
  )
}
