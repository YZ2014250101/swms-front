// src/api/modules/student/schedule.js
// 学生端课表接口
import request from '../../request'

// 获取学生课表
export function getStudentSchedule(params) {
  return request({
    url: '/student/mySchedule',
    method: 'get',
    params
  })
}
