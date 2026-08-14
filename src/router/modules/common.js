// src/router/modules/common.js
// 公共路由：登录页、404。各端共享的 password/notice/announcement 作为子路由注入各端布局
import Login from '@/views/login/Login.vue'

// 公共子路由工厂（挂到各端布局 children 下，path 为相对路径）
// 使用工厂函数返回全新对象，避免同一路由记录对象被多端复用导致 Vue Router 内部元数据互相覆盖、路由匹配失效（404）
export function getCommonChildren() {
  return [
    {
      path: 'password',
      component: () => import('@/views/common/Password.vue'),
      meta: { title: '修改密码' }
    },
    {
      path: 'notice',
      component: () => import('@/views/common/Notice.vue'),
      meta: { title: '消息通知' }
    },
    {
      path: 'system-announcement',
      component: () => import('@/views/common/Announcement.vue'),
      meta: { title: '系统公告' }
    },
    {
      path: 'system-announcement/:id',
      component: () => import('@/views/common/AnnouncementDetail.vue'),
      meta: { title: '公告详情', hidden: true }
    }
  ]
}

// 登录与 404 等无布局路由
export const baseRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/common/NotFound.vue'),
    meta: { title: '页面不存在' }
  }
]
