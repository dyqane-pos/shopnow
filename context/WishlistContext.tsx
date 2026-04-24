'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

interface WishlistContextValue {
  wished: Set<number>
  toggle: (productId: number) => void
}

const WishlistContext = createContext<WishlistContextValue>({
  wished: new Set(),
  toggle: () => {},
})

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [wished, setWished] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!user) { setWished(new Set()); return }
    const sb = createClient()
    sb.from('wishlist').select('product_id').eq('user_id', user.id).then(({ data }) => {
      if (data) setWished(new Set(data.map((r: { product_id: number }) => r.product_id)))
    })
  }, [user])

  const toggle = async (productId: number) => {
    if (!user) return
    const prev = wished.has(productId)
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
