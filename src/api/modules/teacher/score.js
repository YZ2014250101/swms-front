// src/api/modules/teacher/score.js
// 教师端成绩管理接口（对应文档 4.4 成绩管理 + 4.5 成绩申诉与审核）
import request from '../../request'

/**
 * 成绩录入页数据
 * GET /teacher/studentListForGrade，params: { courseId } → { studentList, course, gradeInputAllowed, gradeInputMsg }
 * @param {number|string} courseId
 */
export function getStudentListForGrade(courseId) {
  return request({
    url: '/teacher/studentListForGrade',
    method: 'get',
    params: { courseId }
  })
}

/**
 * 成绩录入（含权限校验）
 * GET /teacher/gradeInput，params: { courseId } → { studentList, course, gradeList, gradeInputAllowed, gradeInputMsg }
 * @param {number|string} courseId
 */
export function gradeInput(courseId) {
  return request({
    url: '/teacher/gradeInput',
    method: 'get',
    params: { courseId }
  })
}

/**
 * 保存单个成绩（表单参数）
 * POST /teacher/saveGrade，params: { studentId, courseId, dailyScore, finalScore } → { msg }
 * @param {object} data { studentId, courseId, dailyScore, finalScore }
 */
export function saveGrade(data) {
  return request({
    url: '/teacher/saveGrade',
    method: 'post',
    params: data
  })
}

/**
 * 批量保存成绩（数组参数）
 * POST /teacher/batchSaveGrade，params: { studentIds(数组), courseId, dailyScores(数组,可选), finalScores(数组,可选) } → { msg }
 * @param {object} data
 */
export function batchSaveGrade(data) {
  return request({
    url: '/teacher/batchSaveGrade',
    method: 'post',
    params: data
  })
}

/**
 * 发布成绩
 * GET /teacher/publishGrade，params: { id } → { msg, grade }
 * @param {number|string} id
 */
export function publishGrade(id) {
  return request({
    url: '/teacher/publishGrade',
    method: 'get',
    params: { id }
  })
}

/**
 * 批量发布成绩（数组参数）
 * POST /teacher/batchPublishGrade，params: { ids(数组), courseId(可选) } → { msg }
 * @param {Array} ids
 * @param {number|string} courseId
 */
export function batchPublishGrade(ids, courseId) {
  return request({
    url: '/teacher/batchPublishGrade',
    method: 'post',
    params: { ids, courseId }
  })
}

/**
 * 删除成绩
 * GET /teacher/deleteGrade，params: { id } → { msg }
 * @param {number|string} id
 */
export function deleteGrade(id) {
  return request({
    url: '/teacher/deleteGrade',
    method: 'get',
    params: { id }
  })
}

/**
 * 导出学生名单 CSV（文件下载）
 * GET /teacher/exportStudentList，params: { courseId }，responseType: 'blob'
 * @param {number|string} courseId
 */
export function exportStudentList(courseId) {
  return request({
    url: '/teacher/exportStudentList',
    method: 'get',
    params: { courseId },
    responseType: 'blob'
  })
}

/**
 * 导出成绩 CSV（文件下载）
 * GET /teacher/exportGrade，params: { courseId }，responseType: 'blob'
 * @param {number|string} courseId
 */
export function exportGrade(courseId) {
  return request({
    url: '/teacher/exportGrade',
    method: 'get',
    params: { courseId },
    responseType: 'blob'
  })
}

/**
 * 下载成绩导入模板（文件下载）
 * GET /teacher/downloadGradeTemplate，responseType: 'blob'
 */
export function downloadGradeTemplate() {
  return request({
    url: '/teacher/downloadGradeTemplate',
    method: 'get',
    responseType: 'blob'
  })
}

/**
 * 导入成绩（文件上传 multipart/form-data）
 * POST /teacher/importGrade，data: FormData(file, courseId) → { msg }
 * @param {FormData} formData
 */
export function importGrade(formData) {
  return request({
    url: '/teacher/importGrade',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

/**
 * 成绩统计
 * GET /teacher/gradeStats，params: { courseId } → { stats }
 * @param {number|string} courseId
 */
export function getGradeStats(courseId) {
  return request({
    url: '/teacher/gradeStats',
    method: 'get',
    params: { courseId }
  })
}

/**
 * 成绩管理首页
 * GET /teacher/gradeManagement → { courseList }
 */
export function getGradeManagement() {
  return request({
    url: '/teacher/gradeManagement',
    method: 'get'
  })
}

/**
 * 待审核成绩列表
 * GET /teacher/gradeReviewList → { gradeList }
 */
export function getGradeReviewList() {
  return request({
    url: '/teacher/gradeReviewList',
    method: 'get'
  })
}

/**
 * 申诉列表
 * GET /teacher/appealList → { appealList }
 */
export function getAppealList() {
  return request({
    url: '/teacher/appealList',
    method: 'get'
  })
}

/**
 * 处理申诉（表单参数）
 * POST /teacher/handleAppeal，params: { id, appealStatus, appealReason } → { msg }
 * @param {object} data
 */
export function handleAppeal(data) {
  return request({
    url: '/teacher/handleAppeal',
    method: 'post',
    params: data
  })
}

/**
 * 驳回成绩
 * GET /teacher/rejectGrade，params: { id, rejectReason } → { msg }
 * @param {number|string} id
 * @param {string} rejectReason
 */
export function rejectGrade(id, rejectReason) {
  return request({
    url: '/teacher/rejectGrade',
    method: 'get',
    params: { id, rejectReason }
  })
}
