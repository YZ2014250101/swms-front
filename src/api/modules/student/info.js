// src/api/modules/student/info.js
// 学生端个人信息接口
import request from '../../request'

// 获取学生个人信息
export function getStudentInfo() {
  return request({
    url: '/student/myInfo',
    method: 'get'
  })
}

// 更新学生个人信息
export function updateStudentInfo(data) {
  return request({
    url: '/student/myInfo',
    method: 'put',
    data
  })
}
