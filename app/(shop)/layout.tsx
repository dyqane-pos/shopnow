import NavBar from '@/components/layout/NavBar'
import InfoBar from '@/components/layout/InfoBar'
import Sidebar from '@/components/layout/Sidebar'
import { CategoriesProvider, DEFAULT_CATEGORY_TAGS } from '@/context/CategoriesContext'
import { createServerSupabase, createServiceSupabase } from '@/lib/supabase-server'
import { CATEGORIES, SIDEBAR_LINKS, type Category } from '@/lib/types'

const FALLBACK_PRODUCT_CATS: Category[] = CATEGORIES.map((c, i) => ({
  id: c.id, label: c.label, type: 'product', sort_order: i, is_active: true,
}))
const FALLBACK_GENDERS: Category[] = ['Women', 'Men', 'Kids'].map((g, i) => ({
  id: g.toLowerCase(), label: g, type: 'gender', sort_order: i, is_active: true,
}))
const FALLBACK_SIDEBAR: Category[] = SIDEBAR_LINKS.map((s, i) => ({
  id: s.toLowerCase().replace(/\s+/g, '-'), label: s, type: 'sidebar', sort_order: i, is_active: true,
}))

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  let productCats = FALLBACK_PRODUCT_CATS
  let genders = FALLBACK_GENDERS
  let sidebarLinks = FALLBACK_SIDEBAR
  let categoryTags: Record<string, string[]> = DEFAULT_CATEGORY_TAGS

  try {
    const supabase = createServerSupabase()
    const { data: cats } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    if (cats && cats.length > 0) {
      const all = cats as Category[]
      productCats = all.filter(c => c.type === 'product')
      genders = all.filter(c => c.type === 'gender')
      sidebarLinks = all.filter(c => c.type === 'sidebar')
    }
  } catch {}

  try {
    const service = createServiceSupabase()
    const { data: rows } = await service.from('category_tags').select('category_id, tag_label')
    if (rows && rows.length > 0) {
      const map: Record<string, string[]> = {}
      for (const { category_id, tag_label } of rows) {
        if (!map[category_id]) map[category_id] = []
        map[category_id].push(tag_label)
      }
      categoryTags = map
    }
  } catch {}

  return (
    <CategoriesProvider productCats={productCats} genders={genders} sidebarLinks={sidebarLinks} categoryTags={categoryTags}>
      <InfoBar />
      <NavBar />
      <div className="shop-wrap">
        <Sidebar />
        <main className="main-ay">{children}</main>
      </div>
    </CategoriesProvider>
  )
}
