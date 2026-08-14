// src/api/modules/admin/user.js
// 管理员端用户接口
import request from '../../request'

// 获取学生列表
export function getStudentList(params) {
  return request({
    url: '/admin/user/student/list',
    method: 'get',
    params
  })
}

// 新增学生
export function addStudent(data) {
  return request({
    url: '/admin/user/student',
    method: 'post',
    data
  })
}

// 更新学生
export function updateStudent(data) {
  return request({
    url: '/admin/user/student',
    method: 'put',
    data
  })
}

// 删除学生
export function deleteStudent(id) {
  return request({
    url: `/admin/user/student/${id}`,
    method: 'delete'
  })
}

// 重置学生密码
export function resetStudentPassword(id) {
  return request({
    url: `/admin/user/student/${id}/reset`,
    method: 'put'
  })
}

// 获取教师列表
export function getTeacherList(params) {
  return request({
    url: '/admin/user/teacher/list',
    method: 'get',
    params
  })
}

// 新增教师
export function addTeacher(data) {
  return request({
    url: '/admin/user/teacher',
    method: 'post',
    data
  })
}

// 更新教师
export function updateTeacher(data) {
  return request({
    url: '/admin/user/teacher',
    method: 'put',
    data
  })
}

// 删除教师
export function deleteTeacher(id) {
  return request({
    url: `/admin/user/teacher/${id}`,
    method: 'delete'
  })
}

// 获取管理员列表
export function getAdminList(params) {
  return request({
    url: '/admin/user/admin/list',
    method: 'get',
    params
  })
}

// 新增管理员
export function addAdmin(data) {
  return request({
    url: '/admin/user/admin',
    method: 'post',
    data
  })
}

// 更新管理员
export function updateAdmin(data) {
  return request({
    url: '/admin/user/admin',
    method: 'put',
    data
  })
}

// 删除管理员
export function deleteAdmin(id) {
  return request({
    url: `/admin/user/admin/${id}`,
    method: 'delete'
  })
}
