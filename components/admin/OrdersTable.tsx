'use client'
import React, { useTransition, useState, useMemo } from 'react'
import Image from 'next/image'
import type { Order } from '@/lib/types'
import { fmt } from '@/lib/utils'
import { updateOrderStatus } from '@/actions/orders'

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
const statusLabel: Record<string, string> = {
  pending: 'Në pritje', processing: 'Duke procesuar', shipped: 'Dërguar',
  delivered: 'Dorëzuar', cancelled: 'Anuluar',
}
const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
  pending:    { bg: '#fff8e1', color: '#f57f17' },
  processing: { bg: '#e3f2fd', color: '#1565c0' },
  shipped:    { bg: '#f3e5f5', color: '#6a1b9a' },
  delivered:  { bg: '#e8f5e9', color: '#2e7d32' },
  cancelled:  { bg: '#ffebee', color: '#c62828' },
}

function exportCSV(orders: Order[], userMap: Record<string, string>) {
  const rows = [
    ['ID', 'Klienti', 'Telefon', 'Adresa', 'Qyteti', 'Total', 'Pagesa', 'Statusi', 'Data', 'Artikujt'],
    ...orders.map(o => [
      `#${o.id}`,
      o.user_id ? (userMap[o.user_id] || o.user_id) : (o.delivery_info?.name || 'Mysafir'),
      o.delivery_info?.phone || '',
      o.delivery_info?.address || '',
      o.delivery_info?.city || '',
      o.total.toFixed(2),
      o.payment_method === 'card' ? 'Kartë' : 'Cash',
      statusLabel[o.status] || o.status,
      new Date(o.created_at).toLocaleDateString('sq-AL'),
      Array.isArray(o.items)
        ? o.items.map(i => `${i.brand} ${i.name}${i.size ? ' /' + i.size : ''} x${i.qty}`).join(' | ')
        : '',
    ]),
  ]
  const csv = rows
    .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `porosi-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function OrdersTable({ orders, userMap }: { orders: Order[]; userMap: Record<string, string> }) {
  const [, startTransition] = useTransition()
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [search, setSearch] = useState('')

  const toggle = (id: number) =>
    setExpanded(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length }
    for (const st of STATUSES) c[st] = orders.filter(o => o.status === st).length
    return c
  }, [orders])

  const filtered = useMemo(() => {
    let r = orders
    if (filterStatus !== 'all') r = r.filter(o => o.status === filterStatus)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      r = r.filter(o => {
        const name = (o.user_id ? (userMap[o.user_id] || o.user_id) : (o.delivery_info?.name || 'Mysafir')).toLowerCase()
        return name.includes(q) || String(o.id).includes(q) ||
          (o.delivery_info?.name || '').toLowerCase().includes(q) ||
          (o.delivery_info?.city || '').toLowerCase().includes(q)
      })
    }
    return r
  }, [orders, filterStatus, search, userMap])

  const printDate = new Date().toLocaleDateString('sq-AL')
  const printTitle = filterStatus !== 'all' ? statusLabel[filterStatus] : 'Të gjitha statuset'

  return (
    <div>
      {/* Toolbar — fshihet gjatë printimit */}
      <div className="orders-toolbar-ay no-print-ay">
        <div className="orders-tabs-ay">
          {['all', ...STATUSES].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`orders-tab-ay${filterStatus === st ? ' orders-tab-active-ay' : ''}`}
            >
              {st === 'all' ? 'Të gjitha' : statusLabel[st]}
              <span className="orders-tab-count-ay">{counts[st] ?? 0}</span>
            </button>
          ))}
        </div>
        <div className="orders-actions-ay">
          <input
            type="search"
            placeholder="Kërko klient / ID / qytet..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="admin-input-ay"
            style={{ width: 220, padding: '6px 10px', fontSize: '12px' }}
          />
          <button
            className="admin-btn-ay admin-btn-ghost"
            onClick={() => exportCSV(filtered, userMap)}
            title="Eksporto si CSV"
          >
            ↓ CSV
          </button>
          <button
            className="admin-btn-ay admin-btn-ghost"
            onClick={() => window.print()}
            title="Printo / Ruaj si PDF"
          >
            ⎙ Print / PDF
          </button>
        </div>
      </div>

      {/* Header i printueshëm — i fshehur në ekran */}
      <div className="print-header-ay">
        <div style={{ fontWeight: 900, fontSize: '16px', letterSpacing: 1 }}>SHOPNOW° — Raporti i Porosive</div>
        <div style={{ marginTop: 4, fontSize: '12px', color: '#555' }}>
          Gjeneruar: {printDate} &nbsp;·&nbsp; {printTitle} &nbsp;·&nbsp; {filtered.length} porosi
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-ay no-print-ay"><h3>Nuk ka porosi</h3></div>
      ) : (
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
            {filtered.map(o => (
              <React.Fragment key={o.id}>
                <tr>
                  <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>#{o.id}</td>
                  <td style={{ fontWeight: 600 }}>
                    <div>
                      {o.user_id
                        ? (userMap[o.user_id] || String(o.user_id).slice(0, 8) + '…')
                        : <span style={{ color: '#888', fontStyle: 'italic' }}>👤 {o.delivery_info?.name || 'Mysafir'}</span>
                      }
                    </div>
                    {o.delivery_info && (
                      <div style={{ fontSize: '11px', color: '#888', fontWeight: 400 }}>
                        {o.delivery_info.phone}
                      </div>
                    )}
                  </td>
                  <td>
                    {/* Ekran: toggle buton */}
                    <button
                      onClick={() => toggle(o.id)}
                      className="no-print-ay"
                      style={{ fontSize: '12px', fontWeight: 600, color: '#555', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      {Array.isArray(o.items) ? o.items.length : 0} artikuj {expanded.has(o.id) ? '▲' : '▼'}
                    </button>
                    {/* Print: lista e artikujve */}
                    <span className="print-only-ay" style={{ fontSize: '10px' }}>
                      {Array.isArray(o.items)
                        ? o.items.map(i => `${i.name}${i.size ? '/' + i.size : ''} ×${i.qty}`).join(', ')
                        : '—'}
                    </span>
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
                    {/* Ekran: select ndryshim statusi */}
                    <span className="no-print-ay" style={{ display: 'inline-block' }}>
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
                    </span>
                    {/* Print: badge statusi */}
                    <span
                      className="print-only-ay"
                      style={{
                        fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: 999,
                        background: STATUS_COLOR[o.status]?.bg || '#eee',
                        color: STATUS_COLOR[o.status]?.color || '#333',
                      }}
                    >
                      {statusLabel[o.status]}
                    </span>
                  </td>
                </tr>

                {/* Detajet e zgjeruara (ekran) */}
                {expanded.has(o.id) && Array.isArray(o.items) && o.items.length > 0 && (
                  <tr className="no-print-ay">
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
      )}
    </div>
  )
}
