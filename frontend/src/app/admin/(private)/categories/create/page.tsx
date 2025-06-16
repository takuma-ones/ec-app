'use client'

import type React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCategory } from '@/lib/api/admin/categories'
import { BackButton } from '@/components/ui/back-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FolderOpen, Save, Plus } from 'lucide-react'
import type { CategoryRequest } from '@/types/admin/category'

export default function CreateCategoryPage() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<CategoryRequest>({ name: '' })
  const [errors, setErrors] = useState<{ name?: string }>({})

  const validateForm = () => {
    const newErrors: { name?: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = 'カテゴリー名は必須です'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'カテゴリー名は2文字以上で入力してください'
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'カテゴリー名は50文字以内で入力してください'
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
      const newCategory = await createCategory({
        name: formData.name.trim(),
      })
      router.push(`/admin/categories/${newCategory.id}`)
    } catch (error) {
      console.error('カテゴリーの作成に失敗しました:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/categories')
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton variant="custom" customPath="/admin/categories" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FolderOpen className="w-8 h-8 text-orange-500" />
              新規カテゴリー作成
            </h1>
            <p className="text-gray-600 mt-1">新しいカテゴリーを追加します</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              カテゴリー情報
            </CardTitle>
            <CardDescription>新しいカテゴリーの基本情報を入力してください</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  カテゴリー名 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例: トップス、ボトムス、シューズ"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                <p className="text-sm text-gray-500">
                  商品を分類するためのカテゴリー名を入力してください
                </p>
              </div>

              {/* プレビュー */}
              {formData.name.trim() && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">プレビュー</h3>
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-orange-500" />
                    <span className="font-medium">{formData.name.trim()}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                  キャンセル
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating || !formData.name.trim()}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isCreating ? '作成中...' : 'カテゴリーを作成'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 注意事項 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">注意事項</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p>• カテゴリー名は2文字以上50文字以内で入力してください</p>
            <p>• 同じ名前のカテゴリーは作成できません</p>
            <p>• 作成後もカテゴリー名は変更可能です</p>
            <p>• カテゴリーを削除すると、関連する商品のカテゴリー情報も削除されます</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
