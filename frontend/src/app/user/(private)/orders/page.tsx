'use client'

import { BackButton } from '@/components/ui/back-button'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getOrders } from '@/lib/api/user/orders'
import { buildImageUrl } from '@/lib/utils'
import type { OrderResponse } from '@/types/user/order'
import { Calendar, Eye, MapPin, Package } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders()
        setOrders(data)
      } catch (error) {
        console.error('注文履歴の取得に失敗しました:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const formatPrice = (price: number) => {
    return price.toLocaleString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
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
          <div className="flex items-center gap-4">
            <BackButton variant="back" className="mr-2" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Package className="w-8 h-8 text-purple-500" />
                注文履歴
              </h1>
              <p className="text-gray-600 mt-1">過去のご注文を確認できます</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">注文履歴がありません</h2>
              <p className="text-gray-600 mb-6">まだ商品をご注文いただいていません</p>
              <Link href="/user/products">
                <Button>商品を見る</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        注文ID: {order.id}
                        {getStatusBadge(order.status)}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          注文日: {formatDate(order.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          配送先: {order.shippingAddress.substring(0, 20)}...
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ¥{formatPrice(order.totalAmount)}
                      </p>
                      <p className="text-sm text-gray-500">{order.items.length}点の商品</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* 商品一覧 */}
                    <div className="space-y-4">
                      {/* 商品を最大6個まで表示し、それ以上は省略 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {order.items.slice(0, 6).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="w-16 h-16 rounded overflow-hidden bg-white">
                              <Image
                                src={buildImageUrl(item.product.productImages[0].imageUrl)}
                                alt={item.product.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{item.product.name}</p>
                              <p className="text-xs text-gray-500">数量: {item.quantity}</p>
                              <p className="text-sm font-medium">
                                ¥{formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 商品数が6個を超える場合の表示 */}
                      {order.items.length > 6 && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                他 {order.items.length - 6} 点の商品
                              </span>
                            </div>
                            <Link href={`/user/orders/${order.id}`}>
                              <Button variant="outline" size="sm">
                                すべて見る
                              </Button>
                            </Link>
                          </div>

                          {/* 残りの商品の合計金額を表示 */}
                          <div className="mt-2 text-xs text-gray-500">
                            残り商品合計: ¥
                            {formatPrice(
                              order.items
                                .slice(6)
                                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* 配送先情報 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">配送先</h4>
                        <div className="text-sm text-gray-600">
                          <p>{order.shippingAddress}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">注文詳細</h4>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600">商品点数:</span>
                            <span>
                              {order.items.reduce((sum, item) => sum + item.quantity, 0)}点
                            </span>
                          </div>
                          <div className="flex justify-between font-medium pt-1 border-t">
                            <span>合計:</span>
                            <span>¥{formatPrice(order.totalAmount)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* アクションボタン */}
                    <div className="flex gap-3 pt-2">
                      <Link href={`/user/orders/${order.id}`}>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          詳細を見る
                        </Button>
                      </Link>
                      {order.status === 'delivered' && (
                        <Button variant="outline">再注文する</Button>
                      )}
                      {(order.status === 'pending' || order.status === 'confirmed') && (
                        <Button variant="outline" className="text-red-600 hover:text-red-700">
                          キャンセル
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
