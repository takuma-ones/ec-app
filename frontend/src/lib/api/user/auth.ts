import axios from '@/lib/axios'
import { UserLoginRequest, UserLoginResponse } from '@/types/user/auth/'

export const loginUser = async (data: UserLoginRequest): Promise<UserLoginResponse> => {
  const response = await axios.post('/admin/auth/login', data)
  return response.data
}
