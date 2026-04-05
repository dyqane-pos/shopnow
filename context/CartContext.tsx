'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import type { CartItem, Product } from '@/lib/types'

interface CartContextValue {
  items: CartItem[]
  hydrated: boolean
  cartCount: number
  cartTotal: number
  addItem: (product: Product, size: string, qty: number) => void
  removeItem: (productId: number, size: string) => void
  updateQty: (productId: number, size: string, qty: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue>({
  items: [], hydrated: false, cartCount: 0, cartTotal: 0,
  addItem: () => {}, removeItem: () => {}, updateQty: () => {}, clearCart: () => {},
})

const CART_KEY = 'ay_cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try { const s = localStorage.getItem(CART_KEY); if (s) setItems(JSON.parse(s)) } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items, hydrated])

  const addItem = (product: Product, size: string, qty: number) => {
    setItems(prev => {
      const ex = prev.find(i => i.product_id === product.id && i.size === size)
      if (ex) return prev.map(i => i.product_id === product.id && i.size === size ? { ...i, qty: i.qty + qty } : i)
      return [...prev, { product_id: product.id, name: product.name, brand: product.brand, photo_url: product.photo_url, price: product.price, size, qty }]
    })
  }

  const removeItem = (productId: number, size: string) =>
    setItems(prev => prev.filter(i => !(i.product_id === productId && i.size === size)))

  const updateQty = (productId: number, size: string, qty: number) => {
    if (qty <= 0) { removeItem(productId, size); return }
    setItems(prev => prev.map(i => i.product_id === productId && i.size === size ? { ...i, qty } : i))
  }

  const clearCart = () => setItems([])
  const cartCount = items.reduce((s, i) => s + i.qty, 0)
  const cartTotal = items.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ items, hydrated, cartCount, cartTotal, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCartContext = () => useContext(CartContext)
