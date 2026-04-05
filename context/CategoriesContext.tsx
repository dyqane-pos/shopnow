'use client'
import { createContext, useContext } from 'react'
import type { Category } from '@/lib/types'
import { CATEGORIES, SIDEBAR_LINKS } from '@/lib/types'

interface CategoriesContextValue {
  productCats: Category[]; genders: Category[]; sidebarLinks: Category[]
}

const defaults = {
  productCats: CATEGORIES.map((c, i) => ({ id: c.id, label: c.label, type: 'product' as const, sort_order: i, is_active: true })),
  genders: ['Women', 'Men', 'Kids'].map((g, i) => ({ id: g.toLowerCase(), label: g, type: 'gender' as const, sort_order: i, is_active: true })),
  sidebarLinks: SIDEBAR_LINKS.map((s, i) => ({ id: s.toLowerCase().replace(/\s+/g, '-'), label: s, type: 'sidebar' as const, sort_order: i, is_active: true })),
}

const CategoriesContext = createContext<CategoriesContextValue>(defaults)

export function CategoriesProvider({ children, productCats, genders, sidebarLinks }: {
  children: React.ReactNode; productCats: Category[]; genders: Category[]; sidebarLinks: Category[]
}) {
  return (
    <CategoriesContext.Provider value={{ productCats, genders, sidebarLinks }}>
      {children}
    </CategoriesContext.Provider>
  )
}

export const useCategoriesContext = () => useContext(CategoriesContext)
