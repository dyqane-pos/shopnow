'use server'
import { createServerSupabase, createServiceSupabase } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveProduct(_prev: unknown, formData: FormData) {
  // Verifiko autentikimin me anon client
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Jo i autorizuar' }

  const id = formData.get('id') as string | null
  const sizes = (formData.get('sizes') as string).split(',').map(s => s.trim()).filter(Boolean)

  const payload = {
    name: formData.get('name') as string,
    brand: formData.get('brand') as string,
    category: formData.get('category') as string,
    gender: formData.get('gender') as string,
    price: Number(formData.get('price')),
    old_price: formData.get('old_price') ? Number(formData.get('old_price')) : null,
    description: formData.get('description') as string,
    sizes,
    photo_url: formData.get('photo_url') as string || null,
    is_sale: formData.get('is_sale') === 'true',
    stars: Number(formData.get('stars') || 5),
    reviews: Number(formData.get('reviews') || 0),
    updated_at: new Date().toISOString(),
  }

  // Përdor service role për të kaluar RLS (shmang recursion-in)
  const service = createServiceSupabase()
  let error
  if (id) {
    const { error: e } = await service.from('products').update(payload).eq('id', id)
    error = e
  } else {
    const { error: e } = await service.from('products').insert({ ...payload, is_active: true, views: 0, created_by: user.id })
    error = e
  }

  if (error) return { error: error.message }
  revalidatePath('/admin/products')
  revalidatePath('/')
  redirect('/admin/products')
}

export async function deleteProduct(id: number) {
  const service = createServiceSupabase()
  await service.from('products').delete().eq('id', id)
  revalidatePath('/admin/products')
  revalidatePath('/')
}

export async function toggleActive(id: number, current: boolean) {
  const service = createServiceSupabase()
  await service.from('products').update({ is_active: !current }).eq('id', id)
  revalidatePath('/admin/products')
  revalidatePath('/')
}
