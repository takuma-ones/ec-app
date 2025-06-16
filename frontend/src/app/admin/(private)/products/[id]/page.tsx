'use client'

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
import { BackButton } from '@/components/ui/back-button'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { getCategories } from '@/lib/api/admin/categories'
import { deleteProduct, getProductById, updateProduct } from '@/lib/api/admin/products'
import type { CategoryResponse } from '@/types/admin/category'
import type { ProductRequest, ProductResponse } from '@/types/admin/product'
import { Calendar, Edit, Eye, EyeOff, Hash, Package, Save, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<ProductResponse | null>(null)
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState<ProductRequest>({
    name: '',
    description: '',
    price: 0,
    sku: '',
    stock: 0,
    isPublished: false,
    categoryIds: [],
    images: [],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = Number.parseInt(params.id as string)
        if (isNaN(id)) {
          router.push('/admin/products')
          return
        }

        const [productData, categoriesData] = await Promise.all([
          getProductById(id),
          getCategories(),
        ])

        setProduct(productData)
        setCategories(categoriesData)
        setFormData({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          sku: productData.sku,
          stock: productData.stock,
          isPublished: productData.published,
          categoryIds: productData.productCategories.map((cat) => cat.id),
          images: productData.productImages.map((img) => ({
            url: img.imageUrl,
            sortOrder: img.sortOrder,
          })),
        })
      } catch (error) {
        console.error('商品の取得に失敗しました:', error)
        router.push('/admin/products')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, router])

  const handleSave = async () => {
    if (!product) return

    setIsSaving(true)
    try {
      const updatedProduct = await updateProduct(product.id, formData)
      setProduct(updatedProduct)
      setIsEditing(false)
    } catch (error) {
      console.error('商品の更新に失敗しました:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!product) return

    setIsDeleting(true)
    try {
      await deleteProduct(product.id)
      router.push('/admin/products')
    } catch (error) {
      console.error('商品の削除に失敗しました:', error)
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        sku: product.sku,
        stock: product.stock,
        isPublished: product.published,
        categoryIds: product.productCategories.map((cat) => cat.id),
        images: product.productImages.map((img) => ({
          url: img.imageUrl,
          sortOrder: img.sortOrder,
        })),
      })
    }
    setIsEditing(false)
  }

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, categoryIds: [...formData.categoryIds, categoryId] })
    } else {
      setFormData({
        ...formData,
        categoryIds: formData.categoryIds.filter((id) => id !== categoryId),
      })
    }
  }

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

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex items-center gap-4">
          <BackButton variant="custom" customPath="/admin/products" />
          <h1 className="text-2xl font-bold text-gray-900">商品が見つかりません</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">
              指定された商品は存在しないか、削除されている可能性があります。
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton variant="custom" customPath="/admin/dashboard" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-8 h-8 text-purple-500" />
              商品詳細
            </h1>
            <p className="text-gray-600 mt-1">ID: {product.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                編集
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-2" />
                    削除
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>商品を削除しますか？</AlertDialogTitle>
                    <AlertDialogDescription>
                      この操作は取り消すことができません。商品「{product.name}
                      」が完全に削除されます。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isDeleting ? '削除中...' : '削除する'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                キャンセル
              </Button>
              <Button onClick={handleSave} disabled={isSaving || !formData.name.trim()}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? '保存中...' : '保存'}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* メイン情報 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 基本情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                基本情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                  {product.productImages.length > 0 ? (
                    <Image
                      src={product.productImages[0].imageUrl || '/placeholder.svg'}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{product.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={product.published ? 'default' : 'secondary'}>
                      {product.published ? '公開中' : '下書き'}
                    </Badge>
                    {product.stock === 0 && <Badge variant="destructive">在庫切れ</Badge>}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="product-name">商品名</Label>
                    {isEditing ? (
                      <Input
                        id="product-name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-lg font-medium">{product.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="product-sku">SKU</Label>
                    {isEditing ? (
                      <Input
                        id="product-sku"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 font-mono text-sm">{product.sku}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="product-price">価格</Label>
                    {isEditing ? (
                      <Input
                        id="product-price"
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: Number.parseInt(e.target.value) || 0 })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-lg font-bold">¥{formatPrice(product.price)}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="product-stock">在庫数</Label>
                    {isEditing ? (
                      <Input
                        id="product-stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({ ...formData, stock: Number.parseInt(e.target.value) || 0 })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-lg font-medium">{product.stock}個</p>
                    )}
                  </div>

                  <div>
                    <Label>公開状態</Label>
                    {isEditing ? (
                      <div className="flex items-center space-x-2 mt-1">
                        <Switch
                          checked={formData.isPublished}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, isPublished: checked })
                          }
                        />
                        <span>{formData.isPublished ? '公開中' : '下書き'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        {product.published ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                        <span>{product.published ? '公開中' : '下書き'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>カテゴリー</Label>
                    {isEditing ? (
                      <div className="mt-2 space-y-2">
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category.id}`}
                              checked={formData.categoryIds.includes(category.id)}
                              onCheckedChange={(checked) =>
                                handleCategoryChange(category.id, checked as boolean)
                              }
                            />
                            <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {product.productCategories.map((category) => (
                          <Badge key={category.id} variant="outline">
                            {category.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="product-description">商品説明</Label>
                {isEditing ? (
                  <Textarea
                    id="product-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-700 leading-relaxed">{product.description}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 商品画像 */}
          <Card>
            <CardHeader>
              <CardTitle>商品画像</CardTitle>
              <CardDescription>商品の画像を管理します</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {product.productImages.map((image) => (
                  <div key={image.id} className="relative">
                    <Image
                      src={image.imageUrl || '/placeholder.svg'}
                      alt={`${product.name} ${image.sortOrder}`}
                      width={200}
                      height={200}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Badge className="absolute top-2 left-2" variant="secondary">
                      {image.sortOrder}
                    </Badge>
                  </div>
                ))}
                {product.productImages.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>画像が登録されていません</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          {/* システム情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="w-5 h-5" />
                システム情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Hash className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">商品ID</p>
                  <p className="text-sm font-medium">{product.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">作成日</p>
                  <p className="text-sm font-medium">{formatDate(product.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">最終更新</p>
                  <p className="text-sm font-medium">{formatDate(product.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 販売統計 */}
          <Card>
            <CardHeader>
              <CardTitle>販売統計</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">総販売数</span>
                <span className="font-bold">{Math.floor(Math.random() * 100) + 10}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">総売上</span>
                <span className="font-bold">
                  ¥{(Math.floor(Math.random() * 500) + 100).toLocaleString()},000
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">平均評価</span>
                <span className="font-bold">4.{Math.floor(Math.random() * 9) + 1}/5.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">レビュー数</span>
                <span className="font-bold">{Math.floor(Math.random() * 50) + 5}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
