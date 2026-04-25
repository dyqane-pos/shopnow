'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { useCategoriesContext } from '@/context/CategoriesContext'

export default function Sidebar() {
  const { productCats, sidebarLinks, categoryTags } = useCategoriesContext()
  const params = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [, startTransition] = useTransition()

  const activeCat     = params.get('cat') ?? 'all'
  const activeSidebar = params.get('sidebar')

  const push = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString())
    for (const [k, v] of Object.entries(updates)) {
      if (v === null) next.delete(k); else next.set(k, v)
    }
    next.delete('modal')
    startTransition(() => router.push(`${pathname}?${next.toString()}`, { scroll: false }))
  }

  const availableTags = new Set(sidebarLinks.map(l => l.label))
  const cats = productCats.filter(c => c.id !== 'all')

  return (
    <aside className="sidebar-ay">
      {cats.map(cat => {
        const isActive = activeCat === cat.id
        const subcats = (categoryTags[cat.id] ?? []).filter(t => availableTags.has(t))

        return (
          <div key={cat.id}>
            <button
              onClick={() => push({ cat: isActive ? 'all' : cat.id, sidebar: null })}
              className={`sb-cat-ay${isActive ? ' active' : ''}`}
            >
              {cat.label}
            </button>

            {isActive && subcats.length > 0 && (
              <div className="sb-subcats-ay">
                {subcats.map(tag => (
                  <button
                    key={tag}
                    onClick={() => push({ sidebar: activeSidebar === tag ? null : tag })}
                    className={`sb-link-ay${activeSidebar === tag ? ' active' : ''}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </aside>
  )
}
