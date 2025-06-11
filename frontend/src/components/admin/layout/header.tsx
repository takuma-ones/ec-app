'use client'

import { useRouter } from 'next/navigation'
import { deleteCookie, getCookie } from 'cookies-next'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export default function AdminHeader() {
  const router = useRouter()
  const [adminToken, setAdminToken] = useState<string | null>(null)

  useEffect(() => {
    const token = getCookie('admin-token')
    setAdminToken(typeof token === 'string' ? token : null)
  }, [])

  const handleLogout = () => {
    deleteCookie('admin-token', { path: '/admin' })
    router.push('/admin/login')
  }

  // adminTokenがなければヘッダー自体を表示しない
  if (!adminToken) return null

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700">
      <h1 className="text-xl font-bold text-white">管理者ダッシュボード</h1>
      <Button onClick={handleLogout} variant="destructive">
        ログアウト
      </Button>
    </header>
  )
}
