// src/api/modules/teacher/student.js
// 教师端学生管理接口（对应文档 4.2 学生管理）
import request from '../../request'

/**
 * 选课学生名单
 * GET /teacher/studentList，params: { courseId } → { studentList, course }
 * @param {number|string} courseId
 */
export function getCourseStudents(courseId) {
  return request({
    url: '/teacher/studentList',
    method: 'get',
    params: { courseId }
  })
}

/**
 * 新增学生（表单参数）
 * POST /teacher/addStudent，params: data(Student 表单) → { msg }
 * @param {object} data
 */
export function addStudent(data) {
  return request({
    url: '/teacher/addStudent',
    method: 'post',
    params: data
  })
}

/**
 * 学生编辑回显
 * GET /teacher/toEdit，params: { id } → { stu }
 * @param {number|string} id
 */
export function toEditStudent(id) {
  return request({
    url: '/teacher/toEdit',
    method: 'get',
    params: { id }
  })
}

/**
 * 更新学生信息（表单参数）
 * POST /teacher/update，params: data → { msg }
 * @param {object} data
 */
export function updateStudent(data) {
  return request({
    url: '/teacher/update',
    method: 'post',
    params: data
  })
}

/**
 * 从课程中移除学生
 * GET /teacher/deleteStudent，params: { studentId, courseId } → { msg }
 * @param {number|string} studentId
 * @param {number|string} courseId
 */
export function deleteStudent(studentId, courseId) {
  return request({
    url: '/teacher/deleteStudent',
    method: 'get',
    params: { studentId, courseId }
  })
}

/**
 * 按学号添加学生到课程
 * POST /teacher/addStudentToCourse，params: { courseId, studentNo } → { msg }
 * @param {number|string} courseId
 * @param {string} studentNo
 */
export function addStudentToCourse(courseId, studentNo) {
  return request({
    url: '/teacher/addStudentToCourse',
    method: 'post',
    params: { courseId, studentNo }
  })
}

/**
 * 选课统计：文档无单独接口，复用 studentList 返回的 studentList 数量
 * @param {number|string} courseId
 */
export function getSelectionStats(courseId) {
  return request({
    url: '/teacher/studentList',
    method: 'get',
    params: { courseId }
  })
}
