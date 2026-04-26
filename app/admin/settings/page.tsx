import { getSetting, saveSetting } from '@/actions/settings'
import { DEFAULT_EUR_TO_ALL } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export default async function AdminSettingsPage() {
  const currentRate = await getSetting('eur_to_all') ?? String(DEFAULT_EUR_TO_ALL)

  async function updateRate(formData: FormData) {
    'use server'
    const val = formData.get('eur_to_all') as string
    const num = parseFloat(val)
    if (!num || num <= 0) return
    await saveSetting('eur_to_all', String(num))
    revalidatePath('/admin/settings')
  }

  return (
    <div>
      <h1 className="admin-h1-ay" style={{ marginBottom: '1.5rem' }}>Cilësimet</h1>

      <div className="admin-form-ay">
        <div style={{
          background: '#fff',
          border: '1.5px solid #e8e8e4',
          borderRadius: '10px',
          padding: '1.5rem',
          marginBottom: '1rem',
        }}>
          <h2 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '1rem', color: '#1a1a1a' }}>
            Kursi i Këmbimit
          </h2>

          <form action={updateRate}>
            <div className="admin-form-row-ay">
              <label className="admin-label-ay">1 € = ? Lekë (ALL)</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  name="eur_to_all"
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  defaultValue={currentRate}
                  className="admin-input-ay"
                  style={{ maxWidth: '160px' }}
                  placeholder="p.sh. 123"
                />
                <span style={{ fontSize: '13px', color: '#888', fontWeight: 600 }}>ALL / L</span>
              </div>
              <p style={{ fontSize: '11px', color: '#aaa', marginTop: '6px' }}>
                Kursi aktual: <strong>1 € = {currentRate} L</strong> · Ndryshimi bëhet menjëherë në të gjitha çmimet.
              </p>
            </div>

            <button type="submit" className="admin-btn-ay admin-btn-primary" style={{ marginTop: '4px' }}>
              Ruaj kursin
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
