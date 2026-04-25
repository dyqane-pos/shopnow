'use client'
import { useFormState } from 'react-dom'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { saveProduct } from '@/actions/products'
import SubmitButton from '@/components/ui/SubmitButton'
import { createClient } from '@/lib/supabase'
import type { Product } from '@/lib/types'
import { PRODUCT_TAGS } from '@/lib/types'

function initPhotos(product?: Product): string[] {
  if (product?.photos?.length) return product.photos
  if (product?.photo_url) return [product.photo_url]
  return []
}

export default function ProductForm({ product }: { product?: Product }) {
  const [state, action] = useFormState(saveProduct, null)
  const [photos, setPhotos] = useState<string[]>(initPhotos(product))
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File) => {
    setUploading(true)
    const sb = createClient()
    const ext = file.name.split('.').pop()
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await sb.storage.from('product-images').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = sb.storage.from('product-images').getPublicUrl(path)
      setPhotos(prev => [...prev, data.publicUrl])
    }
    setUploading(false)
  }

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    for (const file of files) await uploadFile(file)
    e.target.value = ''
  }

  const removePhoto = (idx: number) =>
    setPhotos(prev => prev.filter((_, i) => i !== idx))

  const moveFirst = (idx: number) =>
    setPhotos(prev => [prev[idx], ...prev.filter((_, i) => i !== idx)])

  return (
    <form action={action} className="admin-form-ay">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="photos_json" value={JSON.stringify(photos)} />

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
        <label className="admin-label-ay">Kategoritë e sidebarit</label>
        <div className="tags-grid-ay">
          {PRODUCT_TAGS.map(tag => (
            <label key={tag} className="tag-check-ay">
              <input type="checkbox" name="tags" value={tag} defaultChecked={product?.tags?.includes(tag) ?? false} />
              {tag}
            </label>
          ))}
        </div>
      </div>

      {/* Multi-photo upload */}
      <div className="admin-form-row-ay">
        <label className="admin-label-ay">
          Fotot e produktit
          <span style={{ fontWeight: 400, textTransform: 'none', fontSize: '11px', color: '#aaa', marginLeft: 6 }}>
            ({photos.length} foto{photos.length !== 1 ? '' : ''} · e para = kryesorja)
          </span>
        </label>

        {/* Thumbnails */}
        {photos.length > 0 && (
          <div className="photos-grid-ay">
            {photos.map((url, idx) => (
              <div key={url + idx} className="photo-thumb-ay">
                <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4' }}>
                  <Image src={url} alt={`Foto ${idx + 1}`} fill sizes="100px" style={{ objectFit: 'cover', borderRadius: 6 }} />
                </div>
                {idx === 0 && (
                  <span className="photo-primary-badge-ay">Kryesorja</span>
                )}
                <div className="photo-thumb-actions-ay">
                  {idx !== 0 && (
                    <button type="button" title="Bëje kryesore" onClick={() => moveFirst(idx)} className="photo-action-btn-ay">
                      ★
                    </button>
                  )}
                  <button type="button" title="Hiq" onClick={() => removePhoto(idx)} className="photo-action-btn-ay danger">
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload butona */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: photos.length ? '8px' : 0 }}>
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleFiles} />
          <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleFiles} />

          <button type="button" className="admin-btn-ay admin-btn-ghost" onClick={() => cameraRef.current?.click()} disabled={uploading}>
            📷 Kamera
          </button>
          <button type="button" className="admin-btn-ay admin-btn-ghost" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? 'Duke ngarkuar...' : '🖼️ Shto foto'}
          </button>
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
