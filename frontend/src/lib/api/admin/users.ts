// lib/api.ts

import axios from '@/lib/axios'
import { getCookie } from 'cookies-next'
import { UserResponse } from '@/types/admin/user'

const getAuthHeader = () => {
  const token = getCookie('admin-token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getUsers = async (): Promise<UserResponse[]> => {
  const response = await axios.get<UserResponse[]>('/admin/users', {
    headers: getAuthHeader(),
  })
  return response.data
}

export const getUser = async (id: number): Promise<UserResponse> => {
  const response = await axios.get<UserResponse>(`/admin/users/${id}`, {
    headers: getAuthHeader(),
  })
  return response.data
}
