'use client'
import { useLang } from '@/context/LanguageContext'

export default function LangSwitch() {
  const { lang, setLang } = useLang()
  return (
    <button
      onClick={() => setLang(lang === 'sq' ? 'en' : 'sq')}
      className="lang-switch-ay"
      title={lang === 'sq' ? 'Switch to English' : 'Kalo në Shqip'}
    >
      {lang === 'sq' ? 'EN' : 'SQ'}
    </button>
  )
}
