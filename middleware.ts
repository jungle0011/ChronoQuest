import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
// import { getCurrentUserPlan } from './lib/firebase-client' // Removed for Edge compatibility

// List of paths that require premium access
const PREMIUM_PATHS = [
  '/create',
  '/dashboard',
  '/profile',
]

// List of paths that require basic or premium access
const BASIC_PATHS = [
  '/analytics',
  '/appointments',
  '/leads',
]

// Admin paths that require authentication
const ADMIN_PATHS = ['/admin']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Skip middleware for API routes and static files
  if (path.startsWith('/api/') || path.startsWith('/_next/')) {
    return NextResponse.next()
  }

  // Check if path requires admin access
  if (
    ADMIN_PATHS.some(adminPath => path.startsWith(adminPath)) &&
    path !== '/admin/login'
  ) {
    const session = request.cookies.get('admin_token')
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // NOTE: Premium/basic plan checks removed for Edge compatibility
  // If you want to protect these routes, do it in API routes or page components.

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api/domains|_next/static|_next/image|favicon.ico).*)'],
}
