// lib/api.ts

import axios from '@/lib/axios'
import { CartResponse, addCartItemRequest, updateCartItemRequest } from '@/types/user/cart'
import { getCookie } from 'cookies-next'

const getAuthHeader = () => {
  const token = getCookie('user-token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getCart = async (): Promise<CartResponse> => {
  const response = await axios.get<CartResponse>('/user/carts', {
    headers: getAuthHeader(),
  })
  return response.data
}

export const addCartItem = async (data: addCartItemRequest): Promise<CartResponse> => {
  const response = await axios.post<CartResponse>('/user/carts', data, {
    headers: getAuthHeader(),
  })
  return response.data
}

export const updateCartItemQuantity = async (
  productId: number,
  data: updateCartItemRequest
): Promise<CartResponse> => {
  const response = await axios.put<CartResponse>(`/user/carts/items/${productId}`, data, {
    headers: getAuthHeader(),
  })
  return response.data
}

export const removeCartItem = async (productId: number): Promise<CartResponse> => {
  const response = await axios.delete<CartResponse>(`/user/carts/items/${productId}`, {
    headers: getAuthHeader(),
  })
  return response.data
}
