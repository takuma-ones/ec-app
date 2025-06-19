'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCart } from '@/context/CartContext'
import { getProducts } from '@/lib/api/user/products'
import type { ProductResponse } from '@/types/user/product'
import { getCookie } from 'cookies-next'
import {
  Check,
  Filter,
  Grid3X3,
  Heart,
  List,
  Package,
  Search,
  Shield,
  ShoppingCart,
  Truck,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

export default function ProductListPage() {
  const router = useRouter()
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [addingToCart, setAddingToCart] = useState<Set<number>>(new Set())
  const [addedToCart, setAddedToCart] = useState<Set<number>>(new Set())
  const [userToken, setUserToken] = useState<string | null | undefined>(undefined)
  const { addItemToCart } = useCart()

  useEffect(() => {
    const token = getCookie('user-token')
    setUserToken(typeof token === 'string' ? token : null)

    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (error) {
        console.error('商品の取得に失敗しました:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // フィルタリングとソート
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory =
        categoryFilter === 'all' ||
        product.productCategories.some((cat) => cat.name === categoryFilter)

      return matchesSearch && matchesCategory
    })

    // ソート
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }, [products, searchTerm, categoryFilter, sortBy])

  const categories = useMemo(() => {
    const cats = products
      .flatMap((p) => p.productCategories.map((cat) => cat.name))
      .filter(Boolean) as string[]
    return Array.from(new Set(cats))
  }, [products])

  const formatPrice = (price: number) => {
    return price.toLocaleString()
  }

  const handleAddToCart = async (productId: number) => {
    if (!userToken) {
      router.push('/user/login')
      return
    }

    setAddingToCart((prev) => new Set(prev).add(productId))

    try {
      await addItemToCart({
        productId,
        quantity: 1,
      })

      setAddedToCart((prev) => new Set(prev).add(productId))

      // 2秒後にアニメーションをリセット
      setTimeout(() => {
        setAddedToCart((prev) => {
          const newSet = new Set(prev)
          newSet.delete(productId)
          return newSet
        })
      }, 2000)
    } catch (error) {
      console.error('カートへの追加に失敗しました:', error)
    } finally {
      setAddingToCart((prev) => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
              ))}
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">商品一覧</h1>
              <p className="text-gray-600 mt-1">お気に入りの商品を見つけよう</p>
            </div>

            {/* 特典バナー */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-green-600">
                <Truck className="w-4 h-4" />
                <span>送料無料（5,000円以上）</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <Shield className="w-4 h-4" />
                <span>30日間返品保証</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* フィルター・検索エリア */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="商品名で検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48 h-12">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="カテゴリ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべてのカテゴリ</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 h-12">
                    <SelectValue placeholder="並び順" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">名前順</SelectItem>
                    <SelectItem value="price-low">価格の安い順</SelectItem>
                    <SelectItem value="price-high">価格の高い順</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 商品数表示 */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {filteredAndSortedProducts.length}件の商品が見つかりました
          </p>
        </div>

        {/* 商品グリッド */}
        <div
          className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}
        >
          {filteredAndSortedProducts.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="relative">
                {product.productImages.length > 0 && (
                  <div className="relative overflow-hidden">
                    <Image
                      src={
                        product.productImages.sort((a, b) => a.sortOrder - b.sortOrder)[0]
                          ?.imageUrl ||
                        '/placeholder.svg' ||
                        '/placeholder.svg'
                      }
                      alt={product.name}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* バッジ */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.stock === 0 && <Badge variant="secondary">売り切れ</Badge>}
                    </div>

                    {/* お気に入りボタン */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* カテゴリ */}
                  {product.productCategories.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {product.productCategories.map((category, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* 商品名 */}
                  <Link href={`/user/products/${product.id}`}>
                    <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  {/* 説明 */}
                  <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>

                  {/* 価格 */}
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900">
                      ¥{formatPrice(product.price)}
                    </span>
                  </div>

                  {/* 在庫状況 */}
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                      {product.stock > 0 ? `在庫あり (${product.stock}個)` : '在庫切れ'}
                    </span>
                  </div>

                  {/* アクションボタン */}
                  <div className="flex gap-2 pt-2">
                    <Link href={`/user/products/${product.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        詳細を見る
                      </Button>
                    </Link>
                    <Button
                      className="flex-1"
                      disabled={product.stock === 0 || addingToCart.has(product.id)}
                      onClick={() => handleAddToCart(product.id)}
                    >
                      {addingToCart.has(product.id) ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          追加中...
                        </div>
                      ) : addedToCart.has(product.id) ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          追加済み
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          カートに追加
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 商品が見つからない場合 */}
        {filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">商品が見つかりませんでした</h3>
            <p className="text-gray-600">検索条件を変更してお試しください。</p>
          </div>
        )}
      </div>
    </div>
  )
}
