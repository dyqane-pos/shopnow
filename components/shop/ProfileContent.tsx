'use client'
import { useLang } from '@/context/LanguageContext'
import { ini } from '@/lib/utils'
import type { Order } from '@/lib/types'
import ProfileOrders from './ProfileOrders'

interface Props {
  name: string
  email: string
  orders: Order[]
}

export default function ProfileContent({ name, email, orders }: Props) {
  const { t } = useLang()

  return (
    <div className="profile-page-ay">
      <div className="profile-hero-ay">
        <div className="avatar-ay">{ini(name)}</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '16px' }}>{name}</div>
          <div style={{ color: '#888', fontSize: '12px' }}>{email}</div>
        </div>
      </div>

      <h2 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '1rem' }}>{t('profileMyOrders')}</h2>

      {!orders.length ? (
        <div className="empty-ay">
          <h3>{t('profileNoOrders')}</h3>
          <p>{t('profileNoOrdersSub')}</p>
        </div>
      ) : (
        <ProfileOrders orders={orders} />
      )}
    </div>
  )
}
