'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye, EyeOff, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { setCookie } from 'cookies-next'
import { AxiosError } from 'axios'
import { ValidationErrorResponse } from '@/types/common/validation'
import { loginUser } from '@/lib/api/user/auth'

export default function UserAuthForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setFieldErrors({})

    try {
      const res = await loginUser({ email, password })

      setCookie('user-token', res.token, { path: '/', maxAge: 60 * 60 })

      router.push('/user/products')
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

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // サインアップ処理をここに実装
    console.log('Signup submitted')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* ロゴ・ブランド部分 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-full mb-4">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">ECストア</h1>
          <p className="text-slate-600 text-sm">アカウントにアクセス</p>
        </div>

        <Card className="shadow-lg border-0">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">ログイン</TabsTrigger>
              <TabsTrigger value="signup">新規登録</TabsTrigger>
            </TabsList>

            {/* ログインタブ */}
            <TabsContent value="login">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl">ログイン</CardTitle>
                <CardDescription>メールアドレスとパスワードを入力してください</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">メールアドレス</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="example@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">パスワード</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="パスワードを入力"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-11 bg-slate-900 hover:bg-slate-800">
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        認証中...
                      </div>
                    ) : (
                      'ログイン'
                    )}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            {/* サインアップタブ */}
            <TabsContent value="signup">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl">新規登録</CardTitle>
                <CardDescription>アカウントを作成して始めましょう</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">お名前</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="山田 太郎"
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">メールアドレス</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="example@email.com"
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">パスワード</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showSignupPassword ? 'text' : 'password'}
                        placeholder="8文字以上のパスワード"
                        required
                        minLength={8}
                        className="h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      >
                        {showSignupPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      8文字以上で、英数字を含むパスワードを設定してください
                    </p>
                  </div>
                  <Button type="submit" className="w-full h-11 bg-slate-900 hover:bg-slate-800">
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        認証中...
                      </div>
                    ) : (
                      'アカウントを作成'
                    )}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        {/* フッター */}
        <div className="text-center mt-6 text-sm text-slate-500">
          <p>© 2024 ECストア. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
