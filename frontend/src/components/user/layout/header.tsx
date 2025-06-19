'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCart } from '@/context/CartContext'
import { deleteCookie, getCookie } from 'cookies-next'
import { LogOut, Settings, ShoppingCart, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function UserHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [userToken, setUserToken] = useState<string | null | undefined>(undefined)
  // 静的なカート商品数（実際のアプリではAPIから取得）
  const { totalQuantity, resetCart } = useCart()

  useEffect(() => {
    const token = getCookie('user-token')
    setUserToken(typeof token === 'string' ? token : null)
  }, [pathname])

  const handleLogout = () => {
    deleteCookie('user-token', { path: '/' })
    setUserToken(null)
    router.push('/user/login')
  }

  const handleLogin = () => {
    resetCart() // カートをリセット
    router.push('/user/login')
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700">
      <h1 className="text-xl font-bold text-white cursor-pointer">
        <Link href="/user/products">User</Link>
      </h1>
      {!['/user/login', '/user/signup'].includes(pathname) && (
        <div className="flex items-center gap-4">
          {/* カートアイコン（ログイン・サインアップページでは非表示） */}
          <Link href="/user/cart" className="relative">
            <Button variant="ghost" size="sm" className="text-white hover:bg-slate-700 relative">
              <ShoppingCart className="w-5 h-5" />
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {totalQuantity > 99 ? '99+' : totalQuantity}
              </Badge>
            </Button>
          </Link>

          {/* ログイン/ログアウトボタン（userToken が undefined（まだ読み込み中）の間は非表示） */}
          {userToken !== undefined &&
            (userToken ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-slate-700">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/user/dashboard" className="flex items-center gap-2 cursor-pointer">
                      <User className="w-4 h-4" />
                      ダッシュボード
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/user/orders" className="flex items-center gap-2 cursor-pointer">
                      <Settings className="w-4 h-4" />
                      注文履歴
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    ログアウト
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleLogin} variant="default" className="hover:bg-slate-700">
                ログイン
              </Button>
            ))}
        </div>
      )}
    </header>
  )
}
