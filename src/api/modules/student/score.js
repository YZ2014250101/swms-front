// src/api/modules/student/score.js
// 学生端成绩接口
import request from '../../request'

// 获取成绩列表
export function getScoreList(params) {
  return request({
    url: '/student/score/list',
    method: 'get',
    params
  })
}

// 获取 GPA
export function getGpa(params) {
  return request({
    url: '/student/score/gpa',
    method: 'get',
    params
  })
}

// 提交成绩申诉
export function submitAppeal(data) {
  return request({
    url: '/student/score/appeal',
    method: 'post',
    data
  })
}

// 获取申诉列表
export function getAppealList(params) {
  return request({
    url: '/student/score/appeal/list',
    method: 'get',
    params
  })
}
