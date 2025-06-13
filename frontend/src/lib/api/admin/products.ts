/**
 *
 * TODO:
 * - 商品画像はアップロード機能は未対応
 */
// lib/api.ts

import axios from '@/lib/axios'
import { getCookie } from 'cookies-next'
import { ProductResponse, ProductRequest } from '@/types/admin/product'

const getAuthHeader = () => {
  const token = getCookie('admin-token')
  console.log('admin-token:', token)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getProducts = async (): Promise<ProductResponse[]> => {
  const response = await axios.get<ProductResponse[]>('/admin/products', {
    headers: getAuthHeader(),
  })
  return response.data
}

export const getProductById = async (id: number): Promise<ProductResponse> => {
  const response = await axios.get<ProductResponse>(`/admin/products/${id}`, {
    headers: getAuthHeader(),
  })
  return response.data
}

export const createProduct = async (data: ProductRequest): Promise<ProductResponse> => {
  const response = await axios.post<ProductResponse>('/admin/products', data, {
    headers: getAuthHeader(),
  })
  return response.data
}

export const updateProduct = async (id: number, data: ProductRequest): Promise<ProductResponse> => {
  const response = await axios.put<ProductResponse>(`/admin/products/${id}`, data, {
    headers: getAuthHeader(),
  })
  return response.data
}

export const deleteProduct = async (id: number): Promise<ProductResponse> => {
  const response = await axios.delete<ProductResponse>(`/admin/products/${id}`, {
    headers: getAuthHeader(),
  })
  return response.data
}
