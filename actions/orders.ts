'use server'
import { createServerSupabase, createServiceSupabase } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import type { CartItem, DeliveryInfo } from '@/lib/types'

export async function checkout(
  items: CartItem[],
  total: number,
  payment_method: 'cash' | 'card',
  delivery_info: DeliveryInfo
) {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  const service = createServiceSupabase()
  const { error } = await service.from('orders').insert({
    user_id: user?.id ?? null, items, total, status: 'pending', payment_method, delivery_info
  })
  if (error) return { error: error.message }
  if (user) revalidatePath('/profile')
  return { success: true }
}

export async function updateOrderStatus(orderId: number, status: string) {
  const service = createServiceSupabase()
  const { error } = await service.from('orders').update({ status }).eq('id', orderId)
  if (error) return { error: error.message }
  revalidatePath('/admin/orders')
  return { success: true }
}
