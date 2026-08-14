// src/api/modules/student/info.js
// 学生端个人信息接口（对应文档 3.1 个人信息）
import request from '../../request'

/**
 * 获取学生个人信息
 * GET /student/myInfo → { studentId, name, gender, major }
 */
export function getStudentInfo() {
  return request({
    url: '/student/myInfo',
    method: 'get'
  })
}

/**
 * 修改学生个人信息
 * 后端文档无此接口，保留但注释"后端暂无修改接口"
 * @param {object} data 个人信息表单
 */
export function updateStudentInfo(data) {
  // 后端暂无修改接口
  return request({
    url: '/student/myInfo',
    method: 'put',
    params: data
  })
}
