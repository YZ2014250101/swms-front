// src/api/modules/admin/semester.js
// 管理员端学期管理接口（对应文档 5.5 学期管理）
import request from '../../request'

/**
 * 学期列表
 * GET /admin/semesterList → { semesterList }
 */
export function getSemesterList() {
  return request({
    url: '/admin/semesterList',
    method: 'get'
  })
}

/**
 * 新增学期（表单参数）
 * POST /admin/addSemester，params: data(name, startDate, endDate, ...) → { msg }
 * @param {object} data
 */
export function addSemester(data) {
  return request({
    url: '/admin/addSemester',
    method: 'post',
    params: data
  })
}

/**
 * 学期编辑回显
 * GET /admin/toEditSemester，params: { id } → { semester }
 * @param {number|string} id
 */
export function toEditSemester(id) {
  return request({
    url: '/admin/toEditSemester',
    method: 'get',
    params: { id }
  })
}

/**
 * 更新学期（表单参数）
 * POST /admin/updateSemester，params: data → { msg }
 * @param {object} data
 */
export function updateSemester(data) {
  return request({
    url: '/admin/updateSemester',
    method: 'post',
    params: data
  })
}

/**
 * 删除学期
 * GET /admin/deleteSemester，params: { id } → { msg }
 * @param {number|string} id
 */
export function deleteSemester(id) {
  return request({
    url: '/admin/deleteSemester',
    method: 'get',
    params: { id }
  })
}

/**
 * 设为当前学期
 * GET /admin/setCurrentSemester，params: { id } → { msg }
 * @param {number|string} id
 */
export function setCurrentSemester(id) {
  return request({
    url: '/admin/setCurrentSemester',
    method: 'get',
    params: { id }
  })
}

/**
 * 更新学期状态
 * GET /admin/updateSemesterStatus，params: { id, status } → { msg }
 * @param {number|string} id
 * @param {number|string} status
 */
export function updateSemesterStatus(id, status) {
  return request({
    url: '/admin/updateSemesterStatus',
    method: 'get',
    params: { id, status }
  })
}

/**
 * 开关成绩录入
 * GET /admin/toggleGradeInput，params: { id, enabled } → { msg }
 * @param {number|string} id
 * @param {number|string} enabled
 */
export function toggleGradeInput(id, enabled) {
  return request({
    url: '/admin/toggleGradeInput',
    method: 'get',
    params: { id, enabled }
  })
}
