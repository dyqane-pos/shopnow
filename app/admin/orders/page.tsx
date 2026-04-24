import { createServiceSupabase } from '@/lib/supabase-server'
import OrdersTable from '@/components/admin/OrdersTable'
import type { Order } from '@/lib/types'

export default async function AdminOrdersPage() {
  let orders: Order[] = []
  let userMap: Record<string, string> = {}

  try {
    const supabase = createServiceSupabase()
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    orders = data ?? []

    if (orders.length > 0) {
      const userIds = [...new Set(orders.map(o => o.user_id))]
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', userIds)
      profiles?.forEach((p: { id: string; name: string }) => { userMap[p.id] = p.name })
    }
  } catch {}

  return (
    <div>
      <h1 className="admin-h1-ay">Porositë ({orders.length})</h1>
      {orders.length === 0 ? (
        <div className="empty-ay"><h3>Asnjë porosi</h3></div>
      ) : (
        <OrdersTable orders={orders} userMap={userMap} />
      )}
    </div>
  )
}
