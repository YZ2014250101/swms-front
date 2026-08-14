// src/router/guards.js
// 路由守卫：登录校验 + 角色权限拦截 + 页面标题
import { useUserStore } from '@/store/modules/user'
import { ROLE, ROLE_HOME } from '@/constants/role'

// 白名单：无需登录即可访问
const whiteList = ['/login']

export function setupGuards(router) {
  router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    const isLogin = userStore.isLogin

    // 设置页面标题
    document.title = to.meta.title
      ? `${to.meta.title} - 教务管理系统`
      : '教务管理系统'

    // 1. 已登录访问登录页 -> 跳转各自首页
    if (to.path === '/login' && isLogin) {
      return next(ROLE_HOME[userStore.role] || '/login')
    }

    // 2. 白名单直接放行
    if (whiteList.includes(to.path)) {
      return next()
    }

    // 3. 未登录 -> 跳登录页
    if (!isLogin) {
      return next({ path: '/login', query: { redirect: to.fullPath } })
    }

    // 4. 已登录但访问越权页面（角色不匹配）
    const requiredRoles = to.meta.roles
    if (requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.includes(userStore.role)) {
        // 越权访问，跳回自己首页
        return next(ROLE_HOME[userStore.role] || '/login')
      }
    }

    next()
  })
}
