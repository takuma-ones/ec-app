'use client'

import { useRouter } from 'next/navigation'
import { deleteCookie, getCookie } from 'cookies-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function UserHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [userToken, setUserToken] = useState<string | null | undefined>(undefined)
  // 静的なカート商品数（実際のアプリではAPIから取得）
  const { totalQuantity } = useCart()

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
    router.push('/user/login')
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700">
      <h1 className="text-xl font-bold text-white cursor-pointer">
        <Link href="/user/products">User</Link>
      </h1>
      {!['/user/login', '/user/signup'].includes(pathname) && (
        <div className="flex items-center gap-4">
          {/* ログイン/ログアウトボタン（userToken が undefined（まだ読み込み中）の間は非表示） */}
          {userToken !== undefined &&
            (userToken ? (
              <Button onClick={handleLogout} variant="destructive">
                ログアウト
              </Button>
            ) : (
              <Button onClick={handleLogin} variant="default">
                ログイン
              </Button>
            ))}

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
        </div>
      )}
    </header>
  )
}
