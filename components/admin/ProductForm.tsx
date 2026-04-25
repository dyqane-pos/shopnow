'use client'
import { useFormState } from 'react-dom'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { saveProduct } from '@/actions/products'
import SubmitButton from '@/components/ui/SubmitButton'
import { createClient } from '@/lib/supabase'
import type { Product } from '@/lib/types'
import { PRODUCT_TAGS, PRODUCT_COLORS, PRODUCT_MATERIALS } from '@/lib/types'

function initPhotos(product?: Product): string[] {
  if (product?.photos?.length) return product.photos
  if (product?.photo_url) return [product.photo_url]
  return []
}

// Merr shtesën nga MIME type — kamera celulari nuk jep gjithmonë shtesë skedari
function extFromFile(file: File): string {
  const mime: Record<string, string> = {
    'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png',
    'image/webp': 'webp', 'image/heic': 'jpg', 'image/heif': 'jpg',
    'image/gif': 'gif',
  }
  if (mime[file.type]) return mime[file.type]
  const parts = file.name.split('.')
  return parts.length > 1 ? parts.pop()! : 'jpg'
}

const CATEGORY_SIZES: Record<string, string> = {
  clothing: 'XS, S, M, L, XL, XXL',
  shoes: '36, 37, 38, 39, 40, 41, 42, 43, 44, 45',
  sports: 'XS, S, M, L, XL, XXL',
  accessories: '',
  electronics: '',
}

const FALLBACK_CATEGORY_TAGS: Record<string, string[]> = {
  clothing:    ['New', 'Trending', 'T-shirts', 'Jeans', 'Jackets', 'Pants', 'Sweaters & hoodies', 'Underwear', 'Button-up shirts', 'Suits & jackets', 'Swimwear', 'Coats', 'Plus sizes', 'Occasions', 'Exclusive'],
  shoes:       ['New', 'Trending', 'Exclusive'],
  accessories: ['New', 'Trending', 'Exclusive'],
  sports:      ['New', 'Trending', 'Exclusive'],
  electronics: ['New', 'Trending', 'Exclusive'],
}

export default function ProductForm({ product, categoryTags }: { product?: Product; categoryTags?: Record<string, string[]> }) {
  const CATEGORY_TAGS = categoryTags ?? FALLBACK_CATEGORY_TAGS
  const [state, action] = useFormState(saveProduct, null)
  const [photos, setPhotos] = useState<string[]>(initPhotos(product))
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const [selectedCategory, setSelectedCategory] = useState(product?.category ?? 'clothing')
  const [sizes, setSizes] = useState(
    product?.sizes?.join(', ') ?? CATEGORY_SIZES[product?.category ?? 'clothing'] ?? ''
  )
  const [selectedTags, setSelectedTags] = useState<string[]>(product?.tags ?? [])

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat)
    if (!product) setSizes(CATEGORY_SIZES[cat] ?? '')
    const validTags = new Set(CATEGORY_TAGS[cat] ?? [])
    setSelectedTags(prev => prev.filter(t => validTags.has(t)))
  }

  const toggleTag = (tag: string) =>
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])

  const uploadFile = async (file: File) => {
    setUploadError(null)
    const sb = createClient()
    const ext = extFromFile(file)
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await sb.storage.from('product-images').upload(path, file, {
      upsert: true,
      contentType: file.type || 'image/jpeg',
    })
    if (error) {
      setUploadError(`Ngarkimi dështoi: ${error.message}`)
      return false
    }
    const { data } = sb.storage.from('product-images').getPublicUrl(path)
    setPhotos(prev => [...prev, data.publicUrl])
    return true
  }

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    for (const file of files) await uploadFile(file)
    setUploading(false)
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
          <select
            name="category"
            className="admin-select-ay"
            value={selectedCategory}
            onChange={e => handleCategoryChange(e.target.value)}
          >
            <option value="clothing">Veshje</option>
            <option value="shoes">Këpucë</option>
            <option value="accessories">Aksesore</option>
            <option value="sports">Sport</option>
            <option value="electronics">Elektronikë</option>
          </select>
        </div>
      </div>

      <div className="admin-form-row-ay">
        <label className="admin-label-ay">Gjinia</label>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {(['men', 'women', 'kids', 'unisex'] as const).map(g => {
            const labels: Record<string, string> = { men: 'Men', women: 'Women', kids: 'Kids', unisex: 'Unisex' }
            return (
              <label key={g} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '14px' }}>
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  defaultChecked={(product?.gender ?? 'unisex') === g}
                />
                {labels[g]}
              </label>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="admin-form-row-ay">
          <label className="admin-label-ay">Ngjyra</label>
          <select name="color" className="admin-select-ay" defaultValue={product?.color ?? ''}>
            <option value="">— Pa ngjyrë —</option>
            {PRODUCT_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="admin-form-row-ay">
          <label className="admin-label-ay">Materiali</label>
          <select name="material" className="admin-select-ay" defaultValue={product?.material ?? ''}>
            <option value="">— Pa material —</option>
            {PRODUCT_MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
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
        <label className="admin-label-ay">
          Madhësitë (me presje)
          {product && (
            <button
              type="button"
              onClick={() => setSizes(CATEGORY_SIZES[selectedCategory] ?? '')}
              style={{ marginLeft: 8, fontSize: '10px', fontWeight: 600, color: '#888', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'none', letterSpacing: 0 }}
            >
              Reset sipas kategorisë
            </button>
          )}
        </label>
        <input
          name="sizes"
          className="admin-input-ay"
          value={sizes}
          onChange={e => setSizes(e.target.value)}
          placeholder={selectedCategory === 'shoes' ? '36, 37, 38, 39, 40, 41, 42, 43, 44, 45' : 'XS, S, M, L, XL, XXL'}
        />
      </div>

      <div className="admin-form-row-ay">
        <label className="admin-label-ay">Kategoritë e sidebarit</label>
        <div className="tags-grid-ay">
          {(CATEGORY_TAGS[selectedCategory] ?? []).map(tag => (
            <label key={tag} className="tag-check-ay">
              <input
                type="checkbox"
                name="tags"
                value={tag}
                checked={selectedTags.includes(tag)}
                onChange={() => toggleTag(tag)}
              />
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

          <button type="button" className="admin-btn-ay admin-btn-ghost" onClick={() => { setUploadError(null); cameraRef.current?.click() }} disabled={uploading}>
            📷 Kamera
          </button>
          <button type="button" className="admin-btn-ay admin-btn-ghost" onClick={() => { setUploadError(null); fileRef.current?.click() }} disabled={uploading}>
            {uploading ? '⏳ Duke ngarkuar...' : '🖼️ Shto foto'}
          </button>
        </div>

        {uploadError && (
          <div style={{ marginTop: '8px', padding: '8px 12px', background: '#ffebee', border: '1px solid #ffcdd2', borderRadius: 6, fontSize: '12px', color: '#c62828', fontWeight: 600 }}>
            ⚠️ {uploadError}
          </div>
        )}
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
