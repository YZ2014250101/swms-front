// src/api/modules/admin/semester.js
// 管理员端学期接口
import request from '../../request'

// 获取学期列表
export function getSemesterList(params) {
  return request({
    url: '/admin/semester/list',
    method: 'get',
    params
  })
}

// 新增学期
export function addSemester(data) {
  return request({
    url: '/admin/semester',
    method: 'post',
    data
  })
}

// 更新学期
export function updateSemester(data) {
  return request({
    url: '/admin/semester',
    method: 'put',
    data
  })
}

// 删除学期
export function deleteSemester(id) {
  return request({
    url: `/admin/semester/${id}`,
    method: 'delete'
  })
}
