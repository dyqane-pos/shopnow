'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export function useWishlist(productId: number, initialWished = false) {
  const { user } = useAuth()
  const [isWished, setIsWished] = useState(initialWished)

  const toggle = async () => {
    if (!user) return
    const prev = isWished
    setIsWished(!prev)
    const sb = createClient()
    if (prev) {
      const { error } = await sb.from('wishlist').delete().eq('user_id', user.id).eq('product_id', productId)
      if (error) setIsWished(prev)
    } else {
      const { error } = await sb.from('wishlist').insert({ user_id: user.id, product_id: productId })
      if (error) setIsWished(prev)
    }
  }

  return { isWished, toggle }
}
