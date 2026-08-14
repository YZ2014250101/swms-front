// src/utils/permission.js
// 权限判断函数（按钮级）

import { useUserStore } from '@/store/modules/user'

/**
 * 判断当前用户是否拥有指定角色
 * @param {string|string[]} roles 角色标识
 * @returns {boolean}
 */
export function hasRole(roles) {
  const userStore = useUserStore()
  const current = userStore.role
  if (!current) return false
  if (Array.isArray(roles)) {
    return roles.includes(current)
  }
  return current === roles
}

/**
 * 判断当前用户是否拥有指定权限码
 * @param {string|string[]} codes 权限码
 * @returns {boolean}
 */
export function hasPermission(codes) {
  const userStore = useUserStore()
  const permissions = userStore.permissions || []
  if (Array.isArray(codes)) {
    return codes.some((c) => permissions.includes(c))
  }
  return permissions.includes(codes)
}
