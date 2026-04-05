'use client'
import { useFormState } from 'react-dom'
import { useState } from 'react'
import { login } from '@/actions/auth'
import SubmitButton from '@/components/ui/SubmitButton'

export default function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const [state, action] = useFormState(login, null)

  return (
    <form action={action}>
      <div className="form-group-ay">
        <label className="form-label-ay">Email</label>
        <input name="email" type="email" required className="form-input-ay" placeholder="ju@shembull.com" />
      </div>
      <div className="form-group-ay">
        <label className="form-label-ay">Fjalëkalimi</label>
        <input name="password" type="password" required className="form-input-ay" placeholder="••••••••" />
      </div>
      {state?.error && <div className="form-error-ay">{state.error}</div>}
      <SubmitButton label="Hyr" pendingLabel="Duke hyrë..." className="submit-btn-ay" />
      <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '12px', color: '#888' }}>
        Nuk ke llogari?{' '}
        <button type="button" onClick={onSwitch} style={{ color: '#1a1a1a', fontWeight: 700, textDecoration: 'underline' }}>
          Regjistrohu
        </button>
      </div>
    </form>
  )
}
