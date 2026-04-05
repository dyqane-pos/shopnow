export interface Profile {
  id: string
  name: string
  role: 'user' | 'admin' | 'superadmin'
  created_at: string
}

export interface Product {
  id: number
  name: string
  brand: string
  category: string
  gender?: string
  price: number
  old_price?: number | null
  description?: string
  sizes: string[]
  photo_url?: string | null
  is_sale: boolean
  is_active: boolean
  stars: number
  reviews: number
  views: number
  created_by?: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: number
  user_id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
}

export interface CartItem {
  product_id: number
  name: string
  brand: string
  photo_url?: string | null
  price: number
  size: string
  qty: number
}

export interface WishlistItem {
  id: number
  user_id: string
  product_id: number
  created_at: string
}

export interface Category {
  id: string
  label: string
  type: 'product' | 'gender' | 'sidebar'
  sort_order: number
  is_active: boolean
}

export const CATEGORIES = [
  { id: 'all', label: 'Të gjitha' },
  { id: 'clothing', label: 'Veshje' },
  { id: 'shoes', label: 'Këpucë' },
  { id: 'accessories', label: 'Aksesore' },
  { id: 'sports', label: 'Sport' },
  { id: 'electronics', label: 'Elektronikë' },
]

export const SIDEBAR_LINKS = [
  'New', 'Trending', 'T-shirts', 'Jeans', 'Jackets',
  'Pants', 'Sweaters & hoodies', 'Underwear', 'Button-up shirts',
  'Suits & jackets', 'Swimwear', 'Coats', 'Plus sizes', 'Occasions', 'Exclusive'
]
