'use client'
import { createContext, useContext } from 'react'
import type { Category } from '@/lib/types'
import { CATEGORIES, SIDEBAR_LINKS } from '@/lib/types'

const DEFAULT_CATEGORY_TAGS: Record<string, string[]> = {
  clothing:    ['New', 'Trending', 'T-shirts', 'Jeans', 'Jackets', 'Pants', 'Sweaters & hoodies', 'Underwear', 'Button-up shirts', 'Suits & jackets', 'Swimwear', 'Coats', 'Plus sizes', 'Occasions', 'Exclusive'],
  shoes:       ['New', 'Trending', 'Exclusive'],
  accessories: ['New', 'Trending', 'Exclusive'],
  sports:      ['New', 'Trending', 'Exclusive'],
  electronics: ['New', 'Trending', 'Exclusive'],
}

interface CategoriesContextValue {
  productCats: Category[]
  genders: Category[]
  sidebarLinks: Category[]
  categoryTags: Record<string, string[]>
}

const defaults: CategoriesContextValue = {
  productCats: CATEGORIES.map((c, i) => ({ id: c.id, label: c.label, type: 'product' as const, sort_order: i, is_active: true })),
  genders: ['Women', 'Men', 'Kids'].map((g, i) => ({ id: g.toLowerCase(), label: g, type: 'gender' as const, sort_order: i, is_active: true })),
  sidebarLinks: SIDEBAR_LINKS.map((s, i) => ({ id: s.toLowerCase().replace(/\s+/g, '-'), label: s, type: 'sidebar' as const, sort_order: i, is_active: true })),
  categoryTags: DEFAULT_CATEGORY_TAGS,
}

const CategoriesContext = createContext<CategoriesContextValue>(defaults)

export function CategoriesProvider({ children, productCats, genders, sidebarLinks, categoryTags }: {
  children: React.ReactNode
  productCats: Category[]
  genders: Category[]
  sidebarLinks: Category[]
  categoryTags: Record<string, string[]>
}) {
  return (
    <CategoriesContext.Provider value={{ productCats, genders, sidebarLinks, categoryTags }}>
      {children}
    </CategoriesContext.Provider>
  )
}

export { DEFAULT_CATEGORY_TAGS }
export const useCategoriesContext = () => useContext(CategoriesContext)
