'use client'
import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  const KEY = 'shopnow-sid'
  let id = sessionStorage.getItem(KEY)
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36)
    sessionStorage.setItem(KEY, id)
  }
  return id
}

export function useProductPresence(productId: number | null) {
  const channelRef = useRef<RealtimeChannel | null>(null)
  const clientRef = useRef(createClient())
  const productIdRef = useRef(productId)
  productIdRef.current = productId

  useEffect(() => {
    const client = clientRef.current
    const ch = client.channel('product-viewers', {
      config: { presence: { key: getSessionId() } },
    })

    ch.subscribe(async (status) => {
      if (status !== 'SUBSCRIBED') return
      if (productIdRef.current != null) {
        await ch.track({ productId: productIdRef.current })
      }
    })

    channelRef.current = ch
    return () => {
      client.removeChannel(ch)
      channelRef.current = null
    }
  }, [])

  useEffect(() => {
    const ch = channelRef.current
    if (!ch) return
    if (productId != null) {
      ch.track({ productId })
    } else {
      ch.untrack()
    }
  }, [productId])
}
