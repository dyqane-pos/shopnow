'use client'
import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition, useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useCategoriesContext } from '@/context/CategoriesContext'
import { useLang } from '@/context/LanguageContext'
import { logout } from '@/actions/auth'
import { ini } from '@/lib/utils'
import ThemeToggle from '@/components/ui/ThemeToggle'
import LangSwitch from '@/components/ui/LangSwitch'

export default function NavBar() {
  const { cartCount, hydrated } = useCart()
  const { user, profile, isAdmin } = useAuth()
  const { productCats, genders } = useCategoriesContext()
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [, startTransition] = useTransition()
  const { t } = useLang()
  const [searchVal, setSearchVal] = useState(params.get('q') ?? '')
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeCat = params.get('cat') ?? 'all'
  const activeGender = params.get('gender') ?? 'Men'
  const isKidsActive = activeGender === 'Kids' || activeGender.toLowerCase().startsWith('kids-')

  const KIDS_SUBS = [
    { value: 'Kids',         label: 'All Kids' },
    { value: 'Kids-Babies',  label: 'Babies' },
    { value: 'Kids-Girls',   label: 'Girls' },
    { value: 'Kids-Boys',    label: 'Boys' },
  ]

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
    setMobileOpen(false)
  }

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      <header className="site-header">
        {/* Row 1: Gender | Logo | Icons */}
        <div className="nav-row1">
          {/* Desktop: gender tabs — Mobile: hamburger */}
          <div className="gender-tabs desktop-only-ay">
            {genders.map(g => {
              const isActive = g.label === 'Kids'
                ? isKidsActive
                : activeGender === g.label
              return (
                <button key={g.id} onClick={() => push({ gender: g.label, sidebar: null })}
                  className={`gender-tab${isActive ? ' active' : ''}`}>
                  {g.label}
                </button>
              )
            })}
          </div>

          {/* Hamburger — vetëm mobile */}
          <button className="hamburger-ay mobile-only-ay" onClick={() => setMobileOpen(true)} aria-label="Menu">
            <span /><span /><span />
          </button>

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
                <Link href="/profile" className="nav-icon desktop-only-ay" title="Profili">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </Link>
                <button onClick={() => logout()} className="nav-icon nav-icon-btn desktop-only-ay" title={t('navLogout')}>
                  {t('navLogout')}
                </button>
              </>
            ) : (
              <Link href="/login" className="nav-icon" title="Hyr">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </Link>
            )}

            <Link href="/wishlist" className="nav-icon" title="Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            </Link>

            <Link href="/cart" className="nav-icon cart-icon" title="Shporta">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              {hydrated && cartCount > 0 && <span className="cart-badge-ay">{cartCount}</span>}
            </Link>

            <LangSwitch />
            <ThemeToggle />
          </div>
        </div>

        {/* Gender strip — vetëm mobile */}
        <div className="mob-gender-strip-ay mobile-only-ay">
          {genders.map(g => {
            const isActive = g.label === 'Kids' ? isKidsActive : activeGender === g.label
            return (
              <button key={g.id}
                onClick={() => push({ gender: g.label, sidebar: null })}
                className={`mob-gender-tab-ay${isActive ? ' active' : ''}`}>
                {g.label}
              </button>
            )
          })}
          {isKidsActive && KIDS_SUBS.map(sub => (
            <button key={sub.value}
              onClick={() => push({ gender: sub.value, sidebar: null })}
              className={`mob-gender-tab-ay kids-sub${activeGender === sub.value ? ' active' : ''}`}>
              {sub.label}
            </button>
          ))}
        </div>

        {/* Kids sub-nav — vetëm desktop */}
        {isKidsActive && (
          <div className="kids-subnav-ay desktop-only-ay">
            {KIDS_SUBS.map(sub => (
              <button
                key={sub.value}
                onClick={() => push({ gender: sub.value, sidebar: null })}
                className={`kids-subnav-tab-ay${activeGender === sub.value ? ' active' : ''}`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}

        {/* Row 2: Category tabs + Search — fshihet në mobile */}
        <div className="nav-row2 desktop-only-ay">
          <div className="cat-tabs">
            {productCats.map(c => (
              <button key={c.id} onClick={() => push({ cat: c.id, sidebar: null })}
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
            <input type="search" placeholder={t('searchPlaceholder')} value={searchVal}
              onChange={e => setSearchVal(e.target.value)} className="search-input" />
          </form>
        </div>
      </header>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div className="mob-overlay-ay" onClick={closeMobile}>
          <div className="mob-drawer-ay" onClick={e => e.stopPropagation()}>
            <div className="mob-drawer-head-ay">
              <span style={{ fontWeight: 900, fontSize: '14px', letterSpacing: .5 }}>{t('navMenu')}</span>
              <button onClick={closeMobile} className="mob-close-ay">×</button>
            </div>

            {/* Kërkim */}
            <form onSubmit={handleSearch} className="mob-search-ay">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="search"
                placeholder={t('searchPlaceholder')}
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                className="search-input"
                autoFocus
              />
            </form>

            {/* Gjinia */}
            <div className="mob-section-ay">
              <div className="mob-section-title-ay">{t('navGender')}</div>
              <div className="mob-chips-ay">
                {genders.map(g => {
                  const isActive = g.label === 'Kids' ? isKidsActive : activeGender === g.label
                  return (
                    <button key={g.id}
                      onClick={() => { push({ gender: g.label }); closeMobile() }}
                      className={`mob-chip-ay${isActive ? ' active' : ''}`}>
                      {g.label}
                    </button>
                  )
                })}
              </div>
              {/* Kids sub-chips */}
              {isKidsActive && (
                <div className="mob-chips-ay" style={{ marginTop: '6px', paddingLeft: '12px', borderLeft: '2px solid #e8e8e4' }}>
                  {KIDS_SUBS.map(sub => (
                    <button key={sub.value}
                      onClick={() => { push({ gender: sub.value }); closeMobile() }}
                      className={`mob-chip-ay${activeGender === sub.value ? ' active' : ''}`}
                      style={{ fontSize: '11px' }}>
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Kategoritë */}
            <div className="mob-section-ay">
              <div className="mob-section-title-ay">{t('navCats')}</div>
              <div className="mob-chips-ay">
                {productCats.map(c => (
                  <button key={c.id}
                    onClick={() => { push({ cat: c.id }); closeMobile() }}
                    className={`mob-chip-ay${activeCat === c.id ? ' active' : ''}`}>
                    {c.label}
                  </button>
                ))}
                <button
                  onClick={() => { push({ sale: params.get('sale') === 'true' ? null : 'true' }); closeMobile() }}
                  className={`mob-chip-ay sale-tab${params.get('sale') === 'true' ? ' active' : ''}`}>
                  SALE
                </button>
              </div>
            </div>

            {/* Lidhjet e llogarisë */}
            <div className="mob-links-ay">
              {user ? (
                <>
                  <Link href="/profile" onClick={closeMobile} className="mob-link-ay">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    {t('navProfile')}
                  </Link>
                  <Link href="/wishlist" onClick={closeMobile} className="mob-link-ay">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                    {t('navWishlist')}
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={closeMobile} className="mob-link-ay">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                      {t('navAdmin')}
                    </Link>
                  )}
                  <button onClick={() => { logout(); closeMobile() }} className="mob-link-ay" style={{ color: '#e8002d' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    {t('navLogout')}
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={closeMobile} className="mob-link-ay">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  {t('navSignIn')}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
