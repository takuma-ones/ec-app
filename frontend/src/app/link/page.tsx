'use client'

import type React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ExternalLink,
  Eye,
  FileText,
  FolderOpen,
  History,
  Home,
  Layers,
  LayoutDashboard,
  Package,
  Plus,
  Shield,
  ShoppingBag,
  ShoppingCart,
  User,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface PageLink {
  title: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  category: string
  status?: 'public' | 'admin' | 'demo'
}

const pageLinks: PageLink[] = [
  // 認証・ログイン関連
  {
    title: 'ユーザーログイン・サインアップ',
    description: '一般ユーザー向けの認証画面',
    href: '/',
    icon: User,
    category: '認証',
    status: 'public',
  },
  {
    title: '管理者ログイン',
    description: '管理者専用のログイン画面',
    href: '/admin',
    icon: Shield,
    category: '認証',
    status: 'admin',
  },

  // 管理者画面
  {
    title: '管理者ダッシュボード',
    description: '管理者向けのメインダッシュボード',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    category: '管理者',
    status: 'admin',
  },
  {
    title: 'ユーザー管理',
    description: '登録ユーザーの一覧と管理',
    href: '/admin/users',
    icon: Users,
    category: '管理者',
    status: 'admin',
  },
  {
    title: 'ユーザー詳細',
    description: '個別ユーザーの詳細情報',
    href: '/admin/users/1',
    icon: Eye,
    category: '管理者',
    status: 'admin',
  },
  {
    title: '商品管理',
    description: '商品の一覧・編集・削除',
    href: '/admin/products',
    icon: Package,
    category: '管理者',
    status: 'admin',
  },
  {
    title: '商品詳細・編集',
    description: '個別商品の詳細と編集',
    href: '/admin/products/1',
    icon: Eye,
    category: '管理者',
    status: 'admin',
  },
  {
    title: '新規商品作成',
    description: '新しい商品の登録',
    href: '/admin/products/create',
    icon: Plus,
    category: '管理者',
    status: 'admin',
  },
  {
    title: 'カテゴリー管理',
    description: '商品カテゴリーの管理',
    href: '/admin/categories',
    icon: FolderOpen,
    category: '管理者',
    status: 'admin',
  },
  {
    title: 'カテゴリー詳細・編集',
    description: '個別カテゴリーの詳細と編集',
    href: '/admin/categories/1',
    icon: Eye,
    category: '管理者',
    status: 'admin',
  },
  {
    title: '新規カテゴリー作成',
    description: '新しいカテゴリーの作成',
    href: '/admin/categories/create',
    icon: Plus,
    category: '管理者',
    status: 'admin',
  },

  // ユーザー向け画面
  {
    title: '商品一覧（ユーザー向け）',
    description: '一般ユーザー向けの商品一覧',
    href: '/user/products',
    icon: ShoppingBag,
    category: 'ユーザー',
    status: 'public',
  },
  {
    title: '商品詳細（ユーザー向け）',
    description: '一般ユーザー向けの商品詳細',
    href: '/user/products/1',
    icon: Eye,
    category: 'ユーザー',
    status: 'public',
  },
  {
    title: 'ショッピングカート',
    description: 'カート内商品の確認と編集',
    href: '/user/cart',
    icon: ShoppingCart,
    category: 'ユーザー',
    status: 'public',
  },
  {
    title: 'チェックアウト',
    description: '注文確定と支払い情報入力',
    href: '/user/cart/checkout',
    icon: ShoppingCart,
    category: 'ユーザー',
    status: 'public',
  },
  {
    title: '注文履歴',
    description: '過去の注文履歴一覧',
    href: '/user/order',
    icon: History,
    category: 'ユーザー',
    status: 'public',
  },
  {
    title: '注文詳細',
    description: '個別注文の詳細情報',
    href: '/user/order/1',
    icon: Eye,
    category: 'ユーザー',
    status: 'public',
  },

  // デモ・コンポーネント
  {
    title: 'コンポーネントデモ',
    description: '戻るボタンなどのコンポーネントデモ',
    href: '/admin/components',
    icon: Layers,
    category: 'デモ',
    status: 'demo',
  },
]

const categories = Array.from(new Set(pageLinks.map((link) => link.category)))

export default function LinkPage() {
  const router = useRouter()

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      router.replace('/') // 本番環境ではトップへリダイレクト
    }
  }, [])

  if (process.env.NODE_ENV !== 'development') {
    return null // リダイレクト中は何も表示しない
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'public':
        return <Badge variant="default">一般</Badge>
      case 'admin':
        return <Badge variant="destructive">管理者</Badge>
      case 'demo':
        return <Badge variant="secondary">デモ</Badge>
      default:
        return null
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'public':
        return 'border-l-blue-500'
      case 'admin':
        return 'border-l-red-500'
      case 'demo':
        return 'border-l-gray-500'
      default:
        return 'border-l-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">サイトマップ</h1>
              <p className="text-gray-600 mt-1">アプリケーション内の全ページへのリンク集</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 概要統計 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">総ページ数</p>
                  <p className="text-2xl font-bold">{pageLinks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">一般ページ</p>
                  <p className="text-2xl font-bold">
                    {pageLinks.filter((l) => l.status === 'public').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">管理者ページ</p>
                  <p className="text-2xl font-bold">
                    {pageLinks.filter((l) => l.status === 'admin').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">デモページ</p>
                  <p className="text-2xl font-bold">
                    {pageLinks.filter((l) => l.status === 'demo').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* カテゴリー別ページリスト */}
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryLinks = pageLinks.filter((link) => link.category === category)

            return (
              <div key={category}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  {category === '認証' && <User className="w-6 h-6" />}
                  {category === '管理者' && <Shield className="w-6 h-6" />}
                  {category === 'ユーザー' && <ShoppingBag className="w-6 h-6" />}
                  {category === 'デモ' && <Layers className="w-6 h-6" />}
                  {category}
                  <Badge variant="outline">{categoryLinks.length}ページ</Badge>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryLinks.map((link) => {
                    const Icon = link.icon

                    return (
                      <Card
                        key={link.href}
                        className={`hover:shadow-lg transition-all duration-300 border-l-4 ${getStatusColor(
                          link.status
                        )}`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Icon className="w-5 h-5 text-gray-600" />
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-lg leading-tight">
                                  {link.title}
                                </CardTitle>
                              </div>
                            </div>
                            {getStatusBadge(link.status)}
                          </div>
                          <CardDescription className="text-sm">{link.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 flex-1 mr-3">
                              {link.href}
                            </code>
                            <Link href={link.href}>
                              <Button size="sm" className="flex items-center gap-2">
                                <ExternalLink className="w-3 h-3" />
                                開く
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* フッター */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              このページは開発・テスト用のサイトマップです。本番環境では削除することをお勧めします。
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <Link href="/">
                <Button variant="outline">
                  <Home className="w-4 h-4 mr-2" />
                  トップページへ
                </Button>
              </Link>
              <Link href="/admin/dashboard">
                <Button variant="outline">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  管理者ダッシュボードへ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
