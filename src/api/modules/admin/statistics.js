// src/api/modules/admin/statistics.js
// 管理员端统计接口
import request from '../../request'

// 获取总览统计
export function getOverview() {
  return request({
    url: '/admin/statistics/overview',
    method: 'get'
  })
}

// 获取比率统计
export function getRateStats() {
  return request({
    url: '/admin/statistics/rate',
    method: 'get'
  })
}
