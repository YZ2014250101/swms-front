// src/api/modules/teacher/attendance.js
// 教师端考勤接口
import request from '../../request'

// 保存考勤
export function saveAttendance(data) {
  return request({
    url: '/teacher/attendance/save',
    method: 'post',
    data
  })
}

// 获取考勤列表
export function getAttendanceList(params) {
  return request({
    url: '/teacher/attendance/list',
    method: 'get',
    params
  })
}
