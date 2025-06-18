// lib/api.ts

import axios from '@/lib/axios'
import { ProfileResponse } from '@/types/user/profile'
import { getCookie } from 'cookies-next'

const getAuthHeader = () => {
  const token = getCookie('user-token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await axios.get<ProfileResponse>('/user/profile', {
    headers: getAuthHeader(),
  })
  return response.data
}
