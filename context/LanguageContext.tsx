'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '@/lib/i18n'
import type { Lang, TKey } from '@/lib/i18n'

interface LangContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: TKey) => string
}

const LangContext = createContext<LangContextValue>({
  lang: 'sq',
  setLang: () => {},
  t: (key) => translations.sq[key],
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('sq')

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang | null
    if (saved === 'sq' || saved === 'en') setLangState(saved)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('lang', l)
    document.documentElement.lang = l
  }

  const t = (key: TKey): string => translations[lang][key]

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}
