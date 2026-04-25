'use client'
import { useState } from 'react'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'
import { useLang } from '@/context/LanguageContext'

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const { t } = useLang()

  return (
    <div className="auth-page-ay">
      <div className="auth-card-ay">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div className="logo-box-ay" style={{ display: 'inline-flex' }}>
            <span>SHOP</span><span className="logo-bold">NOW</span>
            <div className="logo-dot">°</div>
          </div>
        </div>

        <div className="auth-tabs-ay">
          <button className={`auth-tab-ay${tab === 'login' ? ' active' : ''}`} onClick={() => setTab('login')}>
            {t('authSignIn')}
          </button>
          <button className={`auth-tab-ay${tab === 'register' ? ' active' : ''}`} onClick={() => setTab('register')}>
            {t('authRegister')}
          </button>
        </div>

        {tab === 'login'
          ? <LoginForm onSwitch={() => setTab('register')} />
          : <RegisterForm onSwitch={() => setTab('login')} />
        }
      </div>
    </div>
  )
}
