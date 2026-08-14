// src/api/modules/student/homework.js
// 学生端作业接口
import request from '../../request'

// 获取作业列表
export function getHomeworkList(params) {
  return request({
    url: '/student/homework/list',
    method: 'get',
    params
  })
}

// 提交作业
export function submitHomework(data) {
  return request({
    url: '/student/homework/submit',
    method: 'post',
    data
  })
}

// 获取作业详情
export function getHomeworkDetail(id) {
  return request({
    url: `/student/homework/${id}`,
    method: 'get'
  })
}
