'use client'
import { useTransition, useState, useRef } from 'react'
import { useFormState } from 'react-dom'
import { setUserRole, deleteUser, createUser } from '@/actions/users'
import { ini } from '@/lib/utils'

interface UserRow {
  id: string
  name: string
  email: string
  role: 'user' | 'admin' | 'superadmin'
  created_at: string
}

const ROLES: UserRow['role'][] = ['user', 'admin', 'superadmin']
const roleLabel: Record<string, string> = { user: 'Përdorues', admin: 'Admin', superadmin: 'Super Admin' }

function CreateUserModal({ onClose }: { onClose: () => void }) {
  const [state, action] = useFormState(createUser, null)
  const [pending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  if (state?.success) {
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#fff', borderRadius: 10, padding: '2rem',
        width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '18px', fontWeight: 800 }}>Shto Përdorues të Ri</h2>
        <form ref={formRef} action={(fd) => startTransition(() => action(fd))}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="admin-label-ay">Emri</label>
              <input name="name" className="admin-input-ay" placeholder="Emri Mbiemri" required />
            </div>
            <div>
              <label className="admin-label-ay">Email</label>
              <input name="email" type="email" className="admin-input-ay" placeholder="email@shembull.com" required />
            </div>
            <div>
              <label className="admin-label-ay">Fjalëkalimi</label>
              <input name="password" type="password" className="admin-input-ay" placeholder="Min. 6 karaktere" required />
            </div>
            <div>
              <label className="admin-label-ay">Roli</label>
              <select name="role" className="admin-select-ay">
                <option value="user">Përdorues</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
            {state?.error && (
              <div style={{ color: '#dc2626', fontSize: '13px', padding: '8px 12px', background: '#fef2f2', borderRadius: 6 }}>
                {state.error}
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" onClick={onClose} className="admin-btn-ay admin-btn-ghost">
                Anulo
              </button>
              <button type="submit" disabled={pending} className="admin-btn-ay admin-btn-primary">
                {pending ? 'Duke krijuar...' : 'Krijo llogarinë'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function UsersTable({ users, isSuperadmin }: { users: UserRow[]; isSuperadmin: boolean }) {
  const [, startTransition] = useTransition()
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
        <input
          className="admin-input-ay"
          style={{ maxWidth: 300, flex: 1 }}
          placeholder="Kërko sipas emrit ose emailit..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {isSuperadmin && (
          <button className="admin-btn-ay admin-btn-primary" onClick={() => setShowCreate(true)}>
            + Shto Përdorues
          </button>
        )}
      </div>

      <table className="admin-table-ay">
        <thead>
          <tr>
            <th>Përdoruesi</th>
            <th>Email</th>
            <th>Roli</th>
            <th>Regjistruar</th>
            {isSuperadmin && <th>Veprime</th>}
          </tr>
        </thead>
        <tbody>
          {filtered.map(u => (
            <tr key={u.id}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="avatar-ay" style={{ width: 30, height: 30, fontSize: 11 }}>
                    {ini(u.name)}
                  </div>
                  <span style={{ fontWeight: 600 }}>{u.name}</span>
                </div>
              </td>
              <td style={{ color: '#888' }}>{u.email}</td>
              <td>
                {isSuperadmin ? (
                  <select
                    className="admin-select-ay"
                    style={{ width: 'auto', padding: '4px 8px', fontSize: '12px' }}
                    value={u.role}
                    onChange={e => {
                      const role = e.target.value as UserRow['role']
                      startTransition(() => { setUserRole(u.id, role) })
                    }}
                  >
                    {ROLES.map(r => (
                      <option key={r} value={r}>{roleLabel[r]}</option>
                    ))}
                  </select>
                ) : (
                  <span>{roleLabel[u.role]}</span>
                )}
              </td>
              <td style={{ color: '#888', fontSize: '11px' }}>
                {new Date(u.created_at).toLocaleDateString('sq-AL')}
              </td>
              {isSuperadmin && (
                <td>
                  <button
                    className="admin-btn-ay admin-btn-danger"
                    onClick={() => {
                      if (!confirm(`Fshi llogarinë e ${u.name}?`)) return
                      startTransition(() => { deleteUser(u.id) })
                    }}
                  >
                    Fshi
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <div className="empty-ay" style={{ padding: '2rem' }}>
          <h3>Asnjë rezultat</h3>
        </div>
      )}

      {showCreate && <CreateUserModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}
