// src/constants/menu.js
// 各端菜单配置：供侧边栏渲染使用
// path 对应路由，icon 为 Element Plus 图标组件名

import { ROLE } from './role'

// 学生端菜单
export const studentMenu = [
  {
    title: '个人中心',
    icon: 'UserFilled',
    children: [
      { title: '个人信息', path: '/student/my-info' },
      { title: '修改密码', path: '/student/password' }
    ]
  },
  {
    title: '选课管理',
    icon: 'Notebook',
    children: [
      { title: '可选课程', path: '/student/course-select' },
      { title: '我的课程', path: '/student/my-courses' }
    ]
  },
  {
    title: '课程学习',
    icon: 'Reading',
    children: [
      { title: '我的课表', path: '/student/schedule' },
      { title: '课程资料', path: '/student/materials' }
    ]
  },
  {
    title: '成绩管理',
    icon: 'Document',
    children: [
      { title: '成绩查询', path: '/student/score' },
      { title: '绩点GPA', path: '/student/gpa' },
      { title: '成绩申诉', path: '/student/score-appeal' }
    ]
  },
  {
    title: '考勤管理',
    icon: 'Calendar',
    children: [{ title: '考勤记录', path: '/student/attendance' }]
  },
  {
    title: '作业管理',
    icon: 'Edit',
    children: [{ title: '我的作业', path: '/student/homework' }]
  },
  {
    title: '考试管理',
    icon: 'Tickets',
    children: [{ title: '考试安排', path: '/student/exam' }]
  }
]

// 教师端菜单
export const teacherMenu = [
  {
    title: '个人中心',
    icon: 'UserFilled',
    children: [
      { title: '个人信息', path: '/teacher/profile' },
      { title: '修改密码', path: '/teacher/password' }
    ]
  },
  {
    title: '授课管理',
    icon: 'Reading',
    children: [
      { title: '所授课程', path: '/teacher/my-courses' },
      { title: '我的课表', path: '/teacher/schedule' },
      { title: '学生名单', path: '/teacher/course-students' }
    ]
  },
  {
    title: '选课管理',
    icon: 'Notebook',
    children: [{ title: '选课统计', path: '/teacher/selection-stats' }]
  },
  {
    title: '成绩管理',
    icon: 'Document',
    children: [
      { title: '成绩录入', path: '/teacher/score-entry' },
      { title: '批量导入', path: '/teacher/score-import' },
      { title: '成绩统计', path: '/teacher/score-stats' }
    ]
  },
  {
    title: '考勤管理',
    icon: 'Calendar',
    children: [{ title: '课堂考勤', path: '/teacher/attendance' }]
  },
  {
    title: '作业管理',
    icon: 'Edit',
    children: [{ title: '作业批改', path: '/teacher/homework' }]
  },
  {
    title: '课程资料',
    icon: 'Files',
    children: [{ title: '资料管理', path: '/teacher/materials' }]
  },
  {
    title: '公告管理',
    icon: 'Bell',
    children: [{ title: '发布公告', path: '/teacher/announcement' }]
  }
]

// 管理员端菜单
export const adminMenu = [
  {
    title: '个人中心',
    icon: 'UserFilled',
    children: [
      { title: '个人信息', path: '/admin/profile' },
      { title: '修改密码', path: '/admin/password' }
    ]
  },
  {
    title: '用户权限',
    icon: 'User',
    children: [
      { title: '学生管理', path: '/admin/student' },
      { title: '教师管理', path: '/admin/teacher' },
      { title: '管理员管理', path: '/admin/admin' },
      { title: '角色权限', path: '/admin/role' }
    ]
  },
  {
    title: '院系班级',
    icon: 'OfficeBuilding',
    children: [
      { title: '院系管理', path: '/admin/department' },
      { title: '专业管理', path: '/admin/major' },
      { title: '班级管理', path: '/admin/class' }
    ]
  },
  {
    title: '课程资源',
    icon: 'Reading',
    children: [{ title: '课程管理', path: '/admin/course' }]
  },
  {
    title: '学期时间',
    icon: 'Calendar',
    children: [{ title: '学期管理', path: '/admin/semester' }]
  },
  {
    title: '考试安排',
    icon: 'Tickets',
    children: [{ title: '考试编排', path: '/admin/exam' }]
  },
  {
    title: '公告系统',
    icon: 'Bell',
    children: [{ title: '公告管理', path: '/admin/announcement' }]
  },
  {
    title: '统计监控',
    icon: 'DataAnalysis',
    children: [
      { title: '数据统计', path: '/admin/statistics' },
      { title: '日志管理', path: '/admin/log' }
    ]
  },
  {
    title: '系统设置',
    icon: 'Setting',
    children: [{ title: '系统设置', path: '/admin/settings' }]
  }
]

// 公共菜单（所有角色都显示）：仅消息公告，个人信息已移至各端菜单
export const commonMenu = [
  {
    title: '消息公告',
    icon: 'ChatDotRound',
    children: [
      { title: '消息通知', path: 'notice' },
      { title: '系统公告', path: 'system-announcement' }
    ]
  }
]

// 根据角色获取菜单
export function getMenuByRole(role) {
  switch (role) {
    case ROLE.STUDENT:
      return studentMenu
    case ROLE.TEACHER:
      return teacherMenu
    case ROLE.ADMIN:
      return adminMenu
    default:
      return []
  }
}
