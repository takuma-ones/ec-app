'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getCart, updateCartItemQuantity, removeCartItem } from '@/lib/api/user/carts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
} from 'lucide-react'
import type { CartResponse, CartItem } from '@/types/user/cart'

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set())

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart()
        setCart(data)
      } catch (error) {
        console.error('カートの取得に失敗しました:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCart()
  }, [])

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 0) return

    setUpdatingItems((prev) => new Set(prev).add(itemId))
    try {
      const updatedCart = await updateCartItemQuantity(itemId, { quantity: newQuantity })
      setCart(updatedCart)
    } catch (error) {
      console.error('数量の更新に失敗しました:', error)
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const handleRemoveItem = async (itemId: number) => {
    setUpdatingItems((prev) => new Set(prev).add(itemId))
    try {
      const updatedCart = await removeCartItem(itemId)
      setCart(updatedCart)
    } catch (error) {
      console.error('商品の削除に失敗しました:', error)
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString()
  }

  const calculateSubtotal = (item: CartItem) => {
    return item.product.price * item.quantity
  }

  const getMainImage = (item: CartItem) => {
    const sortedImages = item.product.productImages
      .filter((img) => img.imageUrl)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    return sortedImages.length > 0
      ? sortedImages[0].imageUrl
      : '/placeholder.svg?height=100&width=100'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/user/products">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                商品一覧に戻る
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="w-8 h-8 text-blue-500" />
              ショッピングカート
            </h1>
          </div>

          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">カートが空です</h2>
              <p className="text-gray-600 mb-6">商品を追加してショッピングを始めましょう</p>
              <Link href="/user/products">
                <Button>商品を見る</Button>
              </Link>
            </CardContent>
          </Card>
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
            <Link href="/user/products">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                商品一覧に戻る
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingCart className="w-8 h-8 text-blue-500" />
                ショッピングカート
              </h1>
              <p className="text-gray-600 mt-1">{cart.totalQuantity}点の商品</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* カート商品一覧 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>カート内商品</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.cartItems.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-white">
                        <Image
                          src={getMainImage(item) || '/placeholder.svg'}
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

                        {/* カテゴリー表示 */}
                        {item.product.productCategories.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.product.productCategories.map((category, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {category.name}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <p className="text-lg font-bold text-gray-900 mt-1">
                          ¥{formatPrice(item.product.price)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          disabled={updatingItems.has(item.product.id) || item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          disabled={
                            updatingItems.has(item.product.id) ||
                            item.quantity >= item.product.stock
                          }
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold">¥{formatPrice(calculateSubtotal(item))}</p>
                        <p className="text-xs text-gray-500">在庫: {item.product.stock}個</p>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 mt-1"
                              disabled={updatingItems.has(item.product.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              削除
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>商品を削除しますか？</AlertDialogTitle>
                              <AlertDialogDescription>
                                「{item.product.name}
                                」をカートから削除します。この操作は取り消せません。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>キャンセル</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemoveItem(item.product.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                削除する
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    {index < cart.cartItems.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* 注文サマリー */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>注文サマリー</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>小計</span>
                  <span>¥{formatPrice(cart.totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>送料</span>
                  <span>{cart.totalPrice >= 5000 ? '無料' : '¥500'}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>合計</span>
                  <span>¥{formatPrice(cart.totalPrice + (cart.totalPrice >= 5000 ? 0 : 500))}</span>
                </div>

                <Link href="/user/cart/checkout">
                  <Button className="w-full h-12 text-lg">
                    <CreditCard className="w-5 h-5 mr-2" />
                    レジに進む
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* 配送・保証情報 */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="w-5 h-5 text-green-600" />
                  <span>5,000円以上で送料無料</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>30日間返品保証</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  <span>安全な決済システム</span>
                </div>
              </CardContent>
            </Card>

            {/* おすすめ商品 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">こちらもおすすめ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">ノートパソコン UltraBook</p>
                      <p className="text-sm text-gray-500">¥128,000</p>
                    </div>
                    <Button size="sm" variant="outline">
                      追加
                    </Button>
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
