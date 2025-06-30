// lib/api.ts

import axios from '@/lib/axios'
import { getCookie } from 'cookies-next'
import { OrderResponse } from '@/types/admin/order'

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

export const updateOrderStatus = console.log()
