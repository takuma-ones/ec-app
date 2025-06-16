// lib/api.ts

import axios from '@/lib/axios'
import { getCookie } from 'cookies-next'
import { CategoryRequest, CategoryResponse } from '@/types/admin/category'

const getAuthHeader = () => {
  const token = getCookie('admin-token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getCategories = async (): Promise<CategoryResponse[]> => {
  const response = await axios.get<CategoryResponse[]>('/admin/categories', {
    headers: getAuthHeader(),
  })
  return response.data
}

export const getCategoryById = async (id: number): Promise<CategoryResponse> => {
  const response = await axios.get<CategoryResponse>(`/admin/categories/${id}`, {
    headers: getAuthHeader(),
  })
  return response.data
}

export const createCategory = async (data: CategoryRequest): Promise<CategoryResponse> => {
  const response = await axios.post<CategoryResponse>('/admin/categories', data, {
    headers: getAuthHeader(),
  })
  return response.data
}

export const updateCategory = async (
  id: number,
  data: CategoryRequest
): Promise<CategoryResponse> => {
  const response = await axios.put<CategoryResponse>(`/admin/categories/${id}`, data, {
    headers: getAuthHeader(),
  })
  return response.data
}

export const deleteCategory = async (id: number): Promise<CategoryResponse> => {
  const response = await axios.delete<CategoryResponse>(`/admin/categories/${id}`, {
    headers: getAuthHeader(),
  })
  return response.data
}
