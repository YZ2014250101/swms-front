// src/api/modules/admin/department.js
// 管理员端院系/专业/班级接口
import request from '../../request'

// 获取院系列表
export function getDepartmentList(params) {
  return request({
    url: '/admin/department/list',
    method: 'get',
    params
  })
}

// 新增院系
export function addDepartment(data) {
  return request({
    url: '/admin/department',
    method: 'post',
    data
  })
}

// 更新院系
export function updateDepartment(data) {
  return request({
    url: '/admin/department',
    method: 'put',
    data
  })
}

// 删除院系
export function deleteDepartment(id) {
  return request({
    url: `/admin/department/${id}`,
    method: 'delete'
  })
}

// 获取专业列表
export function getMajorList(params) {
  return request({
    url: '/admin/major/list',
    method: 'get',
    params
  })
}

// 新增专业
export function addMajor(data) {
  return request({
    url: '/admin/major',
    method: 'post',
    data
  })
}

// 更新专业
export function updateMajor(data) {
  return request({
    url: '/admin/major',
    method: 'put',
    data
  })
}

// 删除专业
export function deleteMajor(id) {
  return request({
    url: `/admin/major/${id}`,
    method: 'delete'
  })
}

// 获取班级列表
export function getClassList(params) {
  return request({
    url: '/admin/class/list',
    method: 'get',
    params
  })
}

// 新增班级
export function addClass(data) {
  return request({
    url: '/admin/class',
    method: 'post',
    data
  })
}

// 更新班级
export function updateClass(data) {
  return request({
    url: '/admin/class',
    method: 'put',
    data
  })
}

// 删除班级
export function deleteClass(id) {
  return request({
    url: `/admin/class/${id}`,
    method: 'delete'
  })
}
