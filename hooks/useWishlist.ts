'use client'
import { useWishlistContext } from '@/context/WishlistContext'

export function useWishlist(productId: number) {
  const { wished, toggle } = useWishlistContext()
  return { isWished: wished.has(productId), toggle: () => toggle(productId) }
}
