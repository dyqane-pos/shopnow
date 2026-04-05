'use client'
import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition, useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useCategoriesContext } from '@/context/CategoriesContext'
import { logout } from '@/actions/auth'
import { ini } from '@/lib/utils'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function NavBar() {
  const { cartCount, hydrated } = useCart()
  const { user, profile, isAdmin } = useAuth()
  const { productCats, genders } = useCategoriesContext()
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [, startTransition] = useTransition()
  const [searchVal, setSearchVal] = useState(params.get('q') ?? '')

  const activeCat = params.get('cat') ?? 'all'
  const activeGender = params.get('gender') ?? 'Men'

  const push = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString())
    for (const [k, v] of Object.entries(updates)) {
      if (v === null) next.delete(k); else next.set(k, v)
    }
    startTransition(() => router.push(`${pathname}?${next.toString()}`))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    push({ q: searchVal || null })
  }

  return (
    <header className="site-header">
      {/* Row 1: Gender | Logo | Icons */}
      <div className="nav-row1">
        <div className="gender-tabs">
          {genders.map(g => (
            <button key={g.id} onClick={() => push({ gender: g.label })}
              className={`gender-tab${activeGender === g.label ? ' active' : ''}`}>
              {g.label}
            </button>
          ))}
        </div>

        <Link href="/" className="logo-center">
          <div className="logo-box-ay">
            <span>SHOP</span><span className="logo-bold">NOW</span><div className="logo-dot">°</div>
          </div>
        </Link>

        <div className="nav-icons">
          {user ? (
            <>
              {isAdmin && (
                <Link href="/admin/products" className="nav-icon" title="Admin">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                </Link>
              )}
              <Link href="/profile" className="nav-icon" title="Profili">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </Link>
              <button onClick={() => logout()} className="nav-icon nav-icon-btn" title="Dil">
                Dil
              </button>
            </>
          ) : (
            <Link href="/login" className="nav-icon" title="Hyr">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </Link>
          )}

          <Link href="/profile" className="nav-icon" title="Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          </Link>

          <Link href="/cart" className="nav-icon cart-icon" title="Shporta">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            {hydrated && cartCount > 0 && <span className="cart-badge-ay">{cartCount}</span>}
          </Link>

          <ThemeToggle />
        </div>
      </div>

      {/* Row 2: Category tabs + Search */}
      <div className="nav-row2">
        <div className="cat-tabs">
          {productCats.map(c => (
            <button key={c.id} onClick={() => push({ cat: c.id })}
              className={`cat-tab${activeCat === c.id ? ' active' : ''}`}>
              {c.label}
            </button>
          ))}
          <button
            onClick={() => push({ sale: params.get('sale') === 'true' ? null : 'true' })}
            className={`cat-tab sale-tab${params.get('sale') === 'true' ? ' active' : ''}`}>
            SALE
          </button>
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="search" placeholder="Kërko produkte, brende..." value={searchVal}
            onChange={e => setSearchVal(e.target.value)} className="search-input" />
        </form>
      </div>
    </header>
  )
}
