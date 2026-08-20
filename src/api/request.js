// src/api/request.js
// axios 实例封装：统一 baseURL、请求/响应拦截器、token 注入、错误处理
// 后端统一返回格式：{ code, msg, data }  code: 200成功/400业务失败/401未登录/403无权限/500异常
import axios from 'axios'
import { getToken, removeToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  // 数组参数序列化为重复格式：ids=1&ids=2 （Spring @RequestParam List 可绑定）
  paramsSerializer: {
    serialize: (params) => {
      const parts = []
      Object.keys(params || {}).forEach((key) => {
        const val = params[key]
        if (val === undefined || val === null || val === '') return
        if (Array.isArray(val)) {
          val.forEach((v) => parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`))
        } else {
          parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
        }
      })
      return parts.join('&')
    }
  }
})

// 请求拦截器：自动携带 token
service.interceptors.request.use(
  (config) => {
    const token = getToken()
    //====新增调试打印====
    console.log('👉请求拦截执行，url:', config.url, 'token存在:', !!token)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器：统一处理后端返回结构 { code, msg, data }
service.interceptors.response.use(
  (response) => {
    const res = response.data
    // 文件下载（blob）直接返回
    if (response.config.responseType === 'blob') {
      return response
    }
    // 约定 code === 200 为成功
    if (res.code === 200) {
      return res
    }
    // 401 未登录 / token 失效
    if (res.code === 401) {
      removeToken()
      ElMessage.error(res.msg || '登录已失效，请重新登录')
      setTimeout(() => {
        window.location.href = '/login'
      }, 1000)
      return Promise.reject(new Error(res.msg || '登录已失效'))
    }
    // 403 无权限
    if (res.code === 403) {
      ElMessage.error(res.msg || '无权限访问')
      return Promise.reject(new Error(res.msg || '无权限'))
    }
    // 其他业务错误（400/500 等）
    ElMessage.error(res.msg || '请求失败')
    return Promise.reject(new Error(res.msg || '请求失败'))
  },
  (error) => {
    console.error('网络请求异常', error)
    ElMessage.error(error.message || '网络异常，请稍后重试')
    return Promise.reject(error)
  }
)

export default service
