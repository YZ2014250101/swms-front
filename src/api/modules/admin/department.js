// src/api/modules/admin/department.js
// 管理员端院系/专业/班级管理接口（对应文档 5.10 院系 + 5.11 专业 + 5.12 班级）
import request from '../../request'

// ============== 院系管理（5.10）==============

/**
 * 院系列表
 * GET /admin/departmentList → { deptList }
 */
export function getDepartmentList() {
  return request({
    url: '/admin/departmentList',
    method: 'get'
  })
}

/**
 * 新增院系（表单参数）
 * POST /admin/addDepartment，params: data → { msg }
 * @param {object} data
 */
export function addDepartment(data) {
  return request({
    url: '/admin/addDepartment',
    method: 'post',
    params: data
  })
}

/**
 * 院系编辑回显
 * GET /admin/toEditDepartment，params: { id } → { department }
 * @param {number|string} id
 */
export function toEditDepartment(id) {
  return request({
    url: '/admin/toEditDepartment',
    method: 'get',
    params: { id }
  })
}

/**
 * 更新院系（表单参数）
 * POST /admin/updateDepartment，params: data → { msg }
 * @param {object} data
 */
export function updateDepartment(data) {
  return request({
    url: '/admin/updateDepartment',
    method: 'post',
    params: data
  })
}

/**
 * 删除院系
 * GET /admin/deleteDepartment，params: { id } → { msg }
 * @param {number|string} id
 */
export function deleteDepartment(id) {
  return request({
    url: '/admin/deleteDepartment',
    method: 'get',
    params: { id }
  })
}

// ============== 专业管理（5.11）==============

/**
 * 专业列表
 * GET /admin/majorList → { majorList, deptList }
 */
export function getMajorList() {
  return request({
    url: '/admin/majorList',
    method: 'get'
  })
}

/**
 * 新增专业页数据
 * GET /admin/toAddMajor → { deptList }
 */
export function toAddMajor() {
  return request({
    url: '/admin/toAddMajor',
    method: 'get'
  })
}

/**
 * 新增专业（表单参数）
 * POST /admin/addMajor，params: data(name, departmentId, ...) → { msg }
 * @param {object} data
 */
export function addMajor(data) {
  return request({
    url: '/admin/addMajor',
    method: 'post',
    params: data
  })
}

/**
 * 专业编辑回显
 * GET /admin/toEditMajor，params: { id } → { major, deptList }
 * @param {number|string} id
 */
export function toEditMajor(id) {
  return request({
    url: '/admin/toEditMajor',
    method: 'get',
    params: { id }
  })
}

/**
 * 更新专业（表单参数）
 * POST /admin/updateMajor，params: data → { msg }
 * @param {object} data
 */
export function updateMajor(data) {
  return request({
    url: '/admin/updateMajor',
    method: 'post',
    params: data
  })
}

/**
 * 删除专业
 * GET /admin/deleteMajor，params: { id } → { msg }
 * @param {number|string} id
 */
export function deleteMajor(id) {
  return request({
    url: '/admin/deleteMajor',
    method: 'get',
    params: { id }
  })
}

// ============== 班级管理（5.12）==============

/**
 * 班级列表
 * GET /admin/classList → { classList, majorList, teacherList }
 */
export function getClassList() {
  return request({
    url: '/admin/classList',
    method: 'get'
  })
}

/**
 * 新增班级页数据
 * GET /admin/toAddClass → { deptList, majorList, teacherList }
 */
export function toAddClass() {
  return request({
    url: '/admin/toAddClass',
    method: 'get'
  })
}

/**
 * 新增班级（表单参数）
 * POST /admin/addClass，params: data(name, majorId, teacherId, ...) → { msg }
 * @param {object} data
 */
export function addClass(data) {
  return request({
    url: '/admin/addClass',
    method: 'post',
    params: data
  })
}

/**
 * 班级编辑回显
 * GET /admin/toEditClass，params: { id } → { classInfo, deptList, majorList, teacherList }
 * @param {number|string} id
 */
export function toEditClass(id) {
  return request({
    url: '/admin/toEditClass',
    method: 'get',
    params: { id }
  })
}

/**
 * 更新班级（表单参数）
 * POST /admin/updateClass，params: data → { msg }
 * @param {object} data
 */
export function updateClass(data) {
  return request({
    url: '/admin/updateClass',
    method: 'post',
    params: data
  })
}

/**
 * 删除班级
 * GET /admin/deleteClass，params: { id } → { msg }
 * @param {number|string} id
 */
export function deleteClass(id) {
  return request({
    url: '/admin/deleteClass',
    method: 'get',
    params: { id }
  })
}
