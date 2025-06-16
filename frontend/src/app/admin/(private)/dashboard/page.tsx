'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCategories } from '@/lib/api/admin/categories'
import { getProducts } from '@/lib/api/admin/products'
import { getUsers } from '@/lib/api/admin/users'
import {
  Activity,
  ArrowUpRight,
  Calendar,
  DollarSign,
  Eye,
  FolderOpen,
  Package,
  Plus,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

// 静的データ
const staticData = {
  userCount: 0,
  productCount: 0,
  categoryCount: 0,
  totalSales: 2847500,
  monthlyGrowth: 12.5,
  todayOrders: 23,
  pendingOrders: 7,

  topProducts: [
    { id: 1, name: 'ワイヤレスイヤホン', sales: 156, revenue: 234000 },
    { id: 2, name: 'スマートウォッチ', sales: 89, revenue: 445000 },
    { id: 3, name: 'ノートパソコン', sales: 34, revenue: 1020000 },
  ],
}

export default function AdminDashboardPage() {
  const [userCount, setUserCount] = useState(0)
  const [productCount, setProductCount] = useState(0)
  const [categoryCount, setCategoryCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUser = await getUsers()
        const fetchedProducts = await getProducts()
        const fetchedCategories = await getCategories()
        setUserCount(fetchedUser.length)
        setProductCount(fetchedProducts.length)
        setCategoryCount(fetchedCategories.length)
        setIsLoading(false)
      } catch (error) {
        console.error('取得エラー:', error)
      }
    }

    fetchData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">管理者ダッシュボード</h1>
          <p className="text-gray-600 mt-1">ECサイトの運営状況を確認できます</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/users">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">総ユーザー数</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{userCount.toLocaleString()}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8.2% 前月比
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/products">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">商品数</CardTitle>
              <Package className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{productCount}</div>
              <p className="text-xs text-gray-9s00 flex items-center mt-1">アクティブ商品</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/categories">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">カテゴリ数</CardTitle>
              <FolderOpen className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{categoryCount}</div>
              <p className="text-xs text-gray-500 mt-1">アクティブカテゴリ</p>
            </CardContent>
          </Card>
        </Link>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">今月の売上</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(staticData.totalSales)}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />+{staticData.monthlyGrowth}% 前月比
            </p>
          </CardContent>
        </Card>
      </div>

      {/* メインコンテンツ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 管理メニュー */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                クイックアクション
              </CardTitle>
              <CardDescription>よく使用する管理機能</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/products">
                <Button variant="outline" className="w-full justify-between hover:bg-purple-50">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    商品管理
                  </div>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>

              <Link href="/admin/categories">
                <Button variant="outline" className="w-full justify-between hover:bg-orange-50">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" />
                    カテゴリ管理
                  </div>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>

              <Link href="/admin/users">
                <Button variant="outline" className="w-full justify-between hover:bg-blue-50">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    ユーザー管理
                  </div>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>

              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">新規作成</p>
                <div className="space-y-2">
                  <Link href="/admin/products/create">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <Plus className="w-4 h-4 mr-2" />
                      新規商品追加
                    </Button>
                  </Link>

                  <Link href="/admin/categories/create">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                      <Plus className="w-4 h-4 mr-2" />
                      新規カテゴリ追加
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 今日の注文状況 */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                今日の注文
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">新規注文</span>
                  <Badge variant="default">{staticData.todayOrders}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">処理待ち</span>
                  <Badge variant="secondary">{staticData.pendingOrders}</Badge>
                </div>
                <Link href="/admin/orders">
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    <Eye className="w-4 h-4 mr-2" />
                    注文一覧を見る
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 最近のアクティビティと売上商品 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 売上上位商品 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                売上上位商品
              </CardTitle>
              <CardDescription>今月の売上実績</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staticData.topProducts.map((product, index) => (
                  <Link key={product.id} href="/admin/products/1" className="block">
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">販売数: {product.sales}個</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(product.revenue)}
                        </p>
                        <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
