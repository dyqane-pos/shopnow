'use client'
import { useState, useTransition } from 'react'
import type { CartItem, DeliveryInfo } from '@/lib/types'
import { fmt } from '@/lib/utils'
import { checkout } from '@/actions/orders'
import { useLang } from '@/context/LanguageContext'

interface Props {
  items: CartItem[]
  total: number
  onClose: () => void
  onSuccess: () => void
  showToast: (msg: string, type?: 'success' | 'error') => void
}

export default function CheckoutModal({ items, total, onClose, onSuccess, showToast }: Props) {
  const { t } = useLang()
  const [method, setMethod] = useState<'cash' | 'card'>('cash')
  const [info, setInfo] = useState<DeliveryInfo>({ name: '', phone: '', address: '', city: '' })
  const [isPending, startTransition] = useTransition()

  const set = (k: keyof DeliveryInfo) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setInfo(prev => ({ ...prev, [k]: e.target.value }))

  const valid = info.name.trim() && info.phone.trim() && info.address.trim() && info.city.trim()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) return
    startTransition(async () => {
      const result = await checkout(items, total, method, info)
      if (result?.error) {
        showToast(result.error, 'error')
      } else {
        onSuccess()
        showToast(t('checkoutSuccess'))
      }
    })
  }

  return (
    <div className="modal-overlay-ay" onClick={onClose}>
      <div className="modal-panel-ay checkout-modal-ay" onClick={e => e.stopPropagation()}>
        <button className="modal-close-ay" onClick={onClose}>×</button>
        <h2 style={{ fontWeight: 800, fontSize: '18px', marginBottom: '1.5rem' }}>{t('checkoutTitle')}</h2>

        <form onSubmit={handleSubmit}>
          {/* Payment method */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#888', marginBottom: '10px' }}>
              {t('checkoutPayMethod')}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setMethod('cash')}
                className={`payment-option-ay${method === 'cash' ? ' selected' : ''}`}
              >
                <span style={{ fontSize: '20px' }}>💵</span>
                <span style={{ fontWeight: 700, fontSize: '13px' }}>{t('checkoutCash')}</span>
                <span style={{ fontSize: '11px', color: '#888' }}>{t('checkoutCashSub')}</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('card')}
                className={`payment-option-ay${method === 'card' ? ' selected' : ''}`}
                disabled
                title={t('checkoutCardSoon')}
                style={{ opacity: 0.45 }}
              >
                <span style={{ fontSize: '20px' }}>💳</span>
                <span style={{ fontWeight: 700, fontSize: '13px' }}>{t('checkoutCard')}</span>
                <span style={{ fontSize: '11px', color: '#888' }}>{t('checkoutCardSoon')}</span>
              </button>
            </div>
          </div>

          {/* Delivery info */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#888', marginBottom: '10px' }}>
              {t('checkoutAddress')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input className="form-input-ay" placeholder={t('checkoutName')} value={info.name} onChange={set('name')} required />
              <input className="form-input-ay" placeholder={t('checkoutPhone')} value={info.phone} onChange={set('phone')} required />
              <input className="form-input-ay" placeholder={t('checkoutStreet')} value={info.address} onChange={set('address')} required />
              <input className="form-input-ay" placeholder={t('checkoutCity')} value={info.city} onChange={set('city')} required />
            </div>
          </div>

          {/* Total */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '15px', padding: '12px 0', borderTop: '1px solid #f0f0ee', marginBottom: '1rem' }}>
            <span>{t('checkoutTotal')}</span>
            <span>{fmt(total)}</span>
          </div>

          <button
            type="submit"
            className="add-btn-ay"
            disabled={isPending || !valid}
          >
            {isPending ? t('checkoutProcessing') : `${t('checkoutConfirm')} · ${fmt(total)}`}
          </button>
        </form>
      </div>
    </div>
  )
}
