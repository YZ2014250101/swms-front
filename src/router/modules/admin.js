// src/router/modules/admin.js
// 管理员端路由
import AppLayout from '@/components/layout/AppLayout.vue'
import { getCommonChildren } from './common'

const adminRoutes = [
  {
    path: '/admin',
    component: AppLayout,
    redirect: '/admin/index',
    meta: { roles: ['admin'] },
    children: [
      {
        path: 'index',
        name: 'AdminIndex',
        component: () => import('@/views/admin/Index.vue'),
        meta: { title: '首页', roles: ['admin'] }
      },
      // 用户权限
      {
        path: 'student',
        name: 'AdminStudent',
        component: () => import('@/views/admin/StudentManage.vue'),
        meta: { title: '学生管理', roles: ['admin'] }
      },
      {
        path: 'teacher',
        name: 'AdminTeacher',
        component: () => import('@/views/admin/TeacherManage.vue'),
        meta: { title: '教师管理', roles: ['admin'] }
      },
      {
        path: 'admin',
        name: 'AdminAdmin',
        component: () => import('@/views/admin/AdminManage.vue'),
        meta: { title: '管理员管理', roles: ['admin'] }
      },
      {
        path: 'role',
        name: 'AdminRole',
        component: () => import('@/views/admin/RoleManage.vue'),
        meta: { title: '角色权限', roles: ['admin'] }
      },
      // 院系班级
      {
        path: 'department',
        name: 'AdminDepartment',
        component: () => import('@/views/admin/Department.vue'),
        meta: { title: '院系管理', roles: ['admin'] }
      },
      {
        path: 'major',
        name: 'AdminMajor',
        component: () => import('@/views/admin/Major.vue'),
        meta: { title: '专业管理', roles: ['admin'] }
      },
      {
        path: 'class',
        name: 'AdminClass',
        component: () => import('@/views/admin/Class.vue'),
        meta: { title: '班级管理', roles: ['admin'] }
      },
      // 课程资源
      {
        path: 'course',
        name: 'AdminCourse',
        component: () => import('@/views/admin/CourseManage.vue'),
        meta: { title: '课程管理', roles: ['admin'] }
      },
      // 学期时间
      {
        path: 'semester',
        name: 'AdminSemester',
        component: () => import('@/views/admin/Semester.vue'),
        meta: { title: '学期管理', roles: ['admin'] }
      },
      // 考试安排
      {
        path: 'exam',
        name: 'AdminExam',
        component: () => import('@/views/admin/ExamArrange.vue'),
        meta: { title: '考试编排', roles: ['admin'] }
      },
      // 公告系统
      {
        path: 'announcement',
        name: 'AdminAnnouncement',
        component: () => import('@/views/admin/AnnouncementManage.vue'),
        meta: { title: '公告管理', roles: ['admin'] }
      },
      // 统计监控
      {
        path: 'statistics',
        name: 'AdminStatistics',
        component: () => import('@/views/admin/Statistics.vue'),
        meta: { title: '数据统计', roles: ['admin'] }
      },
      {
        path: 'log',
        name: 'AdminLog',
        component: () => import('@/views/admin/LogManage.vue'),
        meta: { title: '日志管理', roles: ['admin'] }
      },
      // 系统设置
      {
        path: 'settings',
        name: 'AdminSettings',
        component: () => import('@/views/admin/SystemSettings.vue'),
        meta: { title: '系统设置', roles: ['admin'] }
      },
      // AI对话
      {
        path: 'ai',
        name: 'AdminAi',
        component: () => import('@/views/admin/AiChat.vue'),
        meta: { title: 'AI对话', roles: ['admin'] }
      },
      // 公共页面
      ...getCommonChildren()
    ]
  }
]

export default adminRoutes
