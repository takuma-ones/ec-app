'use client'

import type React from 'react'

import { BackButton } from '@/components/ui/back-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { getCategories } from '@/lib/api/admin/categories'
import { createProduct } from '@/lib/api/admin/products'
import type { CategoryResponse } from '@/types/admin/category'
import type { ProductRequest } from '@/types/admin/product'
import { Package, Plus, Save, Upload, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CreateProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
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
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (error) {
        console.error('カテゴリーの取得に失敗しました:', error)
      } finally {
        setIsLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = '商品名は必須です'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '商品名は2文字以上で入力してください'
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKUは必須です'
    }

    if (formData.price <= 0) {
      newErrors.price = '価格は1円以上で入力してください'
    }

    if (formData.stock < 0) {
      newErrors.stock = '在庫数は0以上で入力してください'
    }

    if (!formData.description.trim()) {
      newErrors.description = '商品説明は必須です'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsCreating(true)
    try {
      const newProduct = await createProduct({
        ...formData,
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        description: formData.description.trim(),
      })
      router.push(`/admin/products/${newProduct.id}`)
    } catch (error) {
      console.error('商品の作成に失敗しました:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/products')
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

  const addImageUrl = () => {
    const url = prompt('画像URLを入力してください:')
    if (url) {
      const newImage = {
        url,
        sortOrder: formData.images.length + 1,
      }
      setFormData({ ...formData, images: [...formData.images, newImage] })
    }
  }

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    // ソート順を再調整
    const reorderedImages = newImages.map((img, i) => ({ ...img, sortOrder: i + 1 }))
    setFormData({ ...formData, images: reorderedImages })
  }

  if (isLoadingCategories) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="max-w-4xl mx-auto">
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton variant="custom" customPath="/admin/products" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-8 h-8 text-purple-500" />
              新規商品作成
            </h1>
            <p className="text-gray-600 mt-1">新しい商品を追加します</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                基本情報
              </CardTitle>
              <CardDescription>商品の基本的な情報を入力してください</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">
                      商品名 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="例: ワイヤレスイヤホン Pro"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="sku">
                      SKU <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="例: WE-PRO-001"
                      className={errors.sku ? 'border-red-500' : ''}
                    />
                    {errors.sku && <p className="text-sm text-red-500">{errors.sku}</p>}
                    <p className="text-sm text-gray-500">商品を識別するための一意のコードです</p>
                  </div>

                  <div>
                    <Label htmlFor="price">
                      価格（円） <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, price: Number.parseInt(e.target.value) || 0 })
                      }
                      placeholder="15800"
                      className={errors.price ? 'border-red-500' : ''}
                    />
                    {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="stock">
                      在庫数 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: Number.parseInt(e.target.value) || 0 })
                      }
                      placeholder="25"
                      className={errors.stock ? 'border-red-500' : ''}
                    />
                    {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
                  </div>

                  <div>
                    <Label>公開設定</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Switch
                        checked={formData.isPublished}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, isPublished: checked })
                        }
                      />
                      <span className="text-sm">
                        {formData.isPublished ? '公開する' : '下書きとして保存'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      公開すると顧客が商品を閲覧・購入できるようになります
                    </p>
                  </div>

                  <div>
                    <Label>カテゴリー</Label>
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
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
                    {formData.categoryIds.length === 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        少なくとも1つのカテゴリーを選択してください
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description">
                  商品説明 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="商品の詳細な説明を入力してください..."
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>
            </CardContent>
          </Card>

          {/* 商品画像 */}
          <Card>
            <CardHeader>
              <CardTitle>商品画像</CardTitle>
              <CardDescription>商品の画像を追加してください（任意）</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button type="button" variant="outline" onClick={addImageUrl}>
                  <Upload className="w-4 h-4 mr-2" />
                  画像URLを追加
                </Button>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={image.url || '/placeholder.svg'}
                            alt={`商品画像 ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = '/placeholder.svg?height=200&width=200'
                            }}
                          />
                        </div>
                        <div className="absolute top-2 left-2">
                          <span className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            {image.sortOrder}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {formData.images.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>画像が追加されていません</p>
                    <p className="text-sm">「画像URLを追加」ボタンから画像を追加できます</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* プレビュー */}
          {(formData.name.trim() || formData.price > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>プレビュー</CardTitle>
                <CardDescription>入力内容のプレビューです</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-white">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                      {formData.images.length > 0 ? (
                        <img
                          src={formData.images[0].url || '/placeholder.svg'}
                          alt="プレビュー"
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/placeholder.svg?height=80&width=80'
                          }}
                        />
                      ) : (
                        <Package className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{formData.name || '商品名'}</h3>
                      <p className="text-sm text-gray-500 mb-2">SKU: {formData.sku || '未設定'}</p>
                      <p className="text-lg font-bold text-gray-900">
                        ¥{formData.price.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {formData.categoryIds.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {categories
                              .filter((cat) => formData.categoryIds.includes(cat.id))
                              .map((category) => (
                                <span
                                  key={category.id}
                                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                >
                                  {category.name}
                                </span>
                              ))}
                          </div>
                        )}
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            formData.isPublished
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {formData.isPublished ? '公開' : '下書き'}
                        </span>
                      </div>
                      {formData.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {formData.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* アクションボタン */}
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={
                isCreating || !formData.name.trim() || !formData.sku.trim() || formData.price <= 0
              }
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {isCreating ? '作成中...' : '商品を作成'}
            </Button>
          </div>
        </form>

        {/* 注意事項 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">作成時の注意事項</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p>• 商品名、SKU、価格、在庫数、商品説明は必須項目です</p>
            <p>• SKUは商品を識別するための一意のコードです（重複不可）</p>
            <p>• 下書きとして保存した商品は顧客には表示されません</p>
            <p>• 画像は後から追加・変更することも可能です</p>
            <p>• カテゴリーは複数選択可能です</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
