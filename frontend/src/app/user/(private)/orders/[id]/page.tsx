'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { BackButton } from '@/components/ui/back-button'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getOrderById } from '@/lib/api/user/orders'
import { buildImageUrl } from '@/lib/utils'
import type { OrderResponse } from '@/types/user/order'
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  Package,
  Truck,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function OrderDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [order, setOrder] = useState<OrderResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isNewOrder = searchParams.get('new') === 'true'

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const id = Number.parseInt(params.id as string)
        if (isNaN(id)) {
          throw new Error('Invalid order ID')
        }

        const data = await getOrderById(id)
        setOrder(data)
      } catch (error) {
        console.error('注文の取得に失敗しました:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [params.id])

  const formatPrice = (price: number) => {
    return price.toLocaleString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          badge: <Badge variant="secondary">注文受付中</Badge>,
          icon: <Clock className="w-5 h-5 text-yellow-500" />,
          message: 'ご注文を受け付けました。確認後、注文確定のご連絡をいたします。',
        }
      case 'confirmed':
        return {
          badge: <Badge variant="default">注文確定</Badge>,
          icon: <CheckCircle className="w-5 h-5 text-blue-500" />,
          message: 'ご注文が確定しました。商品の準備を開始いたします。',
        }
      case 'shipped':
        return {
          badge: (
            <Badge variant="default" className="bg-blue-600">
              発送済み
            </Badge>
          ),
          icon: <Truck className="w-5 h-5 text-blue-600" />,
          message: '商品を発送いたしました。お届けまでしばらくお待ちください。',
        }
      case 'delivered':
        return {
          badge: (
            <Badge variant="default" className="bg-green-600">
              配達完了
            </Badge>
          ),
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          message: '商品をお届けいたしました。ありがとうございました。',
        }
      case 'cancelled':
        return {
          badge: <Badge variant="destructive">キャンセル</Badge>,
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
          message: 'ご注文がキャンセルされました。',
        }
      default:
        return {
          badge: <Badge variant="secondary">{status}</Badge>,
          icon: <Clock className="w-5 h-5 text-gray-500" />,
          message: '',
        }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/user/orders">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                注文履歴に戻る
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">注文が見つかりません</h1>
          </div>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">
                指定された注文は存在しないか、削除されている可能性があります。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(order.status)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <BackButton variant="custom" customPath="/user/orders" className="mr-2" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Package className="w-8 h-8 text-purple-500" />
                注文詳細
              </h1>
              <p className="text-gray-600 mt-1">注文ID: {order.id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 新規注文完了メッセージ */}
        {isNewOrder && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ご注文ありがとうございます！注文が正常に完了しました。確認メールをお送りしておりますのでご確認ください。
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メイン情報 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 注文ステータス */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {statusInfo.icon}
                  注文ステータス
                  {statusInfo.badge}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{statusInfo.message}</p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">注文日:</span>
                    <span className="font-medium">{formatDate(order.createdAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 注文商品 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>注文商品</span>
                  <Badge variant="outline">{order.items.length}点</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={item.id}>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={buildImageUrl(item.product.productImages[0].imageUrl)}
                            alt={item.product.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <Link href={`/user/products/${item.product.id}`}>
                            <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-500">SKU: {item.product.sku}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-lg font-bold">¥{formatPrice(item.price)}</span>
                            <span className="text-gray-600">× {item.quantity}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold">
                            ¥{formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                      {index < order.items.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}

                  {/* 商品数が多い場合の要約表示 */}
                  {order.items.length > 5 && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-900">注文商品合計</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-900">{order.items.length}点</p>
                          <p className="text-xs text-blue-700">
                            総数量: {order.items.reduce((sum, item) => sum + item.quantity, 0)}個
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 配送先情報 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  配送先情報
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Package className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{order.shippingAddress}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* 支払い情報 */}
            <Card>
              <CardHeader>
                <CardTitle>お支払い金額</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>合計</span>
                  <span>¥{formatPrice(order.totalAmount)}</span>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">商品点数</span>
                    <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)}点</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">注文日</span>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* アクション */}
            <Card>
              <CardHeader>
                <CardTitle>アクション</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.status === 'delivered' && (
                  <Button className="w-full">
                    <Package className="w-4 h-4 mr-2" />
                    再注文する
                  </Button>
                )}

                {(order.status === 'pending' || order.status === 'confirmed') && (
                  <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                    注文をキャンセル
                  </Button>
                )}

                <Button variant="outline" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  お問い合わせ
                </Button>

                <Button variant="outline" className="w-full">
                  領収書をダウンロード
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
