import { createServerSupabase, createServiceSupabase } from '@/lib/supabase-server'
import Link from 'next/link'
import ProductGrid from '@/components/shop/ProductGrid'
import type { Product } from '@/lib/types'

export default async function WishlistPage() {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="empty-ay" style={{ marginTop: '3rem' }}>
        <h3>♥ Lista e dëshirave</h3>
        <p style={{ marginBottom: '1.5rem' }}>Hyr në llogari për të parë dhe ruajtur produktet e preferuara.</p>
        <Link href="/login" className="add-btn-ay" style={{ display: 'inline-block', width: 'auto', padding: '12px 28px' }}>
          Hyr / Regjistrohu
        </Link>
      </div>
    )
  }

  const service = createServiceSupabase()
  const { data: wishlistItems } = await service
    .from('wishlist')
    .select('product_id')
    .eq('user_id', user.id)

  const productIds = wishlistItems?.map((w: { product_id: number }) => w.product_id) ?? []

  let products: Product[] = []
  if (productIds.length > 0) {
    const { data } = await service
      .from('products')
      .select('*')
      .in('id', productIds)
      .eq('is_active', true)
    products = data ?? []
  }

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
        <ProductGrid products={products} />
      )}
    </div>
  )
}
