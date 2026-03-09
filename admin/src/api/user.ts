import request from '@/utils/request'
import type { LoginParams, LoginResult, UserInfo } from '@/types'

// 登录
export function loginApi(data: LoginParams): Promise<LoginResult> {
  return request.post('/auth/login', data)
}

// 获取用户信息
export function getUserInfoApi(): Promise<UserInfo> {
  return request.get('/auth/profile')
}

// 获取用户列表
export function getUserListApi(params?: any): Promise<any> {
  return request.get('/user', { params })
}

// 创建用户
export function createUserApi(data: any): Promise<any> {
  return request.post('/user', data)
}

// 更新用户
export function updateUserApi(id: number, data: any): Promise<any> {
  return request.put(`/user/${id}`, data)
}

// 删除用户
export function deleteUserApi(id: number): Promise<any> {
  return request.delete(`/user/${id}`)
}
