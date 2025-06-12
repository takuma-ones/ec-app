'use client'

import { useRouter } from 'next/navigation'
import { deleteCookie, getCookie } from 'cookies-next'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import Link from 'next/link' // ← 追加

export default function AdminHeader() {
  const router = useRouter()
  const [adminToken, setAdminToken] = useState<string | null>(null)

  useEffect(() => {
    const token = getCookie('admin-token')
    setAdminToken(typeof token === 'string' ? token : null)
  }, [])

  const handleLogout = () => {
    deleteCookie('admin-token', { path: '/' })
    router.push('/admin/login')
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700">
      <Link href="/admin/dashboard" className="text-xl font-bold text-white hover:underline">
        管理者ダッシュボード
      </Link>
      {adminToken && (
        <Button onClick={handleLogout} variant="destructive">
          ログアウト
        </Button>
      )}
    </header>
  )
}
