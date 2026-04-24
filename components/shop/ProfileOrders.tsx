'use client'
import { useState } from 'react'
import Image from 'next/image'
import type { Order } from '@/lib/types'
import { fmt } from '@/lib/utils'

const statusClass: Record<string, string> = {
  pending: 'status-pending', processing: 'status-confirmed',
  shipped: 'status-shipped', delivered: 'status-delivered', cancelled: 'status-cancelled'
}
const statusLabel: Record<string, string> = {
  pending: 'Në pritje', processing: 'Duke procesuar', shipped: 'Dërguar',
  delivered: 'Dorëzuar', cancelled: 'Anuluar'
}

export default function ProfileOrders({ orders }: { orders: Order[] }) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  const toggle = (id: number) =>
    setExpanded(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {orders.map(o => (
        <div key={o.id} style={{ border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
          <div
            className="order-row-ay"
            style={{ cursor: 'pointer', marginBottom: 0 }}
            onClick={() => toggle(o.id)}
          >
            <div>
              <div style={{ fontWeight: 700, marginBottom: '2px' }}>#{o.id}</div>
              <div style={{ fontSize: '11px', color: '#888' }}>
                {new Date(o.created_at).toLocaleDateString('sq-AL')} · {Array.isArray(o.items) ? o.items.length : 0} artikuj
              </div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>{fmt(o.total)}</div>
                <span className={`status-pill-ay ${statusClass[o.status] ?? ''}`}>
                  {statusLabel[o.status] ?? o.status}
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#aaa' }}>{expanded.has(o.id) ? '▲' : '▼'}</span>
            </div>
          </div>

          {expanded.has(o.id) && Array.isArray(o.items) && o.items.length > 0 && (
            <div style={{ borderTop: '1px solid #f0f0ee', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px', background: '#fafaf9' }}>
              {o.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {item.photo_url ? (
                    <div style={{ position: 'relative', width: 48, height: 48, flexShrink: 0, borderRadius: 6, overflow: 'hidden' }}>
                      <Image src={item.photo_url} alt={item.name} fill sizes="48px" style={{ objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ width: 48, height: 48, background: '#eee', borderRadius: 6, flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, fontSize: '13px' }}>
                    <div style={{ fontWeight: 700 }}>{item.brand}</div>
                    <div style={{ color: '#555' }}>{item.name}</div>
                    {item.size && <div style={{ color: '#888', fontSize: '11px' }}>Madhësia: {item.size}</div>}
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '13px' }}>
                    <div style={{ color: '#888' }}>{item.qty} × {fmt(item.price)}</div>
                    <div style={{ fontWeight: 700 }}>{fmt(item.price * item.qty)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
