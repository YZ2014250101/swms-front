// src/router/index.js
// 导入Vue路由核心方法
import { createRouter, createWebHistory } from 'vue-router'

// 导入我们即将创建的两个页面组件
import MyInfo from '../views/MyInfo.vue'
import MySchedule from '../views/MySchedule.vue'

// 路由表：路径 <=> 页面组件映射
const routes = [
  // 访问根地址，自动跳转到个人信息页
  {
    path: '/',
    redirect: '/myinfo'
  },
  // 个人信息页面
  {
    path: '/myinfo',
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