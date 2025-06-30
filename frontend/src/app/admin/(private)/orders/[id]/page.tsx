'use client'

import { BackButton } from '@/components/ui/back-button'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getOrder, updateOrderStatus } from '@/lib/api/admin/orders' // 管理者用API
import { buildImageUrl } from '@/lib/utils'
import type { OrderResponse } from '@/types/admin/order'
import { AlertCircle, Calendar, CheckCircle, Clock, Package, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminOrderDetailPage() {
  const params = useParams()
  const [order, setOrder] = useState<OrderResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState<string>('')

  useEffect(() => {
    fetchOrder()
  }, [params.id])

  const fetchOrder = async () => {
    setIsLoading(true)
    try {
      const id = Number(params.id)
      if (isNaN(id)) throw new Error('Invalid order ID')
      const data = await getOrder(id)
      setOrder(data)
      setNewStatus(data.status) // 初期ステータスセット
    } catch (error) {
      console.error('注文の取得に失敗しました:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => price.toLocaleString()
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PAID':
        return {
          badge: <Badge variant="secondary">未処理</Badge>,
          icon: <Clock className="w-5 h-5 text-yellow-500" />,
          message: 'ご注文を受け付けました。確認後、発送の手続きをしてください。',
        }
      case 'SHIPPED':
        return {
          badge: <Badge variant="default">発送</Badge>,
          icon: <CheckCircle className="w-5 h-5 text-blue-500" />,
          message: '発送いたしました。',
        }
      case 'shipped':
        return {
          badge: (
            <Badge variant="default" className="bg-blue-600">
              完了
            </Badge>
          ),
          icon: <Truck className="w-5 h-5 text-blue-600" />,
          message: '商品の配達が完了しました。',
        }
      case 'CANCELLED':
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

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewStatus(e.target.value)
  }

  const handleUpdateStatus = async () => {
    if (!order) return
    if (newStatus === order.status) return // ステータス変わってなければ何もしない
    setUpdating(true)
    try {
      const data = await updateOrderStatus(order.id, { status: newStatus }) // API呼び出しでステータス更新
      setOrder(data)
    } catch (error) {
      console.error('ステータス更新に失敗しました:', error)
      alert('ステータスの更新に失敗しました。')
    } finally {
      setUpdating(false)
    }
  }

  if (isLoading) {
    return <p>読み込み中...</p>
  }

  if (!order) {
    return (
      <div>
        <p>注文が見つかりません。</p>
        <Link href="/admin/orders">注文一覧に戻る</Link>
      </div>
    )
  }

  const statusInfo = getStatusInfo(order.status)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6 flex items-center gap-4">
          <BackButton variant="custom" customPath="/admin/orders" />
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="w-8 h-8 text-purple-500" />
            注文詳細
          </h1>
          <p>注文ID: {order.id}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {statusInfo.icon} 注文ステータス {statusInfo.badge}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{statusInfo.message}</p>

              <div className="flex items-center gap-2 mb-4">
                <label htmlFor="status-select" className="font-medium">
                  発送ステータス変更:
                </label>
                <select
                  id="status-select"
                  value={newStatus}
                  onChange={handleStatusChange}
                  className="border rounded px-2 py-1"
                  disabled={updating}
                >
                  <option value="PAID">未処理</option>
                  <option value="SHIPPED">発送</option>
                  <option value="DELIVERED">完了</option>
                  <option value="CANCELLED">キャンセル</option>
                </select>
                <Button
                  onClick={handleUpdateStatus}
                  disabled={updating || newStatus === order.status}
                  size="sm"
                >
                  {updating ? '更新中...' : '更新'}
                </Button>
              </div>

              <div className="text-sm text-gray-600">
                <Calendar className="inline w-4 h-4 mr-1" />
                注文日: {formatDate(order.createdAt)}
              </div>
            </CardContent>
          </Card>

          {/* 以下、ユーザー詳細とほぼ同じで注文商品や配送先情報など表示 */}
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
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={buildImageUrl(item.product.productImages[0].imageUrl)}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="font-semibold hover:underline"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-600">
                        {item.quantity} × ￥{formatPrice(item.product.price)}
                      </p>
                    </div>
                    <div className="font-semibold">
                      ￥{formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>注文概要</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>小計</span>
                  <span>￥{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>送料</span>
                  <span>￥{order.totalAmount >= 5000 ? '0' : '500'}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>合計</span>
                  <span>
                    ￥{formatPrice(order.totalAmount + (order.totalAmount >= 5000 ? 0 : 500))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>配送先情報</CardTitle>
            </CardHeader>
            <CardContent>
              <p>氏名: {order.userName}</p>
              <p>電話番号: {order.phone}</p>
              <p>住所: {order.shippingAddress}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
