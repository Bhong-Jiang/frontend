import request from '@/utils/request'

// 管理员登录
export const login = (data) => {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

// 验证token
export const verifyToken = () => {
  return request({
    url: '/api/auth/verify',
    method: 'get'
  })
}
