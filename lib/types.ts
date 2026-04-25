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
  tags?: string[]
  color?: string | null
  material?: string | null
  size_info?: string | null
  return_policy?: string | null
  photo_url?: string | null
  photos?: string[]
  is_sale: boolean
  is_active: boolean
  stars: number
  reviews: number
  views: number
  created_by?: string
  created_at: string
  updated_at: string
}

export interface DeliveryInfo {
  name: string
  phone: string
  address: string
  city: string
}

export interface Order {
  id: number
  user_id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_method?: 'cash' | 'card'
  delivery_info?: DeliveryInfo
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
  'Suits & jackets', 'Swimwear', 'Coats', 'Plus sizes', 'Occasions', 'Exclusive',
]

export const PRODUCT_TAGS = SIDEBAR_LINKS

export const PRODUCT_COLORS = [
  'E zezë', 'E bardhë', 'Gri', 'Kafe', 'Beige',
  'Blu', 'Navy', 'E kuqe', 'Rozë', 'Vjollcë',
  'E gjelbër', 'E verdhë', 'Portokalli', 'Shumëngjyrësh',
]

export const PRODUCT_MATERIALS = [
  'Pambuk', 'Poliester', 'Denim', 'Lesh', 'Lëkurë',
  'Mëndafsh', 'Liri', 'Najlon', 'Viskozë', 'Sintetik',
]

export const COLOR_HEX: Record<string, string> = {
  'E zezë': '#1a1a1a', 'E bardhë': '#f5f5f3', 'Gri': '#9e9e9e',
  'Kafe': '#795548', 'Beige': '#d7c4a3', 'Blu': '#1565c0',
  'Navy': '#0d1b4b', 'E kuqe': '#e8002d', 'Rozë': '#f48fb1',
  'Vjollcë': '#7b1fa2', 'E gjelbër': '#2e7d32', 'E verdhë': '#f9a825',
  'Portokalli': '#e65100', 'Shumëngjyrësh': 'linear-gradient(135deg,#e8002d,#1565c0,#2e7d32)',
}
