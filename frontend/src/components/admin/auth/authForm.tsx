'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Shield } from 'lucide-react'
import { useState } from 'react'
import { loginAdmin } from '@/lib/api/admin/auth'
import { useRouter } from 'next/navigation'
import { setCookie } from 'cookies-next'
import { AxiosError } from 'axios'
import { ValidationErrorResponse } from '@/types/common/validation'

export default function AdminLogin() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setFieldErrors({})

    try {
      const res = await loginAdmin({ email, password })

      setCookie('admin-token', res.token, { path: '/', maxAge: 60 * 60 })

      router.push('/admin/dashboard')
    } catch (error) {
      const axiosError = error as AxiosError<ValidationErrorResponse>

      if (axiosError.response?.status === 400 && Array.isArray(axiosError.response.data?.errors)) {
        const newErrors: Record<string, string> = {}
        axiosError.response.data.errors.forEach((e) => {
          newErrors[e.field] = e.defaultMessage
        })
        setFieldErrors(newErrors)
        
      }
    } finally {
      setIsLoading(false)
      console.log(fieldErrors)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 管理者ロゴ・ブランド部分 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">管理者ダッシュボード</h1>
          <p className="text-slate-300 text-sm">管理者専用ログイン</p>
        </div>

        <Card className="shadow-2xl border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-400" />
              管理者ログイン
            </CardTitle>
            <CardDescription className="text-slate-300">
              管理者アカウントでログインしてください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-slate-200">
                  管理者メールアドレス
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-red-400 focus:ring-red-400/20"
                />
                {fieldErrors.email && (
                  <p className="text-sm text-red-400 mt-1">{fieldErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-slate-200">
                  パスワード
                </Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="管理者パスワードを入力"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-red-400 focus:ring-red-400/20"
                  />
                  {fieldErrors.password && (
                    <p className="text-sm text-red-400 mt-1">{fieldErrors.password}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    認証中...
                  </div>
                ) : (
                  '管理者ダッシュボードにログイン'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* フッター */}
        <div className="text-center mt-6 text-sm text-slate-400">
          <p>© 2024 管理システム. 機密情報取扱注意</p>
        </div>
      </div>
    </div>
  )
}
