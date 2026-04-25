'use client'
import type { Product } from '@/lib/types'
import { fmt } from '@/lib/utils'
import Link from 'next/link'
import { useTransition } from 'react'
import { deleteProduct, toggleActive } from '@/actions/products'
import { useProductViewerCounts } from '@/hooks/useProductViewerCounts'

function DeleteButton({ id }: { id: number }) {
  const [pending, startTransition] = useTransition()
  return (
    <button
      disabled={pending}
      className="admin-btn-ay admin-btn-danger"
      onClick={() => {
        if (!confirm('Fshi produktin?')) return
        startTransition(() => { deleteProduct(id) })
      }}
    >
      {pending ? '...' : 'Fshi'}
    </button>
  )
}

function ToggleButton({ id, isActive }: { id: number; isActive: boolean }) {
  const [pending, startTransition] = useTransition()
  return (
    <button
      disabled={pending}
      className={`admin-btn-ay ${isActive ? 'admin-btn-ghost' : 'admin-btn-primary'}`}
      onClick={() => startTransition(() => { toggleActive(id, isActive) })}
    >
      {pending ? '...' : isActive ? 'Po' : 'Jo'}
    </button>
  )
}

export default function ProductTable({ products }: { products: Product[] }) {
  const viewerCounts = useProductViewerCounts()

  if (products.length === 0) {
    return <div className="empty-ay"><h3>Asnjë produkt</h3><p>Shto produktin e parë.</p></div>
  }

  return (
    <table className="admin-table-ay">
      <thead>
        <tr>
          <th>Produkti</th>
          <th>Çmimi</th>
          <th>Kategoria</th>
          <th>Live</th>
          <th>Aktiv</th>
          <th>Veprime</th>
        </tr>
      </thead>
      <tbody>
        {products.map(p => {
          const viewers = viewerCounts[p.id] ?? 0
          return (
            <tr key={p.id}>
              <td>
                <div style={{ fontWeight: 700 }}>{p.name}</div>
                <div style={{ color: '#888', fontSize: '11px' }}>{p.brand}</div>
              </td>
              <td>
                <span style={{ fontWeight: 700 }}>{fmt(p.price)}</span>
                {p.old_price && <span style={{ color: '#aaa', marginLeft: '6px', textDecoration: 'line-through' }}>{fmt(p.old_price)}</span>}
              </td>
              <td>{p.category}</td>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {viewers > 0 ? (
                    <span className="live-badge-ay">
                      <span className="live-dot-ay" />
                      {viewers} tani
                    </span>
                  ) : null}
                  <span style={{ color: '#888', fontSize: '11px' }}>
                    {p.views.toLocaleString('sq-AL')} gjithsej
                  </span>
                </div>
              </td>
              <td><ToggleButton id={p.id} isActive={p.is_active} /></td>
              <td style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <Link href={`/admin/products/${p.id}`} className="admin-btn-ay admin-btn-ghost">Ndrysho</Link>
                <DeleteButton id={p.id} />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
