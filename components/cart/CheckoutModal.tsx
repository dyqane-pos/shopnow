'use client'
import { useState, useTransition } from 'react'
import type { CartItem, DeliveryInfo } from '@/lib/types'
import { fmt } from '@/lib/utils'
import { checkout } from '@/actions/orders'

interface Props {
  items: CartItem[]
  total: number
  onClose: () => void
  onSuccess: () => void
  showToast: (msg: string, type?: 'success' | 'error') => void
}

export default function CheckoutModal({ items, total, onClose, onSuccess, showToast }: Props) {
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
        showToast('Porosia u vendos me sukses!')
      }
    })
  }

  return (
    <div className="modal-overlay-ay" onClick={onClose}>
      <div className="modal-panel-ay checkout-modal-ay" onClick={e => e.stopPropagation()}>
        <button className="modal-close-ay" onClick={onClose}>×</button>
        <h2 style={{ fontWeight: 800, fontSize: '18px', marginBottom: '1.5rem' }}>Përfundo porosinë</h2>

        <form onSubmit={handleSubmit}>
          {/* Mënyra e pagesës */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#888', marginBottom: '10px' }}>
              Mënyra e pagesës
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setMethod('cash')}
                className={`payment-option-ay${method === 'cash' ? ' selected' : ''}`}
              >
                <span style={{ fontSize: '20px' }}>💵</span>
                <span style={{ fontWeight: 700, fontSize: '13px' }}>Para në dorë</span>
                <span style={{ fontSize: '11px', color: '#888' }}>Paguan gjatë dorëzimit</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('card')}
                className={`payment-option-ay${method === 'card' ? ' selected' : ''}`}
                disabled
                title="Së shpejti"
                style={{ opacity: 0.45 }}
              >
                <span style={{ fontSize: '20px' }}>💳</span>
                <span style={{ fontWeight: 700, fontSize: '13px' }}>Kartë krediti</span>
                <span style={{ fontSize: '11px', color: '#888' }}>Së shpejti</span>
              </button>
            </div>
          </div>

          {/* Info dorëzimit */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: '#888', marginBottom: '10px' }}>
              Adresa e dorëzimit
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input className="form-input-ay" placeholder="Emri i plotë *" value={info.name} onChange={set('name')} required />
              <input className="form-input-ay" placeholder="Numri i telefonit *" value={info.phone} onChange={set('phone')} required />
              <input className="form-input-ay" placeholder="Adresa (rruga, numri) *" value={info.address} onChange={set('address')} required />
              <input className="form-input-ay" placeholder="Qyteti *" value={info.city} onChange={set('city')} required />
            </div>
          </div>

          {/* Totali */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '15px', padding: '12px 0', borderTop: '1px solid #f0f0ee', marginBottom: '1rem' }}>
            <span>Total</span>
            <span>{fmt(total)}</span>
          </div>

          <button
            type="submit"
            className="add-btn-ay"
            disabled={isPending || !valid}
          >
            {isPending ? 'Duke procesuar...' : `Konfirmo porosinë · ${fmt(total)}`}
          </button>
        </form>
      </div>
    </div>
  )
}
