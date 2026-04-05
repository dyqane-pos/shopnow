import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase-server'
import LoginPage from './LoginPage'

export default async function Page() {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/')
  return <LoginPage />
}
