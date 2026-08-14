// src/api/modules/common/auth.js
// 公共鉴权接口：三端登录、退出、检查登录、修改密码
// 后端登录按角色分接口：/student/doLogin、/teacher/doLogin、/admin/doLogin
import request from '../../request'


/**
 * 统一登录（按 role 调对应接口）
 * @param {string} role student/teacher/admin
 * @param {object} data { username, password }
 * @returns 返回 data: { token, role, userId, name, studentId|teacherId|adminId }
 */
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data,  // ✅ data 放到请求body里，JSON格式传输
    headers: { 'Content-Type': 'application/json' }

  })
}

// 退出登录
export function logout(role) {
  return request({
    url: '/logout',
    method: 'get'
  })
}

// 检查登录状态
export function checkLogin(role) {
  return request({
    url: '/checkLogin',
    method: 'get'
  })
}

/**
 * 修改密码（三角色共用，后端根据 token 中 role 自动判断）
 * 注意：此接口用 JSON Body
 * @param {object} data { oldPassword, newPassword }
 */
export function changePassword(data) {
  return request({
    url: '/common/password/change',
    method: 'put',
    data,
    headers: { 'Content-Type': 'application/json' }
  })
}
