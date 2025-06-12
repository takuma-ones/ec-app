'use client'

import { useRouter } from 'next/navigation'
import { deleteCookie, getCookie } from 'cookies-next'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export default function UserHeader() {
  const router = useRouter()
  const [userToken, setUserToken] = useState<string | null | undefined>(undefined)

  useEffect(() => {
    const token = getCookie('user-token')
    setUserToken(typeof token === 'string' ? token : null)
  }, [])

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
      <h1 className="text-xl font-bold text-white">User</h1>

      {/* Button は userToken が undefined（まだ読み込み中）の間は非表示 */}
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
    </header>
  )
}
