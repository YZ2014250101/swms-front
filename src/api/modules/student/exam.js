// src/api/modules/student/exam.js
// 学生端考试接口
import request from '../../request'

// 获取考试列表
export function getExamList(params) {
  return request({
    url: '/student/exam/list',
    method: 'get',
    params
  })
}
