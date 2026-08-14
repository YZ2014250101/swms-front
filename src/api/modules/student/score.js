// src/api/modules/student/score.js
// 学生端成绩接口（对应文档 3.4 成绩）
import request from '../../request'

/**
 * 获取已发布成绩 + GPA
 * GET /student/gradeList → { gradeList, gpaInfo, allGrades }
 */
export function getScoreList() {
  return request({
    url: '/student/gradeList',
    method: 'get'
  })
}

/**
 * 全部成绩历史
 * GET /student/gradeHistory → { gradeList, gpaInfo }
 */
export function getGradeHistory() {
  return request({
    url: '/student/gradeHistory',
    method: 'get'
  })
}

/**
 * 导出 CSV 成绩单（文件下载）
 * GET /student/exportGrade，responseType: 'blob'
 */
export function exportGrade() {
  return request({
    url: '/student/exportGrade',
    method: 'get',
    responseType: 'blob'
  })
}

/**
 * 申诉页数据
 * GET /student/toAppeal，params: { gradeId } → { grade }
 * @param {number|string} gradeId
 */
export function toAppeal(gradeId) {
  return request({
    url: '/student/toAppeal',
    method: 'get',
    params: { gradeId }
  })
}

/**
 * 提交申诉
 * POST /student/submitAppeal，params: { gradeId, appealReason } → { msg }
 * @param {object} params { gradeId, appealReason }
 */
export function submitAppeal(params) {
  return request({
    url: '/student/submitAppeal',
    method: 'post',
    params
  })
}

/**
 * 获取 GPA 数据：成绩 GPA 数据在 gradeList 返回的 gpaInfo 里，复用 getScoreList
 */
export function getGpa() {
  return getScoreList()
}
