'use client'
import { useFormState } from 'react-dom'
import { useState, useTransition } from 'react'
import type { Category } from '@/lib/types'
import { saveCategory, deleteCategory } from '@/actions/categories'
import SubmitButton from '@/components/ui/SubmitButton'

export default function CategoriesManager({ categories }: { categories: Category[] }) {
  const [state, action] = useFormState(saveCategory, null)
  const [editId, setEditId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const editing = categories.find(c => c.id === editId)

  return (
    <div>
      {/* Form */}
      <div style={{ background: '#fff', border: '1px solid #e8e8e4', borderRadius: '8px', padding: '1.2rem', marginBottom: '1.5rem', maxWidth: '480px' }}>
        <div style={{ fontWeight: 800, fontSize: '13px', marginBottom: '1rem' }}>
          {editId ? 'Ndrysho kategorinë' : 'Kategori e re'}
        </div>
        <form action={action}>
          {editId && <input type="hidden" name="id" value={editId} />}
          <div className="admin-form-row-ay">
            <label className="admin-label-ay">Emri</label>
            <input name="label" required className="admin-input-ay" defaultValue={editing?.label ?? ''} key={editId ?? 'new'} />
          </div>
          <div className="admin-form-row-ay">
            <label className="admin-label-ay">Tipi</label>
            <select name="type" className="admin-select-ay" defaultValue={editing?.type ?? 'product'}>
              <option value="product">Produkt</option>
              <option value="gender">Gjini</option>
              <option value="sidebar">Anëshirit</option>
            </select>
          </div>
          <div className="admin-form-row-ay">
            <label className="admin-label-ay">Rendi</label>
            <input name="sort_order" type="number" className="admin-input-ay" defaultValue={editing?.sort_order ?? 0} />
          </div>
          {state?.error && <div className="form-error-ay">{state.error}</div>}
          <div style={{ display: 'flex', gap: '8px', marginTop: '.5rem' }}>
            <SubmitButton label={editId ? 'Ruaj' : 'Krijo'} pendingLabel="Duke ruajtur..." className="admin-btn-ay admin-btn-primary" />
            {editId && (
              <button type="button" className="admin-btn-ay admin-btn-ghost" onClick={() => setEditId(null)}>
                Anulo
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table */}
      <table className="admin-table-ay">
        <thead>
          <tr>
            <th>Emri</th>
            <th>Tipi</th>
            <th>Rendi</th>
            <th>Veprime</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(c => (
            <tr key={c.id}>
              <td style={{ fontWeight: 600 }}>{c.label}</td>
              <td>{c.type}</td>
              <td>{c.sort_order}</td>
              <td style={{ display: 'flex', gap: '6px' }}>
                <button className="admin-btn-ay admin-btn-ghost" onClick={() => setEditId(c.id)}>Ndrysho</button>
                <form action={async (fd: FormData) => { await deleteCategory(c.id) }}>
                  <button type="submit" className="admin-btn-ay admin-btn-danger"
                    onClick={e => { if (!confirm('Fshi kategorinë?')) e.preventDefault() }}>
                    Fshi
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
