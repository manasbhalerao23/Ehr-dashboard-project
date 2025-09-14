import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/api/auth']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // If accessing a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // If not authenticated and trying to access protected route
  if (!req.auth && !isPublicRoute) {
    const loginUrl = new URL('/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}