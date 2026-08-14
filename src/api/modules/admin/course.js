// src/api/modules/admin/course.js
// 管理员端课程管理接口（对应文档 5.4 课程管理）
import request from '../../request'

/**
 * 全部课程列表
 * GET /admin/courseList → { courseList }
 */
export function getCourseList() {
  return request({
    url: '/admin/courseList',
    method: 'get'
  })
}

/**
 * 新增课程页数据
 * GET /admin/toAddCourse → { teacherList }
 */
export function toAddCourse() {
  return request({
    url: '/admin/toAddCourse',
    method: 'get'
  })
}

/**
 * 新增课程（表单参数）
 * POST /admin/addCourse，params: data(courseNo, courseName, teacherId, credit, maxNum, weekDay, startSection, endSection, classroom, weekRange) → { msg }
 * @param {object} data
 */
export function addCourse(data) {
  return request({
    url: '/admin/addCourse',
    method: 'post',
    params: data
  })
}

/**
 * 开关单课程选课
 * GET /admin/toggleSelectable，params: { id, selectable } → { msg }
 * @param {number|string} id
 * @param {number|string} selectable
 */
export function toggleSelectable(id, selectable) {
  return request({
    url: '/admin/toggleSelectable',
    method: 'get',
    params: { id, selectable }
  })
}

/**
 * 全局选课开关
 * GET /admin/toggleGlobalSelectable，params: { enabled } → { msg }
 * @param {number|string} enabled
 */
export function toggleGlobalSelectable(enabled) {
  return request({
    url: '/admin/toggleGlobalSelectable',
    method: 'get',
    params: { enabled }
  })
}

/**
 * 选课时间设置页
 * GET /admin/toSetSelectTime → { selectStartTime, selectEndTime, globalSelectable }
 */
export function toSetSelectTime() {
  return request({
    url: '/admin/toSetSelectTime',
    method: 'get'
  })
}

/**
 * 设置选课时间段（表单参数）
 * POST /admin/setSelectTime，params: { startTime, endTime } → { msg }
 * @param {string} startTime
 * @param {string} endTime
 */
export function setSelectTime(startTime, endTime) {
  return request({
    url: '/admin/setSelectTime',
    method: 'post',
    params: { startTime, endTime }
  })
}

/**
 * 清空选课时间
 * GET /admin/clearSelectTime → { msg }
 */
export function clearSelectTime() {
  return request({
    url: '/admin/clearSelectTime',
    method: 'get'
  })
}

/**
 * 考试时间设置页
 * GET /admin/toSetExamTime，params: { id } → { course }
 * @param {number|string} id
 */
export function toSetExamTime(id) {
  return request({
    url: '/admin/toSetExamTime',
    method: 'get',
    params: { id }
  })
}

/**
 * 保存考试时间（表单参数）
 * POST /admin/saveExamTime，params: { id, examStartTime, examEndTime } → { msg }
 * @param {number|string} id
 * @param {string} examStartTime
 * @param {string} examEndTime
 */
export function saveExamTime(id, examStartTime, examEndTime) {
  return request({
    url: '/admin/saveExamTime',
    method: 'post',
    params: { id, examStartTime, examEndTime }
  })
}
