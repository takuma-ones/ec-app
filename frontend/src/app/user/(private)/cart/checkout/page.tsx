'use client'

import type React from 'react'

import { BackButton } from '@/components/ui/back-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { getCart } from '@/lib/api/user/carts'
import { createOrder } from '@/lib/api/user/orders'
import type { CartResponse } from '@/types/user/cart'
import type { CheckoutRequest } from '@/types/user/order'
import { CreditCard, MapPin } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [shippingAddress, setShippingAddress] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart()
        if (!data || !data.cartItems || data.cartItems.length === 0) {
          router.push('/user/cart')
          return
        }
        setCart(data)
      } catch (error) {
        console.error('カートの取得に失敗しました:', error)
        router.push('/user/cart')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCart()
  }, [router])

  const validateForm = () => {
    if (!shippingAddress.trim()) {
      setError('配送先住所は必須です')
      return false
    }
    setError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !cart) return

    setIsProcessing(true)
    try {
      const checkoutData: CheckoutRequest = {
        shippingAddress: shippingAddress.trim(),
      }

      await createOrder(checkoutData)
      router.push(`/user/orders/`)
    } catch (error) {
      console.error('注文の処理に失敗しました:', error)
      setError('注文の処理に失敗しました。もう一度お試しください。')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString()
  }

  const getShippingFee = () => {
    if (!cart) return 0
    return cart.totalPrice >= 5000 ? 0 : 500
  }

  const getTax = () => {
    if (!cart) return 0
    return Math.floor((cart.totalPrice + getShippingFee()) * 0.1)
  }

  const getTotalAmount = () => {
    if (!cart) return 0
    return cart.totalPrice + getShippingFee() + getTax()
  }

  const getMainImage = (item: any) => {
    if (!item.product?.productImages || item.product.productImages.length === 0) {
      return '/placeholder.svg?height=48&width=48'
    }

    const sortedImages = item.product.productImages
      .filter((img: any) => img?.imageUrl)
      .sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0))

    return sortedImages.length > 0
      ? sortedImages[0].imageUrl
      : '/placeholder.svg?height=48&width=48'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-96 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!cart) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <BackButton variant="custom" customPath="/user/cart" className="mr-2" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-8 h-8 text-green-500" />
                チェックアウト
              </h1>
              <p className="text-gray-600 mt-1">配送先を入力して注文を確定してください</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 入力フォーム */}
            <div className="lg:col-span-2 space-y-6">
              {/* 配送先情報 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    配送先住所
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="shippingAddress">
                      配送先住所 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="shippingAddress"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="〒150-0001 東京都渋谷区神宮前1-1-1 サンプルマンション101"
                      className={error ? 'border-red-500' : ''}
                    />
                    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
                    <p className="text-sm text-gray-500 mt-1">
                      郵便番号、住所、建物名・部屋番号を含む完全な住所を入力してください
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 注文サマリー */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>注文内容</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.cartItems &&
                    cart.cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
                          <Image
                            src={getMainImage(item) || '/placeholder.svg'}
                            alt={item.product?.name || '商品'}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {item.product?.name || '商品名不明'}
                          </p>
                          <p className="text-xs text-gray-500">数量: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-medium">
                          ¥{formatPrice((item.product?.price || 0) * item.quantity)}
                        </span>
                      </div>
                    ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>お支払い金額</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>商品小計</span>
                    <span>¥{formatPrice(cart.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>送料</span>
                    <span>
                      {getShippingFee() === 0 ? '無料' : `¥${formatPrice(getShippingFee())}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>消費税</span>
                    <span>¥{formatPrice(getTax())}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>合計</span>
                    <span>¥{formatPrice(getTotalAmount())}</span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-lg mt-6"
                    disabled={isProcessing || !shippingAddress.trim()}
                  >
                    {isProcessing ? '処理中...' : '注文を確定する'}
                  </Button>

                  <div className="text-xs text-gray-500 text-center mt-2">
                    <p>• 5,000円以上で送料無料</p>
                    <p>• 消費税10%が含まれています</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
