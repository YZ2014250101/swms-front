// src/store/modules/user.js
// 用户状态：登录态、token、角色、用户信息
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { ROLE } from '@/constants/role'

export const useUserStore = defineStore('user', () => {
  // token
  const token = ref(getToken() || '')
  // 角色标识
  const role = ref(localStorage.getItem('swms_role') || '')
  // 用户信息
  const userInfo = ref(JSON.parse(localStorage.getItem('swms_user') || 'null'))
  // 权限码列表
  const permissions = ref([])

  // 是否已登录
  const isLogin = computed(() => !!token.value)
  // 角色中文
  const roleLabel = computed(() => {
    const map = { [ROLE.STUDENT]: '学生', [ROLE.TEACHER]: '教师', [ROLE.ADMIN]: '管理员' }
    return map[role.value] || ''
  })

  // 设置 token
  function setTokenAction(t) {
    token.value = t
    setToken(t)
  }

  // 设置角色
  function setRoleAction(r) {
    role.value = r
    localStorage.setItem('swms_role', r)
  }

  // 设置用户信息
  function setUserInfoAction(info) {
    userInfo.value = info
    localStorage.setItem('swms_user', JSON.stringify(info))
  }

  // 设置权限码
  function setPermissionsAction(codes) {
    permissions.value = codes || []
  }

  // 登录成功后统一保存
  function loginAction({ token: t, role: r, userInfo: info, permissions: codes }) {
    setTokenAction(t)
    setRoleAction(r)
    if (info) setUserInfoAction(info)
    if (codes) setPermissionsAction(codes)
  }

  // 退出登录：清空所有状态
  function logoutAction() {
    token.value = ''
    role.value = ''
    userInfo.value = null
    permissions.value = []
    removeToken()
    localStorage.removeItem('swms_role')
    localStorage.removeItem('swms_user')
  }

  return {
    token,
    role,
    userInfo,
    permissions,
    isLogin,
    roleLabel,
    setTokenAction,
    setRoleAction,
    setUserInfoAction,
    setPermissionsAction,
    loginAction,
    logoutAction
  }
})
