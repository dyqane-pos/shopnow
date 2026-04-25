'use client'
import { useLang } from '@/context/LanguageContext'

export default function InfoBar() {
  const { t } = useLang()
  return (
    <div className="infobar-ay">
      <span>{t('infoShipping')}</span>
      <span>{t('infoReturns')}</span>
      <span>{t('infoSecure')}</span>
    </div>
  )
}
