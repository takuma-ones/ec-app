'use client'

import { BackButton } from '@/components/ui/back-button'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getOrders } from '@/lib/api/admin/orders'
import type { OrderResponse } from '@/types/admin/order'
import { Filter, Search, Eye } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  >('all')

  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState<number>(1)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders()
        setOrders(data)
      } catch (error) {
        console.error('注文データの取得に失敗:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchMatch = order.userName.toLowerCase().includes(searchTerm.toLowerCase())

      const statusMatch =
        statusFilter === 'all' ||
        (statusFilter === 'paid' && order.status === 'PAID') ||
        (statusFilter === 'shipped' && order.status === 'SHIPPED') ||
        (statusFilter === 'delivered' && order.status === 'DELIVERED') ||
        (statusFilter === 'cancelled' && order.status === 'CANCELLED')

      return searchMatch && statusMatch
    })
  }, [orders, searchTerm, statusFilter])

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  const formatPrice = (price: number) =>
    price.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' })

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PAID':
        return '未処理'
      case 'SHIPPED':
        return '発送中'
      case 'DELIVERED':
        return '完了'
      case 'CANCELLED':
        return 'キャンセル'
      default:
        return status
    }
  }

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'default'
      case 'SHIPPED':
        return 'secondary'
      case 'DELIVERED':
        return 'outline'
      case 'CANCELLED':
        return 'destructive'
      default:
        return 'default'
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* ヘッダー */}
      <div className="flex items-center gap-4">
        <BackButton variant="custom" customPath="/admin/dashboard" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">注文管理</h1>
          <p className="text-gray-600 mt-1">注文の一覧と詳細を確認できます</p>
        </div>
      </div>

      {/* ステータスカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: '全注文', count: orders.length, color: 'text-gray-500' },
          {
            label: '未処理',
            count: orders.filter((o) => o.status === 'PAID').length,
            color: 'text-green-600',
          },
          {
            label: '発送中',
            count: orders.filter((o) => o.status === 'SHIPPED').length,
            color: 'text-yellow-600',
          },
          {
            label: '完了',
            count: orders.filter((o) => o.status === 'DELIVERED').length,
            color: 'text-blue-600',
          },
          {
            label: 'キャンセル',
            count: orders.filter((o) => o.status === 'CANCELLED').length,
            color: 'text-red-600',
          },
        ].map((item) => (
          <Card key={item.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{item.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{item.count}</div>
              <p className={`text-xs mt-1 ${item.color}`}>{item.label}の注文</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* フィルター */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            フィルター・検索
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="ユーザー名"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as 'all' | 'paid' | 'shipped' | 'delivered' | 'cancelled')
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="ステータス" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全ステータス</SelectItem>
                <SelectItem value="paid">未処理</SelectItem>
                <SelectItem value="shipped">発送中</SelectItem>
                <SelectItem value="delivered">完了</SelectItem>
                <SelectItem value="cancelled">キャンセル</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* テーブル */}
      <Card>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>注文ID</TableHead>
                <TableHead>ユーザー名</TableHead>
                <TableHead>金額</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>注文日</TableHead>
                <TableHead>詳細</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.userName}</TableCell>
                    <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="outline" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                    注文が見つかりません
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ページネーション */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          variant="outline"
        >
          前へ
        </Button>
        <div className="flex items-center">
          {currentPage} / {totalPages || 1}
        </div>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          variant="outline"
        >
          次へ
        </Button>
      </div>
    </div>
  )
}
