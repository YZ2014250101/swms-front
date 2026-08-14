// src/api/modules/teacher/homework.js
// 教师端作业接口
import request from '../../request'

// 发布作业
export function publishHomework(data) {
  return request({
    url: '/teacher/homework',
    method: 'post',
    data
  })
}

// 获取作业列表
export function getHomeworkList(params) {
  return request({
    url: '/teacher/homework/list',
    method: 'get',
    params
  })
}

// 获取提交列表
export function getSubmitList(homeworkId, params) {
  return request({
    url: `/teacher/homework/${homeworkId}/submits`,
    method: 'get',
    params
  })
}

// 批改作业
export function gradeHomework(data) {
  return request({
    url: '/teacher/homework/grade',
    method: 'post',
    data
  })
}
