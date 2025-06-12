import axios from '@/lib/axios'
import {
  UserLoginRequest,
  UserLoginResponse,
  UserSignUpRequest,
  UserSignUpResponse,
} from '@/types/user/auth/'

export const loginUser = async (data: UserLoginRequest): Promise<UserLoginResponse> => {
  const response = await axios.post('/user/auth/login', data)
  return response.data
}

export const signUpUser = async (data: UserSignUpRequest): Promise<UserSignUpResponse> => {
  const response = await axios.post('/user/auth/signup', data)
  return response.data
}
