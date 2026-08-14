// src/api/modules/student/course.js
// 学生端选课与学习中心接口（对应文档 3.2 选课 + 3.9 学习中心）
import request from '../../request'

/**
 * 获取全部课程列表 + 选课开关
 * GET /student/courseList → { courseList, globalSelectable, selectStartTime, selectEndTime, inSelectTimeRange }
 */
export function getCourseList() {
  return request({
    url: '/student/courseList',
    method: 'get'
  })
}

/**
 * 选课
 * GET /student/selectCourse，params: { courseId } → { msg }
 * @param {object} params { courseId }
 */
export function selectCourse(params) {
  return request({
    url: '/student/selectCourse',
    method: 'get',
    params
  })
}

/**
 * 获取已选课程
 * GET /student/myCourse → { myCourseList, canDrop, dropHint }
 */
export function getMyCourses() {
  return request({
    url: '/student/myCourse',
    method: 'get'
  })
}

/**
 * 退课
 * GET /student/dropCourse，params: { courseId } → { msg }
 * @param {object} params { courseId }
 */
export function dropCourse(params) {
  return request({
    url: '/student/dropCourse',
    method: 'get',
    params
  })
}

/**
 * 课程详情 + 资料
 * GET /student/study/courseDetail，params: { courseId } → { course, scheduleList, fileList }
 * @param {number|string} courseId
 */
export function getCourseDetail(courseId) {
  return request({
    url: '/student/study/courseDetail',
    method: 'get',
    params: { courseId }
  })
}

/**
 * 课表列表
 * GET /student/study/timetable → { scheduleList }
 */
export function getTimetable() {
  return request({
    url: '/student/study/timetable',
    method: 'get'
  })
}

/**
 * 下载课程资料
 * GET /student/study/download，params: { fileId }，responseType: 'blob'（文件下载）
 * @param {number|string} fileId
 */
export function downloadMaterial(fileId) {
  return request({
    url: '/student/study/download',
    method: 'get',
    params: { fileId },
    responseType: 'blob'
  })
}
