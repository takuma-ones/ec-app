'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getCategoryById, updateCategory, deleteCategory } from '@/lib/api/admin/categories'
import { BackButton } from '@/components/ui/back-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
import { FolderOpen, Edit, Trash2, Save, Package, Calendar, Hash } from 'lucide-react'
import type { CategoryResponse, CategoryRequest } from '@/types/admin/category'

export default function CategoryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [category, setCategory] = useState<CategoryResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState<CategoryRequest>({ name: '' })

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const id = Number.parseInt(params.id as string)
        if (isNaN(id)) {
          router.push('/admin/categories')
          return
        }

        const data = await getCategoryById(id)
        setCategory(data)
        setFormData({ name: data.name })
      } catch (error) {
        console.error('カテゴリーの取得に失敗しました:', error)
        router.push('/admin/categories')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategory()
  }, [params.id, router])

  const handleSave = async () => {
    if (!category) return

    setIsSaving(true)
    try {
      const updatedCategory = await updateCategory(category.id, formData)
      setCategory(updatedCategory)
      setIsEditing(false)
    } catch (error) {
      console.error('カテゴリーの更新に失敗しました:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!category) return

    setIsDeleting(true)
    try {
      await deleteCategory(category.id)
      router.push('/admin/categories')
    } catch (error) {
      console.error('カテゴリーの削除に失敗しました:', error)
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    if (category) {
      setFormData({ name: category.name })
    }
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex items-center gap-4">
          <BackButton variant="back" />
          <h1 className="text-2xl font-bold text-gray-900">カテゴリーが見つかりません</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">
              指定されたカテゴリーは存在しないか、削除されている可能性があります。
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
          <BackButton variant="back" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FolderOpen className="w-8 h-8 text-orange-500" />
              カテゴリー詳細
            </h1>
            <p className="text-gray-600 mt-1">ID: {category.id}</p>
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
                    <AlertDialogTitle>カテゴリーを削除しますか？</AlertDialogTitle>
                    <AlertDialogDescription>
                      この操作は取り消すことができません。カテゴリー「{category.name}
                      」が完全に削除されます。
                      このカテゴリーに属する商品は、カテゴリーなしの状態になります。
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
                <FolderOpen className="w-5 h-5" />
                基本情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{category.name}</h2>
                  <Badge variant="default" className="mt-1">
                    アクティブ
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label htmlFor="category-name">カテゴリー名</Label>
                  {isEditing ? (
                    <Input
                      id="category-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="カテゴリー名を入力"
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-lg font-medium">{category.name}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 関連商品 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                関連商品
              </CardTitle>
              <CardDescription>このカテゴリーに属する商品</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">ワイヤレスイヤホン Pro</p>
                    <p className="text-sm text-gray-500">¥15,800</p>
                  </div>
                  <Badge variant="outline">在庫あり</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Bluetoothスピーカー</p>
                    <p className="text-sm text-gray-500">¥12,500</p>
                  </div>
                  <Badge variant="outline">在庫あり</Badge>
                </div>
                <div className="text-center py-4">
                  <Button variant="outline" size="sm">
                    すべての商品を見る
                  </Button>
                </div>
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
                  <p className="text-sm text-gray-600">カテゴリーID</p>
                  <p className="text-sm font-medium">{category.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">作成日</p>
                  <p className="text-sm font-medium">2024年1月15日</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">最終更新</p>
                  <p className="text-sm font-medium">2024年1月20日</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 統計情報 */}
          <Card>
            <CardHeader>
              <CardTitle>統計情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">商品数</span>
                <span className="font-bold">{Math.floor(Math.random() * 50) + 1}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">総売上</span>
                <span className="font-bold">
                  ¥{(Math.floor(Math.random() * 500) + 100).toLocaleString()},000
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">平均価格</span>
                <span className="font-bold">
                  ¥{(Math.floor(Math.random() * 50) + 10).toLocaleString()},000
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">人気度</span>
                <span className="font-bold">#{Math.floor(Math.random() * 6) + 1}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
