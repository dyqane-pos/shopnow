import { createServiceSupabase } from '@/lib/supabase-server'
import FilterBar from '@/components/shop/FilterBar'
import ProductGrid from '@/components/shop/ProductGrid'
import ProductModal from '@/components/shop/ProductModal'
import PageHeader from '@/components/shop/PageHeader'
import type { Product } from '@/lib/types'

export const dynamic = 'force-dynamic'

interface SearchParams {
  cat?: string
  sale?: string
  q?: string
  sort?: string
  gender?: string
  modal?: string
  sidebar?: string
  size?: string
  brand?: string
  color?: string
  material?: string
  minPrice?: string
  maxPrice?: string
  view?: string
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
      const g = searchParams.gender.toLowerCase()
      if (g === 'kids') {
        // All kids: show all kids variants + unisex
        query = query.in('gender', ['kids', 'kids-babies', 'kids-girls', 'kids-boys', 'unisex'])
      } else if (g.startsWith('kids-')) {
        // Specific kids sub-type: show that + generic 'kids' products + unisex
        query = query.in('gender', [g, 'kids', 'unisex'])
      } else {
        query = query.in('gender', [g, 'unisex'])
      }
    }
    if (searchParams.sidebar) {
      query = query.contains('tags', [searchParams.sidebar])
    }
    if (searchParams.size) {
      query = query.contains('sizes', [searchParams.size])
    }
    if (searchParams.brand) {
      query = query.eq('brand', searchParams.brand)
    }
    if (searchParams.color) {
      query = query.eq('color', searchParams.color)
    }
    if (searchParams.material) {
      query = query.eq('material', searchParams.material)
    }
    if (searchParams.minPrice) {
      query = query.gte('price', Number(searchParams.minPrice))
    }
    if (searchParams.maxPrice) {
      query = query.lte('price', Number(searchParams.maxPrice))
    }

    const sidebarSort = searchParams.sidebar === 'New' ? 'newest' : undefined
    switch (searchParams.sort ?? sidebarSort) {
      case 'price_asc': query = query.order('price', { ascending: true }); break
      case 'price_desc': query = query.order('price', { ascending: false }); break
      case 'newest': query = query.order('created_at', { ascending: false }); break
      default: query = query.order('views', { ascending: false })
    }

    const { data, error } = await query
    if (error) console.error('[shop] Supabase query error:', error)
    products = data ?? []
  } catch (err) {
    console.error('[shop] Caught exception:', err)
  }

  const sizes = [...new Set(products.flatMap(p => p.sizes ?? []))].sort((a, b) => {
    const order = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
    const ia = order.indexOf(a); const ib = order.indexOf(b)
    if (ia !== -1 && ib !== -1) return ia - ib
    if (ia !== -1) return -1; if (ib !== -1) return 1
    return a.localeCompare(b, undefined, { numeric: true })
  })

  const brands    = [...new Set(products.map(p => p.brand))].sort()
  const colors    = [...new Set(products.map(p => p.color).filter(Boolean) as string[])].sort()
  const materials = [...new Set(products.map(p => p.material).filter(Boolean) as string[])].sort()
  const view = searchParams.view === 'list' ? 'list' : 'grid'

  return (
    <>
      <PageHeader total={products.length} />
      <FilterBar total={products.length} sizes={sizes} brands={brands} colors={colors} materials={materials} view={view} />
      <ProductGrid products={products} view={view} />
      {searchParams.modal && <ProductModal products={products} />}
    </>
  )
}
