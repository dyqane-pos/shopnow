'use client'
import { useTransition } from 'react'
import type { Order } from '@/lib/types'
import { fmt } from '@/lib/utils'
import { updateOrderStatus } from '@/actions/orders'

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
const statusLabel: Record<string, string> = {
  pending: 'Në pritje', processing: 'Duke procesuar', shipped: 'Dërguar',
  delivered: 'Dorëzuar', cancelled: 'Anuluar'
}

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const [, startTransition] = useTransition()

  return (
    <table className="admin-table-ay">
      <thead>
        <tr>
          <th>ID</th>
          <th>Klienti</th>
          <th>Total</th>
          <th>Data</th>
          <th>Statusi</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(o => (
          <tr key={o.id}>
            <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>#{o.id}</td>
            <td>{String(o.user_id).slice(0, 8)}…</td>
            <td style={{ fontWeight: 700 }}>{fmt(o.total)}</td>
            <td>{new Date(o.created_at).toLocaleDateString('sq-AL')}</td>
            <td>
              <select
                className="admin-select-ay"
                style={{ width: 'auto', padding: '4px 8px' }}
                value={o.status}
                onChange={e => {
                  const val = e.target.value
                  startTransition(() => { updateOrderStatus(o.id, val) })
                }}
              >
                {STATUSES.map(s => (
                  <option key={s} value={s}>{statusLabel[s]}</option>
                ))}
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
