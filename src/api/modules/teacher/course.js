// src/api/modules/teacher/course.js
// 教师端课程接口（对应文档 4.1 个人信息 + 4.2 学生管理中的授课列表）
import request from '../../request'

/**
 * 我的授课列表
 * GET /teacher/myCourse → { courseList }
 */
export function getTeacherCourses() {
  return request({
    url: '/teacher/myCourse',
    method: 'get'
  })
}

/**
 * 教师课表
 * 后端文档无教师课表单独接口，暂用 /teacher/myInfo（4.1 个人信息）返回
 * 返回 { name, teacherId, department, title }
 */
export function getTeacherSchedule() {
  // 后端无教师课表单独接口，暂调 /teacher/myInfo
  return request({
    url: '/teacher/myInfo',
    method: 'get'
  })
}
