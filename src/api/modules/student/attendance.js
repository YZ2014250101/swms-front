// src/api/modules/student/attendance.js
// 学生端考勤接口（对应文档 3.5 考勤）
import request from '../../request'

/**
 * 考勤记录 + 统计
 * GET /student/myAttendance → { attendanceList, stats }
 */
export function getAttendanceList() {
  return request({
    url: '/student/myAttendance',
    method: 'get'
  })
}

/**
 * 分课程考勤统计
 * GET /student/attendanceStats → { stats, courseStats, attendanceList }
 */
export function getAttendanceStats() {
  return request({
    url: '/student/attendanceStats',
    method: 'get'
  })
}
