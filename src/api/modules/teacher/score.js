// src/api/modules/teacher/score.js
// 教师端成绩接口
import request from '../../request'

// 获取学生成绩列表
export function getStudentScores(courseId, params) {
  return request({
    url: `/teacher/score/${courseId}/list`,
    method: 'get',
    params
  })
}

// 保存成绩
export function saveScore(data) {
  return request({
    url: '/teacher/score/save',
    method: 'post',
    data
  })
}

// 批量保存成绩
export function batchSaveScore(data) {
  return request({
    url: '/teacher/score/batch',
    method: 'post',
    data
  })
}

// 导入成绩（含 formData）
export function importScore(data) {
  return request({
    url: '/teacher/score/import',
    method: 'post',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// 获取成绩统计
export function getScoreStats(courseId) {
  return request({
    url: `/teacher/score/${courseId}/stats`,
    method: 'get'
  })
}
