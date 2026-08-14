// src/api/modules/common/auth.js
// 公共鉴权接口：登录、退出、验证码、修改密码
import request from '../../request'

// 登录（统一入口，后端按 userType 区分角色）
export function login(data) {
  // 根据前端选择的身份，匹配后端不同Controller接口
  const { userType } = data
  let url = ''
  let method = 'post'
  let params = null
  let bodyData = null

  if (userType === 'student') {
    // 学生登录：POST /student/doLogin，参数拼在URL问号后面（后端只接收Query参数）
    url = '/student/doLogin'
    params = {
      username: data.username,
      password: data.password
    }
  } else if (userType === 'teacher') {
    // 后续老师登录接口预留
    url = '/teacher/doLogin'
    params = {
      username: data.username,
      password: data.password
    }
  } else if (userType === 'admin') {
    // 管理员登录接口预留
    url = '/admin/doLogin'
    params = {
      username: data.username,
      password: data.password
    }
  } else {
    // 默认公共登录（兜底）
    url = '/common/login'
    bodyData = data
  }

  return request({
    url,
    method,
    data: bodyData, // 请求体，学生模式传null
    params // Query参数，学生模式传递账号密码
  })
}

// 退出登录（原样保留）
export function logout() {
  return request({
    url: '/common/logout',
    method: 'post'
  })
}

// 获取当前登录用户信息（原样保留）
export function getUserInfo() {
  return request({
    url: '/common/userInfo',
    method: 'get'
  })
}

// 修改密码（原样保留）
export function changePassword(data) {
  return request({
    url: '/common/password',
    method: 'put',
    data
  })
}

// 修改个人信息（原样保留）
export function updateProfile(data) {
  return request({
    url: '/common/profile',
    method: 'put',
    data
  })
}