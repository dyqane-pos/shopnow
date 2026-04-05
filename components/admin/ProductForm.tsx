'use client'
import { useFormState } from 'react-dom'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { saveProduct } from '@/actions/products'
import SubmitButton from '@/components/ui/SubmitButton'
import { createClient } from '@/lib/supabase'
import type { Product } from '@/lib/types'

export default function ProductForm({ product }: { product?: Product }) {
  const [state, action] = useFormState(saveProduct, null)
  const [photoUrl, setPhotoUrl] = useState(product?.photo_url ?? '')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const sb = createClient()
    const ext = file.name.split('.').pop()
    const path = `products/${Date.now()}.${ext}`
    const { error } = await sb.storage.from('product-images').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = sb.storage.from('product-images').getPublicUrl(path)
      setPhotoUrl(data.publicUrl)
    }
    setUploading(false)
  }

  return (
    <form action={action} className="admin-form-ay">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="photo_url" value={photoUrl} />

      <div className="admin-form-row-ay">
        <label className="admin-label-ay">Emri i produktit</label>
        <input name="name" required className="admin-input-ay" defaultValue={product?.name ?? ''} placeholder="p.sh. Zip-Up Hoodie" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="admin-form-row-ay">
          <label className="admin-label-ay">Brendi</label>
          <input name="brand" required className="admin-input-ay" defaultValue={product?.brand ?? ''} placeholder="p.sh. ADIDAS" />
        </div>
        <div className="admin-form-row-ay">
          <label className="admin-label-ay">Kategoria</label>
          <select name="category" className="admin-select-ay" defaultValue={product?.category ?? 'clothing'}>
            <option value="clothing">Veshje</option>
            <option value="shoes">Këpucë</option>
            <option value="accessories">Aksesore</option>
            <option value="sports">Sport</option>
            <option value="electronics">Elektronikë</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="admin-form-row-ay">
          <label className="admin-label-ay">Çmimi ($)</label>
          <input name="price" type="number" step="0.01" min="0" required className="admin-input-ay" defaultValue={product?.price ?? ''} placeholder="49.90" />
        </div>
        <div className="admin-form-row-ay">
          <label className="admin-label-ay">Çmimi i vjetër ($) — SALE</label>
          <input name="old_price" type="number" step="0.01" min="0" className="admin-input-ay" defaultValue={product?.old_price ?? ''} placeholder="Lëre bosh nëse nuk ka" />
        </div>
      </div>

      <div className="admin-form-row-ay">
        <label className="admin-label-ay">Përshkrimi</label>
        <textarea name="description" className="admin-input-ay" rows={3} defaultValue={product?.description ?? ''} placeholder="Përshkrim i shkurtër i produktit..." />
      </div>

      <div className="admin-form-row-ay">
        <label className="admin-label-ay">Madhësitë (me presje)</label>
        <input name="sizes" className="admin-input-ay" defaultValue={product?.sizes?.join(', ') ?? 'S, M, L, XL'} placeholder="S, M, L, XL" />
      </div>

      <div className="admin-form-row-ay">
        <label className="admin-label-ay">Foto produkti</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {photoUrl && (
            <Image src={photoUrl} alt="Preview" width={70} height={93} className="img-preview-ay" style={{ objectFit: 'cover' }} />
          )}
          <div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
            <button type="button" className="admin-btn-ay admin-btn-ghost" onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? 'Duke ngarkuar...' : photoUrl ? 'Ndrysho foton' : 'Ngarko foto'}
            </button>
            {photoUrl && (
              <button type="button" className="admin-btn-ay admin-btn-danger" style={{ marginLeft: '6px' }} onClick={() => setPhotoUrl('')}>
                Hiq
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="admin-form-row-ay">
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <label className="toggle-ay">
            <input name="is_sale" type="checkbox" value="true" defaultChecked={product?.is_sale ?? false} />
            <span className="toggle-slider-ay" />
          </label>
          <span className="admin-label-ay" style={{ margin: 0 }}>Shëno si SALE</span>
        </label>
      </div>

      {state?.error && <div className="form-error-ay">{state.error}</div>}

      <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
        <SubmitButton
          label={product ? 'Ruaj ndryshimet' : 'Krijo produktin'}
          pendingLabel="Duke ruajtur..."
          className="admin-btn-ay admin-btn-primary"
        />
      </div>
    </form>
  )
}
