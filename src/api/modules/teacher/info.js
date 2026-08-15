// src/api/modules/teacher/info.js
// 教师端个人信息接口（对应文档 3.1 个人信息）
import request from '../../request'

/**
 * 获取教师个人信息
 * GET /teacher/myInfo → { teacherId, name, gender, department }
 */
export function getTeacherInfo() {
  return request({
    url: '/teacher/myInfo',
    method: 'get'
  })
}

/**
 * 修改教师个人信息
 * 后端文档无此接口，保留但注释"后端暂无修改接口"
 * @param {object} data 个人信息表单
 */
export function updateTeacherInfo(data) {
  // 后端暂无修改接口
  return request({
    url: '/teacher/myInfo',
    method: 'put',
    params: data
  })
}
