'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/types'

interface AuthContextValue {
  user: User | null; profile: Profile | null; loading: boolean
  isAdmin: boolean; isSuperAdmin: boolean
}

const AuthContext = createContext<AuthContextValue>({
  user: null, profile: null, loading: true, isAdmin: false, isSuperAdmin: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sb = createClient()
    sb.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); loadProfile(sb, session.user.id) }
      else setLoading(false)
    })
    const { data: { subscription } } = sb.auth.onAuthStateChange((_e, session) => {
      if (session?.user) { setUser(session.user); loadProfile(sb, session.user.id) }
      else { setUser(null); setProfile(null); setLoading(false) }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(sb: ReturnType<typeof createClient>, uid: string) {
    const { data } = await sb.from('profiles').select('*').eq('id', uid).single()
    setProfile(data); setLoading(false)
  }

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      isAdmin: profile?.role === 'admin' || profile?.role === 'superadmin',
      isSuperAdmin: profile?.role === 'superadmin',
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
