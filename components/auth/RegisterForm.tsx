'use client'
import { useFormState } from 'react-dom'
import { register } from '@/actions/auth'
import SubmitButton from '@/components/ui/SubmitButton'

export default function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const [state, action] = useFormState(register, null)

  return (
    <form action={action}>
      <div className="form-group-ay">
        <label className="form-label-ay">Emri</label>
        <input name="name" type="text" required className="form-input-ay" placeholder="Emri juaj" />
      </div>
      <div className="form-group-ay">
        <label className="form-label-ay">Email</label>
        <input name="email" type="email" required className="form-input-ay" placeholder="ju@shembull.com" />
      </div>
      <div className="form-group-ay">
        <label className="form-label-ay">Fjalëkalimi</label>
        <input name="password" type="password" required className="form-input-ay" placeholder="Min. 6 karaktere" minLength={6} />
      </div>
      {state?.error && <div className="form-error-ay">{state.error}</div>}
      <SubmitButton label="Regjistrohu" pendingLabel="Duke u regjistruar..." className="submit-btn-ay" />
      <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '12px', color: '#888' }}>
        Ke llogari?{' '}
        <button type="button" onClick={onSwitch} style={{ color: '#1a1a1a', fontWeight: 700, textDecoration: 'underline' }}>
          Hyr
        </button>
      </div>
    </form>
  )
}
