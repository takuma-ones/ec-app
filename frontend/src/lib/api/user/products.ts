// lib/api.ts

import axios from '@/lib/axios'
import { ProductResponse } from '@/types/user/product'

export const getProducts = async (): Promise<ProductResponse[]> => {
  const response = await axios.get<ProductResponse[]>('/user/products')
  return response.data
}

export const getProductById = async (id: number): Promise<ProductResponse> => {
  const response = await axios.get<ProductResponse>(`/user/products/${id}`)
  return response.data
}
