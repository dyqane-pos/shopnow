import { createServiceSupabase } from '@/lib/supabase-server'
import AdminDashboard from '@/components/admin/Dashboard'
import type { Order } from '@/lib/types'

export default async function AdminDashboardPage() {
  const supabase = createServiceSupabase()
  const { data } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  return <AdminDashboard orders={(data ?? []) as Order[]} />
}
