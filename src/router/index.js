// src/router/index.js
// 路由入口：合并各端路由 + 公共路由
import { createRouter, createWebHistory } from 'vue-router'
import { baseRoutes } from './modules/common'
import studentRoutes from './modules/student'
import teacherRoutes from './modules/teacher'
import adminRoutes from './modules/admin'
import { setupGuards } from './guards'

const routes = [
  // 根路径：根据登录角色跳转到对应首页（守卫里也会处理）
  {
    path: '/',
    redirect: () => {
      const role = localStorage.getItem('swms_role')
      const map = { student: '/student', teacher: '/teacher', admin: '/admin' }
      return map[role] || '/login'
    }
  },
  ...baseRoutes,
  ...studentRoutes,
  ...teacherRoutes,
  ...adminRoutes
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 安装路由守卫
setupGuards(router)
export default router
