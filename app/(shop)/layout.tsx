import NavBar from '@/components/layout/NavBar'
import InfoBar from '@/components/layout/InfoBar'
import Sidebar from '@/components/layout/Sidebar'
import { CategoriesProvider } from '@/context/CategoriesContext'
import { createServerSupabase } from '@/lib/supabase-server'
import type { Category } from '@/lib/types'

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabase()
  const { data: cats } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  const categories: Category[] = cats ?? []
  const productCats = categories.filter(c => c.type === 'product')
  const genders = categories.filter(c => c.type === 'gender')
  const sidebarLinks = categories.filter(c => c.type === 'sidebar')

  return (
    <CategoriesProvider productCats={productCats} genders={genders} sidebarLinks={sidebarLinks}>
      <InfoBar />
      <NavBar />
      <div className="shop-wrap">
        <Sidebar links={sidebarLinks} />
        <main className="main-ay">{children}</main>
      </div>
    </CategoriesProvider>
  )
}
