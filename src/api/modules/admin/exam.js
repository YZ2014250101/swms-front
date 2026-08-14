// src/api/modules/admin/exam.js
// 管理员端考试接口
import request from '../../request'

// 获取考试列表
export function getExamList(params) {
  return request({
    url: '/admin/exam/list',
    method: 'get',
    params
  })
}

// 新增考试
export function addExam(data) {
  return request({
    url: '/admin/exam',
    method: 'post',
    data
  })
}

// 更新考试
export function updateExam(data) {
  return request({
    url: '/admin/exam',
    method: 'put',
    data
  })
}

// 删除考试
export function deleteExam(id) {
  return request({
    url: `/admin/exam/${id}`,
    method: 'delete'
  })
}
