'use client'
import React, { useTransition, useState } from 'react'
import Image from 'next/image'
import type { Order } from '@/lib/types'
import { fmt } from '@/lib/utils'
import { updateOrderStatus } from '@/actions/orders'

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
const statusLabel: Record<string, string> = {
  pending: 'Në pritje', processing: 'Duke procesuar', shipped: 'Dërguar',
  delivered: 'Dorëzuar', cancelled: 'Anuluar'
}

export default function OrdersTable({ orders, userMap }: { orders: Order[]; userMap: Record<string, string> }) {
  const [, startTransition] = useTransition()
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  const toggle = (id: number) =>
    setExpanded(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  return (
    <table className="admin-table-ay">
      <thead>
        <tr>
          <th>ID</th>
          <th>Klienti</th>
          <th>Artikuj</th>
          <th>Total</th>
          <th>Pagesa</th>
          <th>Data</th>
          <th>Statusi</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(o => (
          <React.Fragment key={o.id}>
            <tr>
              <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>#{o.id}</td>
              <td style={{ fontWeight: 600 }}>{userMap[o.user_id] || String(o.user_id).slice(0, 8) + '…'}</td>
              <td>
                <button
                  onClick={() => toggle(o.id)}
                  style={{ fontSize: '12px', fontWeight: 600, color: '#555', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  {Array.isArray(o.items) ? o.items.length : 0} artikuj {expanded.has(o.id) ? '▲' : '▼'}
                </button>
              </td>
              <td style={{ fontWeight: 700 }}>{fmt(o.total)}</td>
              <td>
                <span style={{
                  fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                  background: o.payment_method === 'card' ? '#e8f5e9' : '#fff8e1',
                  color: o.payment_method === 'card' ? '#2e7d32' : '#f57f17',
                }}>
                  {o.payment_method === 'card' ? '💳 Kartë' : '💵 Cash'}
                </span>
              </td>
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
            {expanded.has(o.id) && Array.isArray(o.items) && o.items.length > 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '0 12px 12px', background: '#fafaf9' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px' }}>
                    {o.delivery_info && (
                      <div style={{ fontSize: '12px', color: '#666', padding: '8px 10px', background: '#f5f5f3', borderRadius: 6, marginBottom: '4px' }}>
                        📍 <strong>{o.delivery_info.name}</strong> · {o.delivery_info.phone} · {o.delivery_info.address}, {o.delivery_info.city}
                      </div>
                    )}
                    {o.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                        {item.photo_url ? (
                          <div style={{ position: 'relative', width: 40, height: 40, flexShrink: 0, borderRadius: 4, overflow: 'hidden' }}>
                            <Image src={item.photo_url} alt={item.name} fill sizes="40px" style={{ objectFit: 'cover' }} />
                          </div>
                        ) : (
                          <div style={{ width: 40, height: 40, background: '#eee', borderRadius: 4, flexShrink: 0 }} />
                        )}
                        <div style={{ flex: 1 }}>
                          <span style={{ fontWeight: 700 }}>{item.brand}</span> — {item.name}
                          {item.size && <span style={{ color: '#888', marginLeft: 6 }}>/ {item.size}</span>}
                        </div>
                        <div style={{ whiteSpace: 'nowrap', color: '#555' }}>
                          {item.qty} × {fmt(item.price)}
                        </div>
                        <div style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                          {fmt(item.price * item.qty)}
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  )
}
