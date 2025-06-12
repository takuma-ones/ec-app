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
import { loginUser, signUpUser } from '@/lib/api/user/auth'

export default function UserAuthForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // ログイン用
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // サインアップ用
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupPhone, setSignupPhone] = useState('')
  const [signupAddress, setSignupAddress] = useState('')
  const [signupFieldErrors, setSignupFieldErrors] = useState<Record<string, string>>({})

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
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSignupFieldErrors({})

    try {
      const res = await signUpUser({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        phone: signupPhone,
        address: signupAddress,
      })

      setCookie('user-token', res.token, { path: '/', maxAge: 60 * 60 })
      router.push('/user/products')
    } catch (error) {
      const axiosError = error as AxiosError<ValidationErrorResponse>
      if (axiosError.response?.status === 400 && Array.isArray(axiosError.response.data?.errors)) {
        const newErrors: Record<string, string> = {}
        axiosError.response.data.errors.forEach((e) => {
          newErrors[e.field] = e.defaultMessage
        })
        setSignupFieldErrors(newErrors)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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

            {/* ログイン */}
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11"
                    />
                    {fieldErrors.email && (
                      <p className="text-red-500 text-sm">{fieldErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">パスワード</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
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
                    {fieldErrors.password && (
                      <p className="text-red-500 text-sm">{fieldErrors.password}</p>
                    )}
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

            {/* 新規登録 */}
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
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                      className="h-11"
                    />
                    {signupFieldErrors.name && (
                      <p className="text-red-500 text-sm">{signupFieldErrors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">メールアドレス</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      className="h-11"
                    />
                    {signupFieldErrors.email && (
                      <p className="text-red-500 text-sm">{signupFieldErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">パスワード</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showSignupPassword ? 'text' : 'password'}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
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
                    {signupFieldErrors.password && (
                      <p className="text-red-500 text-sm">{signupFieldErrors.password}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">電話番号</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      required
                      className="h-11"
                    />
                    {signupFieldErrors.phone && (
                      <p className="text-red-500 text-sm">{signupFieldErrors.phone}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-address">住所</Label>
                    <Input
                      id="signup-address"
                      type="text"
                      value={signupAddress}
                      onChange={(e) => setSignupAddress(e.target.value)}
                      required
                      className="h-11"
                    />
                    {signupFieldErrors.address && (
                      <p className="text-red-500 text-sm">{signupFieldErrors.address}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full h-11 bg-slate-900 hover:bg-slate-800">
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        登録中...
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

        <div className="text-center mt-6 text-sm text-slate-500">
          <p>© 2024 ECストア. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
