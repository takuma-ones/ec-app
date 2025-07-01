// lib/api.ts

import axios from '@/lib/axios'
import { getCookie } from 'cookies-next'
import { OrderResponse } from '@/types/admin/order'
import { UpdateOrderStatusRequest } from '@/types/admin/order/request'
import { OrderStatus } from '@/types/common/order_status'

const getAuthHeader = () => {
  const token = getCookie('admin-token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getOrders = async (): Promise<OrderResponse[]> => {
  const response = await axios.get<OrderResponse[]>('/admin/orders', {
    headers: getAuthHeader(),
  })
  return response.data
}

export const getOrder = async (id: number): Promise<OrderResponse> => {
  const response = await axios.get<OrderResponse>(`/admin/orders/${id}`, {
    headers: getAuthHeader(),
  })
  return response.data
}

export const updateOrderStatus = async (
  id: number,
  data: UpdateOrderStatusRequest
): Promise<OrderResponse> => {
  const response = await axios.put<OrderResponse>(`/admin/orders/${id}`, data, {
    headers: getAuthHeader(),
  })
  return response.data
}

export const getOrderCountByStatus = async (status: OrderStatus): Promise<OrderResponse> => {
  const response = await axios.get<OrderResponse>(`/admin/orders/count/${status}`, {
    headers: getAuthHeader(),
  })
  return response.data
}
