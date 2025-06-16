'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { BackButton } from '@/components/ui/back-button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getUser } from '@/lib/api/admin/users'
import type { UserResponse } from '@/types/admin/user'
import { Mail, MapPin, Phone, User } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function UserDetailPage() {
  const params = useParams()
  const [user, setUser] = useState<UserResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = Number(params.id)
        const fetchedUser = await getUser(userId)
        setUser(fetchedUser)
      } catch (error) {
        console.error('ユーザー取得エラー:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [params.id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
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

  if (!user) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <BackButton variant="back" />
          <h1 className="text-2xl font-bold text-gray-900">ユーザーが見つかりません</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">
              指定されたユーザーは存在しないか、削除されている可能性があります。
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
              <User className="w-8 h-8 text-blue-500" />
              ユーザー詳細
            </h1>
            <p className="text-gray-600 mt-1">ID: {user.id}</p>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="w-full">
          {/* 基本情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                基本情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <Badge variant={user.isDeleted ? 'destructive' : 'default'} className="mt-1">
                    {user.isDeleted ? '削除済み' : 'アクティブ'}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">メールアドレス</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">電話番号</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">住所</p>
                      <p className="font-medium">{user.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-sm text-gray-600">作成日</div>
                <div className="font-medium">{formatDate(user.createdAt)}</div>
                <div className="text-sm text-gray-600">更新日</div>
                <div className="font-medium">{formatDate(user.updatedAt)}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
