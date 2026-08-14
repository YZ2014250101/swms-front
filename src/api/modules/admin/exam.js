// src/api/modules/admin/exam.js
// 管理员端考试安排管理接口（对应文档 5.6 考试安排管理）
import request from '../../request'

/**
 * 考试安排列表
 * GET /admin/examScheduleList → { examList }
 */
export function getExamList() {
  return request({
    url: '/admin/examScheduleList',
    method: 'get'
  })
}

/**
 * 按日期筛选
 * GET /admin/examScheduleByDate，params: { examDate(可选) } → { examList, examDate }
 * @param {string} examDate
 */
export function getExamByDate(examDate) {
  return request({
    url: '/admin/examScheduleByDate',
    method: 'get',
    params: { examDate }
  })
}

/**
 * 新增考试页数据
 * GET /admin/toAddExamSchedule → { courseList, semesterList }
 */
export function toAddExamSchedule() {
  return request({
    url: '/admin/toAddExamSchedule',
    method: 'get'
  })
}

/**
 * 新增考试安排（表单参数）
 * POST /admin/addExamSchedule，params: data(courseId, examDate, startTime, endTime, classroom, ...) → { msg }
 * @param {object} data
 */
export function addExamSchedule(data) {
  return request({
    url: '/admin/addExamSchedule',
    method: 'post',
    params: data
  })
}

/**
 * 编辑回显
 * GET /admin/toEditExamSchedule，params: { id } → { examSchedule, courseList }
 * @param {number|string} id
 */
export function toEditExamSchedule(id) {
  return request({
    url: '/admin/toEditExamSchedule',
    method: 'get',
    params: { id }
  })
}

/**
 * 更新考试安排（表单参数）
 * POST /admin/updateExamSchedule，params: data → { msg }
 * @param {object} data
 */
export function updateExamSchedule(data) {
  return request({
    url: '/admin/updateExamSchedule',
    method: 'post',
    params: data
  })
}

/**
 * 删除考试安排
 * GET /admin/deleteExamSchedule，params: { id } → { msg }
 * @param {number|string} id
 */
export function deleteExamSchedule(id) {
  return request({
    url: '/admin/deleteExamSchedule',
    method: 'get',
    params: { id }
  })
}

/**
 * 批量删除（数组参数）
 * POST /admin/batchDeleteExamSchedule，params: { ids(数组) } → { msg }
 * @param {Array} ids
 */
export function batchDeleteExamSchedule(ids) {
  return request({
    url: '/admin/batchDeleteExamSchedule',
    method: 'post',
    params: { ids }
  })
}

/**
 * 导出考试安排 CSV（文件下载）
 * GET /admin/exportExamSchedule，responseType: 'blob'
 */
export function exportExamSchedule() {
  return request({
    url: '/admin/exportExamSchedule',
    method: 'get',
    responseType: 'blob'
  })
}
