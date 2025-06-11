import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🔽 ログインページは除外
  if (pathname === "/admin/login" || pathname === "/user/login") {
    return NextResponse.next();
  }

  // admin配下の認証チェック
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin-token");
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // user配下の認証チェック
  if (pathname.startsWith("/user")) {
    const token = request.cookies.get("user-token");
    if (!token) {
      return NextResponse.redirect(new URL("/user/login", request.url));
    }
  }

  // その他はそのまま通す
  return NextResponse.next();
}

// middlewareを適用するパスを指定（オプション）
export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
