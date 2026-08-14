// src/api/modules/admin/role.js
// 管理员端角色接口
import request from '../../request'

// 获取角色列表
export function getRoleList(params) {
  return request({
    url: '/admin/role/list',
    method: 'get',
    params
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/admin/role',
    method: 'post',
    data
  })
}

// 更新角色
export function updateRole(data) {
  return request({
    url: '/admin/role',
    method: 'put',
    data
  })
}

// 删除角色
export function deleteRole(id) {
  return request({
    url: `/admin/role/${id}`,
    method: 'delete'
  })
}

// 分配权限
export function assignPermissions(data) {
  return request({
    url: '/admin/role/permissions',
    method: 'post',
    data
  })
}

// 获取权限树
export function getPermissionTree() {
  return request({
    url: '/admin/role/permission-tree',
    method: 'get'
  })
}
