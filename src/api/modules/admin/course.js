// src/api/modules/admin/course.js
// 管理员端课程接口
import request from '../../request'

// 获取课程列表
export function getCourseList(params) {
  return request({
    url: '/admin/course/list',
    method: 'get',
    params
  })
}

// 新增课程
export function addCourse(data) {
  return request({
    url: '/admin/course',
    method: 'post',
    data
  })
}

// 更新课程
export function updateCourse(data) {
  return request({
    url: '/admin/course',
    method: 'put',
    data
  })
}

// 删除课程
export function deleteCourse(id) {
  return request({
    url: `/admin/course/${id}`,
    method: 'delete'
  })
}

// 切换选课状态
export function toggleSelection(id) {
  return request({
    url: `/admin/course/${id}/selection`,
    method: 'put'
  })
}
