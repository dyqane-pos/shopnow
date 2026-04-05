'use client'
import { useTransition, useState } from 'react'
import { setUserRole, deleteUser } from '@/actions/users'
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
const roleClass: Record<string, string> = {
  user: '', admin: 'status-confirmed', superadmin: 'status-delivered'
}

export default function UsersTable({ users, isSuperadmin }: { users: UserRow[]; isSuperadmin: boolean }) {
  const [, startTransition] = useTransition()
  const [search, setSearch] = useState('')

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          className="admin-input-ay"
          style={{ maxWidth: 320 }}
          placeholder="Kërko sipas emrit ose emailit..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
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
                  <span className={`status-pill-ay ${roleClass[u.role]}`}>
                    {roleLabel[u.role]}
                  </span>
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
                      if (!confirm(`Fshi llogarinë e ${u.name}? Ky veprim nuk mund të kthehet.`)) return
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
    </div>
  )
}
