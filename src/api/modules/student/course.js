// src/api/modules/student/course.js
// 学生端选课接口
import request from '../../request'

// 获取可选课程列表
export function getCourseList(params) {
  return request({
    url: '/student/course/list',
    method: 'get',
    params
  })
}

// 选课
export function selectCourse(data) {
  return request({
    url: '/student/course/select',
    method: 'post',
    data
  })
}

// 退课（用 params 传 courseId）
export function dropCourse(data) {
  return request({
    url: '/student/course/drop',
    method: 'delete',
    params: data
  })
}

// 获取已选课程列表
export function getMyCourses(params) {
  return request({
    url: '/student/course/my',
    method: 'get',
    params
  })
}

// 获取课程详情
export function getCourseDetail(id) {
  return request({
    url: `/student/course/${id}`,
    method: 'get'
  })
}
