'use server'
import { createServiceSupabase, getAdminProfile } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function verifyOwnership(productId: number | string): Promise<{ userId: string; role: 'admin' | 'superadmin' } | { error: string }> {
  const admin = await getAdminProfile()
  if (!admin) return { error: 'Jo i autorizuar' }
  if (admin.role === 'superadmin') return admin

  const service = createServiceSupabase()
  const { data } = await service.from('products').select('created_by').eq('id', productId).single()
  if (!data) return { error: 'Produkti nuk u gjet' }
  if (data.created_by !== admin.userId) return { error: 'Nuk keni leje për këtë produkt' }

  return admin
}

export async function saveProduct(_prev: unknown, formData: FormData) {
  const admin = await getAdminProfile()
  if (!admin) return { error: 'Jo i autorizuar' }

  const id = formData.get('id') as string | null

  // Nëse është update, verifiko ownership
  if (id) {
    const check = await verifyOwnership(id)
    if ('error' in check) return check
  }

  const sizes = (formData.get('sizes') as string).split(',').map(s => s.trim()).filter(Boolean)
  const tags = formData.getAll('tags') as string[]
  const photosRaw = formData.get('photos_json') as string
  const photos: string[] = photosRaw ? JSON.parse(photosRaw) : []

  const payload = {
    name: formData.get('name') as string,
    brand: formData.get('brand') as string,
    category: formData.get('category') as string,
    gender: formData.get('gender') as string,
    price: Number(formData.get('price')),
    old_price: formData.get('old_price') ? Number(formData.get('old_price')) : null,
    description: formData.get('description') as string,
    sizes,
    tags,
    photos,
    photo_url: photos[0] ?? formData.get('photo_url') as string ?? null,
    is_sale: formData.get('is_sale') === 'true',
    stars: Number(formData.get('stars') || 5),
    reviews: Number(formData.get('reviews') || 0),
    updated_at: new Date().toISOString(),
  }

  const service = createServiceSupabase()
  let error
  if (id) {
    const { error: e } = await service.from('products').update(payload).eq('id', id)
    error = e
  } else {
    const { error: e } = await service.from('products').insert({ ...payload, is_active: true, views: 0, created_by: admin.userId })
    error = e
  }

  if (error) return { error: error.message }
  revalidatePath('/admin/products')
  revalidatePath('/')
  redirect('/admin/products')
}

export async function deleteProduct(id: number) {
  const check = await verifyOwnership(id)
  if ('error' in check) return

  const service = createServiceSupabase()
  await service.from('products').delete().eq('id', id)
  revalidatePath('/admin/products')
  revalidatePath('/')
}

export async function toggleActive(id: number, current: boolean) {
  const check = await verifyOwnership(id)
  if ('error' in check) return

  const service = createServiceSupabase()
  await service.from('products').update({ is_active: !current }).eq('id', id)
  revalidatePath('/admin/products')
  revalidatePath('/')
}
