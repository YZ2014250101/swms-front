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



// 定义全局变量，缓存上一次上报过的路由路径，避免重复上报
let lastReportPath = ''

router.afterEach((to, from) => {
  // 1. 完全相同路径直接跳过，防止重复点击同一菜单反复上报PV
  if (to.fullPath === lastReportPath) {
    return
  }
  // 2. 封装PV上报函数，写在调用前面
  const reportPV = () => {
    const params = {
      path: to.fullPath,
      name: to.name,
      title: document.title,
      referrer: document.referrer
    }

    fetch('/api/pv/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    }).catch(err => {
      // 静默失败，不影响业务
      console.log('PV统计上报失败', err)
    })

    // 上报成功后更新缓存路径
    lastReportPath = to.fullPath
  }

  // 延迟200ms执行，等待页面DOM渲染完毕
  setTimeout(reportPV, 200)
})
export default router
