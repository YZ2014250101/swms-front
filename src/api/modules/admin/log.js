// src/api/modules/admin/log.js
// 管理员端日志接口
import request from '../../request'

// 获取日志列表
export function getLogList(params) {
  return request({
    url: '/admin/log/list',
    method: 'get',
    params
  })
}
