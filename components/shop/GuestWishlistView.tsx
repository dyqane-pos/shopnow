'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProductGrid from '@/components/shop/ProductGrid'
import { createClient } from '@/lib/supabase'
import type { Product } from '@/lib/types'

const LS_KEY = 'ay_wishlist'

export default function GuestWishlistView() {
  const [products, setProducts] = useState<Product[] | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      const ids: number[] = raw ? JSON.parse(raw) : []
      if (ids.length === 0) { setProducts([]); return }
      const sb = createClient()
      sb.from('products').select('*').in('id', ids).eq('is_active', true).then(({ data }) => {
        setProducts(data ?? [])
      })
    } catch {
      setProducts([])
    }
  }, [])

  if (products === null) return null

  return (
    <div>
      <h1 className="admin-h1-ay" style={{ marginBottom: '1.5rem' }}>
        Wishlist ({products.length})
      </h1>

      {products.length === 0 ? (
        <div className="empty-ay">
          <h3>Wishlist-i është bosh</h3>
          <p style={{ marginBottom: '1rem' }}>Shto produkte duke klikuar zemrën në çdo produkt.</p>
          <Link href="/" className="add-btn-ay" style={{ display: 'inline-block', width: 'auto', padding: '12px 24px' }}>
            Shko te dyqani
          </Link>
        </div>
      ) : (
        <>
          <ProductGrid products={products} />
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link href="/login" style={{ fontSize: '13px', color: '#888', textDecoration: 'underline' }}>
              Hyr / Regjistrohu për ta ruajtur listën →
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
