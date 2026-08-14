// src/api/modules/student/attendance.js
// 学生端考勤接口
import request from '../../request'

// 获取考勤列表
export function getAttendanceList(params) {
  return request({
    url: '/student/attendance/list',
    method: 'get',
    params
  })
}
