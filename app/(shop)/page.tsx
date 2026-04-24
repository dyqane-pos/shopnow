import { createServiceSupabase } from '@/lib/supabase-server'
import FilterBar from '@/components/shop/FilterBar'
import ProductGrid from '@/components/shop/ProductGrid'
import ProductModal from '@/components/shop/ProductModal'
import type { Product } from '@/lib/types'

interface SearchParams {
  cat?: string
  sale?: string
  q?: string
  sort?: string
  gender?: string
  modal?: string
  sidebar?: string
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  let products: Product[] = []

  try {
    const supabase = createServiceSupabase()
    let query = supabase.from('products').select('*').eq('is_active', true)

    if (searchParams.cat && searchParams.cat !== 'all') {
      query = query.eq('category', searchParams.cat)
    }
    if (searchParams.sale === 'true') {
      query = query.eq('is_sale', true)
    }
    if (searchParams.q) {
      query = query.or(`name.ilike.%${searchParams.q}%,brand.ilike.%${searchParams.q}%`)
    }
    if (searchParams.gender) {
      query = query.eq('gender', searchParams.gender)
    }

    if (searchParams.sidebar) {
      const s = searchParams.sidebar
      if (s !== 'New' && s !== 'Trending') {
        query = query.or(`name.ilike.%${s}%,brand.ilike.%${s}%`)
      }
    }

    const sidebarSort = searchParams.sidebar === 'New' ? 'newest' : undefined
    switch (searchParams.sort ?? sidebarSort) {
      case 'price_asc': query = query.order('price', { ascending: true }); break
      case 'price_desc': query = query.order('price', { ascending: false }); break
      case 'newest': query = query.order('created_at', { ascending: false }); break
      default: query = query.order('views', { ascending: false })
    }

    const { data } = await query
    products = data ?? []
  } catch {}

  return (
    <>
      <FilterBar total={products.length} />
      <ProductGrid products={products} />
      {searchParams.modal && <ProductModal products={products} />}
    </>
  )
}
