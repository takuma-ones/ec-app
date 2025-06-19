'use client'

import { BackButton } from '@/components/ui/back-button'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCart } from '@/context/CartContext'
import { getProductById } from '@/lib/api/user/products'
import type { ProductResponse } from '@/types/user/product'
import { getCookie } from 'cookies-next'
import {
  Check,
  Heart,
  Minus,
  Package,
  Plus,
  RotateCcw,
  Share2,
  Shield,
  ShoppingCart,
  Truck,
} from 'lucide-react'
import Image from 'next/image'
import { notFound, useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [product, setProduct] = useState<ProductResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [userToken, setUserToken] = useState<string | null | undefined>(undefined)
  const { addItemToCart } = useCart()

  useEffect(() => {
    const token = getCookie('user-token')
    setUserToken(typeof token === 'string' ? token : null)

    const fetchProduct = async () => {
      try {
        const id = Number.parseInt(params.id as string)
        if (isNaN(id)) {
          notFound()
        }

        const data = await getProductById(id)
        setProduct(data)
      } catch (error) {
        console.error('商品の取得に失敗しました:', error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

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

  const handleAddToCart = async () => {
    if (!userToken) {
      router.push('/user/login')
      return
    }
    if (!product) return

    setIsAddingToCart(true)
    try {
      await addItemToCart({
        productId: product.id,
        quantity,
      })

      setIsAddedToCart(true)

      // 2秒後にアニメーションをリセット
      setTimeout(() => {
        setIsAddedToCart(false)
      }, 2000)
    } catch (error) {
      console.error('カートへの追加に失敗しました:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return notFound()
  }

  // 画像をソート順でソート
  const sortedImages = product.productImages.sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* パンくずナビ */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BackButton variant="custom" customPath="/user/products" className="mr-2" />
            <span>商品一覧</span>
            <span>/</span>
            <span>{product.productCategories.map((cat) => cat.name).join(', ')}</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 商品画像 */}
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={
                  sortedImages[selectedImageIndex]?.imageUrl ||
                  '/placeholder.svg?height=500&width=500'
                }
                alt={product.name}
                width={500}
                height={500}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            {/* サムネイル */}
            {sortedImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {sortedImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image.imageUrl || '/placeholder.svg'}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 商品情報 */}
          <div className="space-y-6">
            {/* カテゴリ */}
            {product.productCategories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.productCategories.map((category, index) => (
                  <Badge key={index} variant="outline">
                    {category.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* 商品名 */}
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

            {/* 価格 */}
            <div className="space-y-2">
              <span className="text-3xl font-bold text-gray-900">
                ¥{formatPrice(product.price)}
              </span>
            </div>

            {/* 在庫状況 */}
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-400" />
              <span
                className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {product.stock > 0 ? `在庫あり (${product.stock}個)` : '在庫切れ'}
              </span>
            </div>

            {/* 数量選択 */}
            {product.stock > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">数量</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* アクションボタン */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full h-12"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
              >
                {isAddingToCart ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    カートに追加中...
                  </div>
                ) : isAddedToCart ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    カートに追加しました
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    カートに追加
                  </>
                )}
              </Button>

              <div className="flex gap-3">
                <Button variant="outline" size="lg" className="flex-1">
                  <Heart className="w-5 h-5 mr-2" />
                  お気に入り
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  <Share2 className="w-5 h-5 mr-2" />
                  シェア
                </Button>
              </div>
            </div>

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
                  <RotateCcw className="w-5 h-5 text-purple-600" />
                  <span>1年間メーカー保証</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 商品詳細タブ */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="description">商品説明</TabsTrigger>
                <TabsTrigger value="specs">仕様</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  <Separator className="my-4" />
                  <h3 className="text-lg font-semibold mb-2">特徴</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 高品質な素材を使用</li>
                    <li>• 長期間の使用に耐える耐久性</li>
                    <li>• ユーザーフレンドリーなデザイン</li>
                    <li>• 環境に配慮した製造プロセス</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="specs" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">基本仕様</h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">SKU:</dt>
                        <dd className="font-medium">{product.sku}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">カテゴリ:</dt>
                        <dd className="font-medium">
                          {product.productCategories.map((cat) => cat.name).join(', ')}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">登録日:</dt>
                        <dd className="font-medium">{formatDate(product.createdAt)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">更新日:</dt>
                        <dd className="font-medium">{formatDate(product.updatedAt)}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
