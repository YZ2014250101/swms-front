// src/api/modules/teacher/attendance.js
// 教师端考勤管理接口（对应文档 4.6 考勤管理）
import request from '../../request'

/**
 * 考勤管理首页
 * GET /teacher/attendanceManagement → { courseList }
 */
export function getAttendanceManagement() {
  return request({
    url: '/teacher/attendanceManagement',
    method: 'get'
  })
}

/**
 * 考勤点名页
 * GET /teacher/attendanceCheck，params: { courseId } → { studentList, course, attendanceList }
 * @param {number|string} courseId
 */
export function attendanceCheck(courseId) {
  return request({
    url: '/teacher/attendanceCheck',
    method: 'get',
    params: { courseId }
  })
}

/**
 * 保存单条考勤（表单参数）
 * POST /teacher/saveAttendance，params: { studentId, courseId, attendanceDate, status } → { msg }
 * @param {object} data
 */
export function saveAttendance(data) {
  return request({
    url: '/teacher/saveAttendance',
    method: 'post',
    params: data
  })
}

/**
 * 批量保存考勤（数组参数）
 * POST /teacher/batchSaveAttendance，params: { studentIds(数组), courseId, attendanceDate, statuses(数组,可选) } → { msg }
 * @param {object} data
 */
export function batchSaveAttendance(data) {
  return request({
    url: '/teacher/batchSaveAttendance',
    method: 'post',
    params: data
  })
}

/**
 * 考勤编辑回显
 * GET /teacher/editAttendance，params: { id } → { attendance }
 * @param {number|string} id
 */
export function editAttendance(id) {
  return request({
    url: '/teacher/editAttendance',
    method: 'get',
    params: { id }
  })
}

/**
 * 修改考勤（表单参数）
 * POST /teacher/updateAttendance，params: data → { msg }
 * @param {object} data
 */
export function updateAttendance(data) {
  return request({
    url: '/teacher/updateAttendance',
    method: 'post',
    params: data
  })
}

/**
 * 删除考勤
 * GET /teacher/deleteAttendance，params: { id } → { msg }
 * @param {number|string} id
 */
export function deleteAttendance(id) {
  return request({
    url: '/teacher/deleteAttendance',
    method: 'get',
    params: { id }
  })
}

/**
 * 考勤统计
 * GET /teacher/attendanceStats，params: { courseId } → { stats, attendanceList }
 * @param {number|string} courseId
 */
export function getAttendanceStats(courseId) {
  return request({
    url: '/teacher/attendanceStats',
    method: 'get',
    params: { courseId }
  })
}

/**
 * 导出考勤 CSV（文件下载）
 * GET /teacher/exportAttendance，params: { courseId }，responseType: 'blob'
 * @param {number|string} courseId
 */
export function exportAttendance(courseId) {
  return request({
    url: '/teacher/exportAttendance',
    method: 'get',
    params: { courseId },
    responseType: 'blob'
  })
}
