import { defineStore } from 'pinia'
import { loginApi, logoutApi, getUserInfoApi } from '@/api/user'
import type { LoginParams, UserInfo } from '@/types'

interface UserState {
  token: string
  userInfo: UserInfo | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: localStorage.getItem('token') || '',
    userInfo: null,
  }),
  
  actions: {
    // 登录
    async login(data: LoginParams) {
      const res = await loginApi(data)
      this.token = res.access_token
      this.userInfo = res.user
      localStorage.setItem('token', res.access_token)
      return res
    },

    // 获取用户信息
    async getUserInfo() {
      const res = await getUserInfoApi()
      this.userInfo = res
      return res
    },

    // 登出
    logout() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem('token')
    },
  },

  persist: true,
})
