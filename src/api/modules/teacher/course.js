// src/api/modules/teacher/course.js
// 教师端课程接口
import request from '../../request'

// 获取教师课程列表
export function getTeacherCourses(params) {
  return request({
    url: '/teacher/course/list',
    method: 'get',
    params
  })
}

// 获取教师课表
export function getTeacherSchedule(params) {
  return request({
    url: '/teacher/course/schedule',
    method: 'get',
    params
  })
}
