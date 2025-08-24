import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
// 优先使用构建时注入的环境变量（VUE_APP_API_URL 或 VITE_APP_API_URL），否则回退到 '/'
const apiBase = (process.env.VUE_APP_API_URL || process.env.VITE_APP_API_URL || '/')

const service = axios.create({
  baseURL: apiBase,
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 添加认证头
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 如果响应不成功，显示错误信息
    if (!res.success && res.message) {
      ElMessage.error(res.message)
    }
    
    return res
  },
  error => {
    console.error('响应错误:', error)
    
    let message = '请求失败'
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message = '未授权，请重新登录'
          // 清除token并跳转到登录页
          localStorage.removeItem('admin_token')
          window.location.href = '/login'
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = error.response.data?.message || '请求失败'
      }
    } else if (error.request) {
      message = '网络错误，请检查网络连接'
    }
    
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export default service
