// lib/api.ts

import axios from '@/lib/axios'
import { OrderResponse, CheckoutRequest } from '@/types/user/order'
import { getCookie } from 'cookies-next'

const getAuthHeader = () => {
  const token = getCookie('user-token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getOrder = async (): Promise<OrderResponse[]> => {
  const response = await axios.get<OrderResponse[]>('/user/orders', {
    headers: getAuthHeader(),
  })
  return response.data
}

export const createOrder = async (data: CheckoutRequest): Promise<OrderResponse[]> => {
  const response = await axios.post<OrderResponse[]>('/user/orders', data, {
    headers: getAuthHeader(),
  })
  return response.data
}
