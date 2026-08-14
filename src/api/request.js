// src/api/request.js
// axios 实例封装：统一 baseURL、请求/响应拦截器、token 注入、错误处理
import axios from 'axios'
import { getToken, removeToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000
})

// 请求拦截器：自动携带 token
service.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器：统一处理后端返回结构 { code, data, message }
service.interceptors.response.use(
  (response) => {
    const res = response.data
    // 约定 code === 200 为成功
    if (res.code === 200) {
      return res
    }
    // 401 未登录 / token 失效
    if (res.code === 401) {
      removeToken()
      ElMessage.error('登录已失效，请重新登录')
      setTimeout(() => {
        window.location.href = '/login'
      }, 1000)
      return Promise.reject(new Error('登录已失效'))
    }
    // 其他业务错误
    ElMessage.error(res.message || '请求失败')
    return Promise.reject(new Error(res.message || '请求失败'))
  },
  (error) => {
    console.error('网络请求异常', error)
    ElMessage.error(error.message || '网络异常，请稍后重试')
    return Promise.reject(error)
  }
)

export default service
