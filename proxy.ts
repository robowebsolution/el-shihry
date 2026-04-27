import { NextResponse, type NextRequest } from 'next/server'
import { getLocaleFromPathname } from '@/lib/i18n'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return await updateSession(request)
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-site-locale', getLocaleFromPathname(request.nextUrl.pathname))

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|fav-icons|favicon.ico|.*\\..*).*)',
  ],
}
