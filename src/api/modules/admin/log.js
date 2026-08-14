// src/api/modules/admin/log.js
// 管理员端系统日志接口（对应文档 5.14 系统日志）
import request from '../../request'

/**
 * 系统日志列表
 * GET /admin/systemLogList → { logList }
 */
export function getLogList() {
  return request({
    url: '/admin/systemLogList',
    method: 'get'
  })
}

/**
 * 清空日志
 * GET /admin/cleanSystemLog → { msg }
 */
export function cleanLog() {
  return request({
    url: '/admin/cleanSystemLog',
    method: 'get'
  })
}
