import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminLoginPage = pathname === '/admin/login' || pathname === '/admin/signup'
  const isUserLoginPage = pathname === '/user/login' || pathname === '/user/signup'

  const isAdminPath = pathname.startsWith('/admin')
  const isUserPath = pathname.startsWith('/user')

  const adminToken = request.cookies.get('admin-token')
  const userToken = request.cookies.get('user-token')

  // 🚫 ログイン・サインアップページは middleware 処理から除外
  if (isAdminLoginPage || isUserLoginPage) {
    return NextResponse.next()
  }

  // ✅ 公開ページは通す（ユーザー向けの非ログインページ）
  if (pathname === '/user/products' || pathname.startsWith('/user/products/')) {
    return NextResponse.next()
  }

  // ✅ トークンがない状態で保護ページにアクセス → ログインへ
  if (isAdminPath && !adminToken) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  if (isUserPath && !userToken) {
    return NextResponse.redirect(new URL('/user/login', request.url))
  }

  // ✅ トークンがある状態でログイン・サインアップ以外にアクセス → 通す
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/user/:path*'],
}
