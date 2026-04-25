'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export function useProductViewerCounts(): Record<number, number> {
  const [counts, setCounts] = useState<Record<number, number>>({})

  useEffect(() => {
    const supabase = createClient()
    const ch = supabase.channel('product-viewers')

    const sync = () => {
      const state = ch.presenceState<{ productId: number }>()
      const next: Record<number, number> = {}
      for (const entries of Object.values(state)) {
        for (const entry of entries) {
          if (entry.productId != null) {
            next[entry.productId] = (next[entry.productId] ?? 0) + 1
          }
        }
      }
      setCounts(next)
    }

    ch
      .on('presence', { event: 'sync' }, sync)
      .on('presence', { event: 'join' }, sync)
      .on('presence', { event: 'leave' }, sync)
      .subscribe()

    return () => {
      supabase.removeChannel(ch)
    }
  }, [])

  return counts
}
