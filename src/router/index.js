// src/router/index.js
// 导入Vue路由核心方法
import { createRouter, createWebHistory } from 'vue-router'

// 导入我们即将创建的两个页面组件
import MyInfo from '../views/student/MyInfo.vue'
import MySchedule from '../views/student/MySchedule.vue'
import Login from '../views/login/Login.vue'
// 路由表：路径 <=> 页面组件映射
const routes = [
  // 访问根地址，自动跳转到个人信息页
  {
    path: '/',
    component: Login
  },
  // 个人信息页面
  {
    path: '/info',
    component: MyInfo
  },
  // 我的课表页面
  {
    path: '/schedule',
    component: MySchedule
  }
]

// 创建路由实例
const router = createRouter({
  // createWebHistory = history模式，地址栏不带#，企业标准写法
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 导出路由给main.js使用
export default router

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userInfoStr = localStorage.getItem('userInfo')

  // 未登录强制跳登录页
  if (!token || !userInfoStr) {
    return to.path === '/login' ? next() : next('/login')
  }

  const user = JSON.parse(userInfoStr)
  const role = user.role

  // 权限拦截
  if (to.path.startsWith('/admin') && role !== 'admin') return next('/login')
  if (to.path.startsWith('/teacher') && role !== 'teacher') return next('/login')
  if (to.path.startsWith('/student') && role !== 'student') return next('/login')

  next()
})