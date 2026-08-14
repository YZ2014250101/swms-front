// src/api/modules/teacher/student.js
// 教师端学生接口
import request from '../../request'

// 获取课程学生列表
export function getCourseStudents(courseId, params) {
  return request({
    url: `/teacher/course/${courseId}/students`,
    method: 'get',
    params
  })
}

// 获取选课统计
export function getSelectionStats(courseId) {
  return request({
    url: `/teacher/course/${courseId}/stats`,
    method: 'get'
  })
}
