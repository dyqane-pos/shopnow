'use client'
import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

const LS_KEY = 'ay_wishlist'

function lsGet(): Set<number> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as number[])
  } catch { return new Set() }
}

function lsSave(ids: Set<number>) {
  localStorage.setItem(LS_KEY, JSON.stringify([...ids]))
}

function lsClear() {
  localStorage.removeItem(LS_KEY)
}

interface WishlistContextValue {
  wished: Set<number>
  toggle: (productId: number) => void
}

const WishlistContext = createContext<WishlistContextValue>({
  wished: new Set(),
  toggle: () => {},
})

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const [wished, setWished] = useState<Set<number>>(new Set())
  const mergedRef = useRef(false)

  useEffect(() => {
    if (loading) return

    if (!user) {
      setWished(lsGet())
      mergedRef.current = false
      return
    }

    const sb = createClient()
    sb.from('wishlist').select('product_id').eq('user_id', user.id).then(async ({ data }) => {
      const serverIds = new Set<number>(
        data?.map((r: { product_id: number }) => r.product_id) ?? []
      )

      if (!mergedRef.current) {
        mergedRef.current = true
        const guestIds = lsGet()
        if (guestIds.size > 0) {
          const toInsert = [...guestIds].filter(id => !serverIds.has(id))
          if (toInsert.length > 0) {
            await sb.from('wishlist').insert(
              toInsert.map(id => ({ user_id: user.id, product_id: id }))
            )
            toInsert.forEach(id => serverIds.add(id))
          }
          lsClear()
        }
      }

      setWished(new Set(serverIds))
    })
  }, [user, loading])

  const toggle = async (productId: number) => {
    const prev = wished.has(productId)

    if (!user) {
      setWished(s => {
        const next = new Set(s)
        if (prev) next.delete(productId); else next.add(productId)
        lsSave(next)
        return next
      })
      return
    }

    setWished(s => {
      const next = new Set(s)
      if (prev) next.delete(productId); else next.add(productId)
      return next
    })
    const sb = createClient()
    if (prev) {
      const { error } = await sb.from('wishlist').delete().eq('user_id', user.id).eq('product_id', productId)
      if (error) setWished(s => { const next = new Set(s); next.add(productId); return next })
    } else {
      const { error } = await sb.from('wishlist').insert({ user_id: user.id, product_id: productId })
      if (error) setWished(s => { const next = new Set(s); next.delete(productId); return next })
    }
  }

  return (
    <WishlistContext.Provider value={{ wished, toggle }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlistContext = () => useContext(WishlistContext)
