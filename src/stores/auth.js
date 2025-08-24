import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, verifyToken } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('admin_token') || '')
  const user = ref(null)
  const isAuthenticated = ref(!!token.value)

  // 登录
  const login = async (credentials) => {
    try {
      const response = await loginApi(credentials)
      if (response.success) {
        token.value = response.data.token
        user.value = response.data.user
        isAuthenticated.value = true
        localStorage.setItem('admin_token', token.value)
        return { success: true }
      }
      return { success: false, message: response.message }
    } catch (error) {
      return { success: false, message: error.message || '登录失败' }
    }
  }

  // 登出
  const logout = () => {
    token.value = ''
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('admin_token')
  }

  // 验证token
  const checkAuth = async () => {
    if (!token.value) {
      return false
    }
    
    try {
      const response = await verifyToken()
      if (response.success) {
        user.value = response.data.user
        isAuthenticated.value = true
        return true
      } else {
        logout()
        return false
      }
    } catch (error) {
      logout()
      return false
    }
  }

  // 获取认证头
  const getAuthHeaders = () => {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    getAuthHeaders
  }
})
