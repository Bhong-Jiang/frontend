import axios from 'axios'
import { ElMessage } from 'element-plus'

// 使用 Vite 的运行时环境变量优先，兼容旧的 VUE_APP_*
const apiBase = import.meta.env.VITE_APP_API_URL || import.meta.env.VUE_APP_API_URL || '/'

const service = axios.create({
  baseURL: apiBase,
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (!res.success && res.message) {
      ElMessage.error(res.message)
    }
    return res
  },
  error => {
    let message = '请求失败'
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message = '未授权，请重新登录'
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
    } else {
      message = error.message || '请求失败'
    }
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export default service
