// src/api/modules/student/homework.js
// 学生端作业接口（对应文档 3.6 作业）
import request from '../../request'

/**
 * 我的课程列表
 * GET /student/myHomework → { courseList }
 */
export function getHomeworkCourseList() {
  return request({
    url: '/student/myHomework',
    method: 'get'
  })
}

/**
 * 课程作业列表
 * GET /student/homeworkByCourse，params: { courseId } → { course, homeworkList }
 * @param {number|string} courseId
 */
export function getHomeworkByCourse(courseId) {
  return request({
    url: '/student/homeworkByCourse',
    method: 'get',
    params: { courseId }
  })
}

/**
 * 作业详情 + 提交状态
 * GET /student/homeworkDetail，params: { homeworkId } → { homework, submission }
 * @param {number|string} homeworkId
 */
export function getHomeworkDetail(homeworkId) {
  return request({
    url: '/student/homeworkDetail',
    method: 'get',
    params: { homeworkId }
  })
}

/**
 * 提交作业页数据
 * GET /student/submitHomework，params: { homeworkId } → { homework, submission, isOverdue }
 * @param {number|string} homeworkId
 */
export function getSubmitHomework(homeworkId) {
  return request({
    url: '/student/submitHomework',
    method: 'get',
    params: { homeworkId }
  })
}

/**
 * 提交/重新提交作业（文件上传 multipart/form-data）
 * POST /student/doSubmitHomework，data: FormData(含 homeworkId, content?, file?) → { msg }
 * @param {FormData} formData
 */
export function doSubmitHomework(formData) {
  return request({
    url: '/student/doSubmitHomework',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

/**
 * 下载作业附件（文件下载）
 * GET /student/downloadHomework，params: { homeworkId }，responseType: 'blob'
 * @param {number|string} homeworkId
 */
export function downloadHomework(homeworkId) {
  return request({
    url: '/student/downloadHomework',
    method: 'get',
    params: { homeworkId },
    responseType: 'blob'
  })
}
