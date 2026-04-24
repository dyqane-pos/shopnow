'use client'
import type { Order } from '@/lib/types'
import { fmt } from '@/lib/utils'

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  pending:    { label: 'Në pritje',      color: '#f57f17', bg: '#fff8e1' },
  processing: { label: 'Duke procesuar', color: '#1565c0', bg: '#e3f2fd' },
  shipped:    { label: 'Dërguar',        color: '#6a1b9a', bg: '#f3e5f5' },
  delivered:  { label: 'Dorëzuar',       color: '#2e7d32', bg: '#e8f5e9' },
  cancelled:  { label: 'Anuluar',        color: '#c62828', bg: '#ffebee' },
}

function computeStats(orders: Order[]) {
  const now = new Date()
  const today = now.toISOString().slice(0, 10)
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const monthStart = `${y}-${m}-01`

  const byStatus = { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 }
  let totalRevenue = 0, todayOrders = 0, todayRevenue = 0, monthOrders = 0, monthRevenue = 0
  const productMap: Record<string, { name: string; brand: string; qty: number; revenue: number }> = {}

  for (const o of orders) {
    if (o.status in byStatus) byStatus[o.status as keyof typeof byStatus]++
    totalRevenue += o.total
    const d = o.created_at.slice(0, 10)
    if (d === today) { todayOrders++; todayRevenue += o.total }
    if (d >= monthStart) { monthOrders++; monthRevenue += o.total }
    if (Array.isArray(o.items)) {
      for (const item of o.items) {
        const k = String(item.product_id)
        if (!productMap[k]) productMap[k] = { name: item.name, brand: item.brand, qty: 0, revenue: 0 }
        productMap[k].qty += item.qty
        productMap[k].revenue += item.price * item.qty
      }
    }
  }

  const topProducts = Object.values(productMap).sort((a, b) => b.qty - a.qty).slice(0, 5)
  return { totalOrders: orders.length, totalRevenue, todayOrders, todayRevenue, monthOrders, monthRevenue, byStatus, topProducts }
}

export default function AdminDashboard({ orders }: { orders: Order[] }) {
  const s = computeStats(orders)

  return (
    <div>
      <h1 className="admin-h1-ay">Dashboard</h1>

      {/* KPI karta */}
      <div className="dash-kpi-row-ay">
        <div className="dash-kpi-ay">
          <div className="dash-kpi-label-ay">Porosi totale</div>
          <div className="dash-kpi-value-ay">{s.totalOrders}</div>
          <div className="dash-kpi-sub-ay">të gjitha kohërat</div>
        </div>
        <div className="dash-kpi-ay">
          <div className="dash-kpi-label-ay">Revenue totale</div>
          <div className="dash-kpi-value-ay">{fmt(s.totalRevenue)}</div>
          <div className="dash-kpi-sub-ay">të gjitha kohërat</div>
        </div>
        <div className="dash-kpi-ay">
          <div className="dash-kpi-label-ay">Sot</div>
          <div className="dash-kpi-value-ay">{s.todayOrders}</div>
          <div className="dash-kpi-sub-ay">{fmt(s.todayRevenue)} revenue</div>
        </div>
        <div className="dash-kpi-ay">
          <div className="dash-kpi-label-ay">Ky muaj</div>
          <div className="dash-kpi-value-ay">{s.monthOrders}</div>
          <div className="dash-kpi-sub-ay">{fmt(s.monthRevenue)} revenue</div>
        </div>
      </div>

      {/* Status breakdown */}
      <div className="dash-section-ay">
        <div className="dash-section-title-ay">Sipas statusit</div>
        <div className="dash-status-row-ay">
          {Object.entries(STATUS_META).map(([key, meta]) => (
            <div key={key} className="dash-status-chip-ay" style={{ background: meta.bg }}>
              <span className="dash-status-count-ay" style={{ color: meta.color }}>
                {s.byStatus[key as keyof typeof s.byStatus]}
              </span>
              <span className="dash-status-lbl-ay" style={{ color: meta.color }}>{meta.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top produktet */}
      {s.topProducts.length > 0 && (
        <div className="dash-section-ay">
          <div className="dash-section-title-ay">Top 5 produktet</div>
          <table className="admin-table-ay">
            <thead>
              <tr>
                <th>#</th>
                <th>Produkti</th>
                <th>Copë shitur</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {s.topProducts.map((p, i) => (
                <tr key={i}>
                  <td style={{ color: '#aaa', fontWeight: 800, fontFamily: 'monospace' }}>{i + 1}</td>
                  <td><span style={{ fontWeight: 700 }}>{p.brand}</span> — {p.name}</td>
                  <td>{p.qty} copë</td>
                  <td style={{ fontWeight: 700 }}>{fmt(p.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {orders.length === 0 && (
        <div className="empty-ay" style={{ marginTop: '3rem' }}>
          <h3>Nuk ka të dhëna ende</h3>
          <p>Porositë do të shfaqen këtu pasi klientët të bëjnë blerje.</p>
        </div>
      )}
    </div>
  )
}
