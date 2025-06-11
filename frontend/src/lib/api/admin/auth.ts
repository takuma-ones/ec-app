import axios from '@/lib/axios'
import { AdminLoginRequest, AdminLoginResponse } from '@/types/admin/auth'

export const loginAdmin = async (data: AdminLoginRequest): Promise<AdminLoginResponse> => {
  const response = await axios.post('/admin/auth/login', data)
  return response.data
}
