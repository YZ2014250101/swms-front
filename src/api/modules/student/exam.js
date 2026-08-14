// src/api/modules/student/exam.js
// 学生端考试接口（对应文档 3.7 考试）
import request from '../../request'

/**
 * 考试安排
 * GET /student/examScheduleList → { examList }
 */
export function getExamList() {
  return request({
    url: '/student/examScheduleList',
    method: 'get'
  })
}

/**
 * 按日期筛选考试
 * GET /student/examScheduleByDate，params: { examDate(可选) } → { examList, examDate }
 * @param {string} examDate
 */
export function getExamByDate(examDate) {
  return request({
    url: '/student/examScheduleByDate',
    method: 'get',
    params: { examDate }
  })
}
