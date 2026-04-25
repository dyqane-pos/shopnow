'use client'
import { useFormState } from 'react-dom'
import { login } from '@/actions/auth'
import SubmitButton from '@/components/ui/SubmitButton'
import { useLang } from '@/context/LanguageContext'

export default function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const [state, action] = useFormState(login, null)
  const { t } = useLang()

  return (
    <form action={action}>
      <div className="form-group-ay">
        <label className="form-label-ay">Email</label>
        <input name="email" type="email" required className="form-input-ay" placeholder={t('authEmailPh')} />
      </div>
      <div className="form-group-ay">
        <label className="form-label-ay">{t('authPassword')}</label>
        <input name="password" type="password" required className="form-input-ay" placeholder="••••••••" />
      </div>
      {state?.error && <div className="form-error-ay">{state.error}</div>}
      <SubmitButton label={t('authSignIn')} pendingLabel={t('authSigningIn')} className="submit-btn-ay" />
      <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '12px', color: '#888' }}>
        {t('authNoAccount')}{' '}
        <button type="button" onClick={onSwitch} style={{ color: '#1a1a1a', fontWeight: 700, textDecoration: 'underline' }}>
          {t('authRegister')}
        </button>
      </div>
    </form>
  )
}
