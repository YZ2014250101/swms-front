// src/router/modules/common.js
// 公共路由：登录页、404。各端共享的 profile/password/notice/announcement 作为子路由注入各端布局
import Login from '@/views/login/Login.vue'

// 公共子路由（挂到各端布局 children 下，path 为相对路径）
export const commonChildren = [
  {
    path: 'profile',
    name: 'Profile',
    component: () => import('@/views/common/Profile.vue'),
    meta: { title: '个人信息' }
  },
  {
    path: 'password',
    name: 'Password',
    component: () => import('@/views/common/Password.vue'),
    meta: { title: '修改密码' }
  },
  {
    path: 'notice',
    name: 'Notice',
    component: () => import('@/views/common/Notice.vue'),
    meta: { title: '消息通知' }
  },
  {
    path: 'announcement',
    name: 'Announcement',
    component: () => import('@/views/common/Announcement.vue'),
    meta: { title: '系统公告' }
  },
  {
    path: 'announcement/:id',
    name: 'AnnouncementDetail',
    component: () => import('@/views/common/AnnouncementDetail.vue'),
    meta: { title: '公告详情', hidden: true }
  }
]

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
