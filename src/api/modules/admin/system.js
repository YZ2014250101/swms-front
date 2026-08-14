// src/api/modules/admin/system.js
// 管理员端系统配置接口
import request from '../../request'

// 获取系统配置
export function getSystemConfig() {
  return request({
    url: '/admin/system/config',
    method: 'get'
  })
}

// 更新系统配置
export function updateSystemConfig(data) {
  return request({
    url: '/admin/system/config',
    method: 'put',
    data
  })
}
