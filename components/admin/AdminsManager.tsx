'use client'
import { useFormState } from 'react-dom'
import { useTransition } from 'react'
import { createAdmin, toggleAdminRole } from '@/actions/admins'
import SubmitButton from '@/components/ui/SubmitButton'
import type { Profile } from '@/lib/types'

export default function AdminsManager({ admins }: { admins: Profile[] }) {
  const [state, action] = useFormState(createAdmin, null)
  const [, startTransition] = useTransition()

  return (
    <div>
      {/* Create form */}
      <div style={{ background: '#fff', border: '1px solid #e8e8e4', borderRadius: '8px', padding: '1.2rem', marginBottom: '1.5rem', maxWidth: '480px' }}>
        <div style={{ fontWeight: 800, fontSize: '13px', marginBottom: '1rem' }}>Krijo admin të ri</div>
        <form action={action}>
          <div className="admin-form-row-ay">
            <label className="admin-label-ay">Emri</label>
            <input name="name" required className="admin-input-ay" placeholder="Emri i plotë" />
          </div>
          <div className="admin-form-row-ay">
            <label className="admin-label-ay">Email</label>
            <input name="email" type="email" required className="admin-input-ay" placeholder="admin@shembull.com" />
          </div>
          <div className="admin-form-row-ay">
            <label className="admin-label-ay">Fjalëkalimi</label>
            <input name="password" type="password" required className="admin-input-ay" placeholder="Min. 8 karaktere" minLength={8} />
          </div>
          {state?.error && <div className="form-error-ay">{state.error}</div>}
          {state?.success && <div style={{ color: 'green', fontSize: '12px' }}>Admin u krijua me sukses!</div>}
          <SubmitButton label="Krijo admin" pendingLabel="Duke krijuar..." className="admin-btn-ay admin-btn-primary" style={{ marginTop: '.5rem' }} />
        </form>
      </div>

      {/* Admins list */}
      <table className="admin-table-ay">
        <thead>
          <tr>
            <th>Emri</th>
            <th>ID</th>
            <th>Roli</th>
            <th>Veprime</th>
          </tr>
        </thead>
        <tbody>
          {admins.map(a => (
            <tr key={a.id}>
              <td style={{ fontWeight: 600 }}>{a.name || '—'}</td>
              <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>{a.id.slice(0, 8)}…</td>
              <td>
                <span className={`status-pill-ay ${a.role === 'superadmin' ? 'status-delivered' : 'status-confirmed'}`}>
                  {a.role}
                </span>
              </td>
              <td>
                {a.role !== 'superadmin' && (
                  <button
                    className="admin-btn-ay admin-btn-ghost"
                    onClick={() => startTransition(() => { toggleAdminRole(a.id, a.role) })}
                  >
                    {a.role === 'admin' ? 'Hiq admin' : 'Bëj admin'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
