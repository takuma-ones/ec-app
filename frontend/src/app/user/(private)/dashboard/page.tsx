'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getCart } from '@/lib/api/user/carts'
import { getOrders } from '@/lib/api/user/orders'
import { getProfile } from '@/lib/api/user/profile'
import type { CartResponse } from '@/types/user/cart'
import type { OrderResponse } from '@/types/user/order'
import {
  ArrowRight,
  Bell,
  CreditCard,
  DollarSign,
  Eye,
  Heart,
  History,
  MapPin,
  Package,
  Settings,
  ShoppingCart,
  Star,
  TrendingUp,
  User,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function UserDashboardPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [cart, setCart] = useState<CartResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 注文とカートのデータを並列で取得
        const [ordersData, cartData, profileData] = await Promise.all([
          getOrders(),
          getCart(),
          getProfile(),
        ])
        setUserName(profileData.name || 'ゲスト')
        setOrders(ordersData)
        setCart(cartData)
      } catch (error) {
        console.error('データの取得に失敗しました:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatPrice = (price: number) => {
    return price.toLocaleString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">注文受付中</Badge>
      case 'confirmed':
        return <Badge variant="default">注文確定</Badge>
      case 'shipped':
        return (
          <Badge variant="default" className="bg-blue-600">
            発送済み
          </Badge>
        )
      case 'delivered':
        return (
          <Badge variant="default" className="bg-green-600">
            配達完了
          </Badge>
        )
      case 'cancelled':
        return <Badge variant="destructive">キャンセル</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // const getInitials = (name: string) => {
  //   return name
  //     .split(' ')
  //     .map((n) => n[0])
  //     .join('')
  //     .toUpperCase()
  // }

  // 統計データの計算
  const totalOrders = orders.length
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0)
  const recentOrders = orders.slice(0, 3)
  const deliveredOrders = orders.filter((order) => order.status === 'delivered').length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-96 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-semibold">
                  {userName}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">おかえりなさい、{userName}さん</h1>
                <p className="text-gray-600">今日も素敵なお買い物を！</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                通知
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                設定
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">総注文数</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">総購入金額</p>
                  <p className="text-2xl font-bold text-gray-900">¥{formatPrice(totalSpent)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">カート内商品</p>
                  <p className="text-2xl font-bold text-gray-900">{cart?.totalQuantity || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">配達完了</p>
                  <p className="text-2xl font-bold text-gray-900">{deliveredOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2 space-y-6">
            {/* 最近の注文 */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <History className="w-5 h-5" />
                      最近の注文
                    </CardTitle>
                    <CardDescription>最新の注文状況を確認できます</CardDescription>
                  </div>
                  <Link href="/user/orders">
                    <Button variant="outline" size="sm">
                      すべて見る
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">注文 #{order.id}</p>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-sm text-gray-600">
                            {order.items.length}点の商品 • {formatDate(order.createdAt)}
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            ¥{formatPrice(order.totalAmount)}
                          </p>
                        </div>
                        <Link href={`/user/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">まだ注文がありません</p>
                    <Link href="/user/products">
                      <Button className="mt-4">商品を見る</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* カート内商品 */}
            {cart && cart.cartItems.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        カート内商品
                      </CardTitle>
                      <CardDescription>
                        {cart.totalQuantity}点の商品がカートに入っています
                      </CardDescription>
                    </div>
                    <Link href="/user/cart">
                      <Button variant="outline" size="sm">
                        カートを見る
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cart.cartItems.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-12 h-12 rounded overflow-hidden bg-white">
                          <Image
                            src={
                              item.product.productImages.length > 0
                                ? item.product.productImages[0].imageUrl || '/placeholder.svg'
                                : '/placeholder.svg?height=48&width=48'
                            }
                            alt={item.product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.product.name}</p>
                          <p className="text-xs text-gray-500">数量: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-medium">
                          ¥{formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                    {cart.cartItems.length > 3 && (
                      <p className="text-sm text-gray-500 text-center">
                        他 {cart.cartItems.length - 3} 点
                      </p>
                    )}
                    <Separator />
                    <div className="flex justify-between items-center font-bold">
                      <span>合計</span>
                      <span>¥{formatPrice(cart.totalPrice)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* クイックアクション */}
            <Card>
              <CardHeader>
                <CardTitle>クイックアクション</CardTitle>
                <CardDescription>よく使う機能へのショートカット</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/user/products">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="w-4 h-4 mr-3" />
                    商品を見る
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Button>
                </Link>

                <Link href="/user/orders">
                  <Button variant="outline" className="w-full justify-start">
                    <History className="w-4 h-4 mr-3" />
                    注文履歴
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Button>
                </Link>

                <Link href="/user/cart">
                  <Button variant="outline" className="w-full justify-start">
                    <ShoppingCart className="w-4 h-4 mr-3" />
                    カートを見る
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Button>
                </Link>

                <Button variant="outline" className="w-full justify-start">
                  <Heart className="w-4 h-4 mr-3" />
                  お気に入り
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Button>
              </CardContent>
            </Card>

            {/* アカウント情報 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  アカウント情報
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {userName}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{userName}</p>
                    <p className="text-sm text-gray-500">プレミアム会員</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">配送先登録済み</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">支払い方法登録済み</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">ポイント: 1,250pt</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  <Settings className="w-4 h-4 mr-2" />
                  アカウント設定
                </Button>
              </CardContent>
            </Card>

            {/* お知らせ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  お知らせ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm font-medium text-blue-900">新商品入荷</p>
                    </div>
                    <p className="text-xs text-blue-700">人気ブランドの新作が入荷しました</p>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-sm font-medium text-green-900">送料無料キャンペーン</p>
                    </div>
                    <p className="text-xs text-green-700">3,000円以上で送料無料中</p>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <p className="text-sm font-medium text-purple-900">ポイント2倍</p>
                    </div>
                    <p className="text-xs text-purple-700">今週末はポイント2倍デー</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
