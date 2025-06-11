'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye, EyeOff, ShoppingBag } from 'lucide-react'

export default function AuthForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // ログイン処理をここに実装
    console.log('Login submitted')
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
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-slate-300" />
                      <span className="text-slate-600">ログイン状態を保持</span>
                    </label>
                    <a href="#" className="text-slate-900 hover:underline font-medium">
                      パスワードを忘れた方
                    </a>
                  </div>
                  <Button type="submit" className="w-full h-11 bg-slate-900 hover:bg-slate-800">
                    ログイン
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
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="mt-1 rounded border-slate-300"
                    />
                    <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer">
                      <a href="#" className="text-slate-900 hover:underline font-medium">
                        利用規約
                      </a>
                      および
                      <a href="#" className="text-slate-900 hover:underline font-medium">
                        プライバシーポリシー
                      </a>
                      に同意します
                    </label>
                  </div>
                  <Button type="submit" className="w-full h-11 bg-slate-900 hover:bg-slate-800">
                    アカウントを作成
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
