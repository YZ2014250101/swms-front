// src/api/modules/admin/statistics.js
// 管理员端数据统计接口（对应文档 5.13 数据统计 + 5.16 流量统计）
import request from '../../request'

/**
 * 首页统计
 * GET /admin/statistics → { studentCount, teacherCount, courseCount, selectionRate }
 */
export function getOverview() {
  return request({
    url: '/admin/statistics',
    method: 'get'
  })
}

/**
 * 访问统计
 * GET /admin/visitStats → { totalVisits, todayVisits, weekVisits, monthVisits, yearVisits, hourlyStats, dailyStats, monthlyStats, yearlyStats }
 */
export function getVisitStats() {
  return request({
    url: '/admin/visitStats',
    method: 'get'
  })
}

/**
 * 用户访问日志
 * GET /admin/userVisitLog，params: { userId?, role? } → { visitLogs, searchUserId, searchRole }
 * @param {object} params { userId, role }
 */
export function getUserVisitLog(params) {
  return request({
    url: '/admin/userVisitLog',
    method: 'get',
    params
  })
}
