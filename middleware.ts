import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If env vars are missing just pass through — app pages handle auth themselves
  if (!url || !key) return response

  try {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    })

    const { data: { user } } = await supabase.auth.getUser()
    const path = request.nextUrl.pathname

    const isProtected = ['/profile', '/admin'].some(p => path.startsWith(p))
    const isAuthRoute = path === '/login'

    if (isProtected && !user) {
      const next = request.nextUrl.clone()
      next.pathname = '/login'
      next.searchParams.set('next', path)
      return NextResponse.redirect(next)
    }

    if (isAuthRoute && user) {
      const next = request.nextUrl.clone()
      next.pathname = '/'
      return NextResponse.redirect(next)
    }
  } catch {}

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
