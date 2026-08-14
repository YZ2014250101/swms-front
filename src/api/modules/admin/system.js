// src/api/modules/admin/system.js
// 管理员端系统设置接口（对应文档 5.15 系统设置）
import request from '../../request'

/**
 * 获取系统配置
 * GET /admin/systemSettings → { config }
 */
export function getSystemConfig() {
  return request({
    url: '/admin/systemSettings',
    method: 'get'
  })
}

/**
 * 保存系统配置（表单参数）
 * POST /admin/saveSystemSettings，params: data → { msg }
 * @param {object} data
 */
export function saveSystemConfig(data) {
  return request({
    url: '/admin/saveSystemSettings',
    method: 'post',
    params: data
  })
}
