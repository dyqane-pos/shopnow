'use server'
import { createServiceSupabase } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function saveSetting(key: string, value: string) {
  const service = createServiceSupabase()
  const { error } = await service
    .from('settings')
    .upsert({ key, value }, { onConflict: 'key' })
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function getSetting(key: string): Promise<string | null> {
  const service = createServiceSupabase()
  const { data } = await service
    .from('settings').select('value').eq('key', key).maybeSingle()
  return data?.value ?? null
}
