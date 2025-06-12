import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminLogin = pathname === '/admin/login' || pathname === '/admin/signup'
  const isUserLogin = pathname === '/user/login' || pathname === '/user/signup'

  const isAdminPath = pathname.startsWith('/admin')
  const isUserPath = pathname.startsWith('/user')

  const adminToken = request.cookies.get('admin-token')
  const userToken = request.cookies.get('user-token')

  // 🔁 トークンがある状態でログイン・サインアップにアクセス → リダイレクト
  if (isAdminLogin && adminToken) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  if (isUserLogin && userToken) {
    return NextResponse.redirect(new URL('/user/products', request.url))
  }

  // 🔓 公開ページは通す（ユーザー向けの非ログインページ）
  if (pathname === '/user/products' || pathname.startsWith('/user/products/')) {
    return NextResponse.next()
  }

  // 🔐 管理者ページの認証チェック
  if (isAdminPath && !adminToken) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // 🔐 ユーザーページの認証チェック
  if (isUserPath && !userToken) {
    return NextResponse.redirect(new URL('/user/login', request.url))
  }

  // 通常通過
  return NextResponse.next()
}

// ✅ middleware の対象パスを指定
export const config = {
  matcher: ['/admin/:path*', '/user/:path*'],
}
