import type { Product } from '@/lib/types'
import { fmt } from '@/lib/utils'
import Link from 'next/link'
import { deleteProduct, toggleActive } from '@/actions/products'

export default function ProductTable({ products }: { products: Product[] }) {
  return (
    <table className="admin-table-ay">
      <thead>
        <tr>
          <th>Produkti</th>
          <th>Çmimi</th>
          <th>Kategoria</th>
          <th>Aktiv</th>
          <th>Veprime</th>
        </tr>
      </thead>
      <tbody>
        {products.map(p => (
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
              <form action={async () => { 'use server'; await toggleActive(p.id, p.is_active) }}>
                <button type="submit" className={`admin-btn-ay ${p.is_active ? 'admin-btn-ghost' : 'admin-btn-primary'}`}>
                  {p.is_active ? 'Po' : 'Jo'}
                </button>
              </form>
            </td>
            <td style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <Link href={`/admin/products/${p.id}`} className="admin-btn-ay admin-btn-ghost">Ndrysho</Link>
              <form action={async () => { 'use server'; await deleteProduct(p.id) }}>
                <button type="submit" className="admin-btn-ay admin-btn-danger"
                  onClick={e => { if (!confirm('Fshi produktin?')) e.preventDefault() }}>
                  Fshi
                </button>
              </form>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
