// src/api/modules/teacher/homework.js
// 教师端作业管理接口（对应文档 4.7 作业管理）
import request from '../../request'

/**
 * 作业管理首页
 * GET /teacher/homeworkManagement → { courseList }
 */
export function getHomeworkManagement() {
  return request({
    url: '/teacher/homeworkManagement',
    method: 'get'
  })
}

/**
 * 课程作业列表
 * GET /teacher/homeworkList，params: { courseId } → { homeworkList, course }
 * @param {number|string} courseId
 */
export function getHomeworkList(courseId) {
  return request({
    url: '/teacher/homeworkList',
    method: 'get',
    params: { courseId }
  })
}

/**
 * 发布作业（文件上传 multipart/form-data）
 * POST /teacher/saveHomework，data: FormData(courseId, title, content, deadline, attachment?) → { msg }
 * @param {FormData} formData
 */
export function saveHomework(formData) {
  return request({
    url: '/teacher/saveHomework',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

/**
 * 修改作业（文件上传 multipart/form-data）
 * POST /teacher/updateHomework，data: FormData(id, title, content, ..., attachment?) → { msg }
 * @param {FormData} formData
 */
export function updateHomework(formData) {
  return request({
    url: '/teacher/updateHomework',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

/**
 * 删除作业
 * GET /teacher/deleteHomework，params: { id } → { msg }
 * @param {number|string} id
 */
export function deleteHomework(id) {
  return request({
    url: '/teacher/deleteHomework',
    method: 'get',
    params: { id }
  })
}

/**
 * 下载作业附件（文件下载）
 * GET /teacher/downloadHomeworkAttachment，params: { id }，responseType: 'blob'
 * @param {number|string} id
 */
export function downloadHomeworkAttachment(id) {
  return request({
    url: '/teacher/downloadHomeworkAttachment',
    method: 'get',
    params: { id },
    responseType: 'blob'
  })
}

/**
 * 学生提交列表
 * GET /teacher/homeworkSubmissions，params: { homeworkId } → { submissionList, homework }
 * @param {number|string} homeworkId
 */
export function getHomeworkSubmissions(homeworkId) {
  return request({
    url: '/teacher/homeworkSubmissions',
    method: 'get',
    params: { homeworkId }
  })
}

/**
 * 批改作业（表单参数）
 * POST /teacher/saveHomeworkGrade，params: { submissionId, score, comment } → { msg, homeworkId }
 * @param {number|string} submissionId
 * @param {number|string} score
 * @param {string} comment
 */
export function saveHomeworkGrade(submissionId, score, comment) {
  return request({
    url: '/teacher/saveHomeworkGrade',
    method: 'post',
    params: { submissionId, score, comment }
  })
}

/**
 * 下载学生提交的作业（文件下载）
 * GET /teacher/downloadSubmission，params: { submissionId }，responseType: 'blob'
 * @param {number|string} submissionId
 */
export function downloadSubmission(submissionId) {
  return request({
    url: '/teacher/downloadSubmission',
    method: 'get',
    params: { submissionId },
    responseType: 'blob'
  })
}
