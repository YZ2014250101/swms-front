// src/router/modules/teacher.js
// 教师端路由
import AppLayout from '@/components/layout/AppLayout.vue'
import { getCommonChildren } from './common'

const teacherRoutes = [
  {
    path: '/teacher',
    component: AppLayout,
    redirect: '/teacher/index',
    meta: { roles: ['teacher'] },
    children: [
      {
        path: 'index',
        name: 'TeacherIndex',
        component: () => import('@/views/teacher/Index.vue'),
        meta: { title: '首页', roles: ['teacher'] }
      },
      // 授课管理
      {
        path: 'my-courses',
        name: 'TeacherMyCourses',
        component: () => import('@/views/teacher/MyCourses.vue'),
        meta: { title: '所授课程', roles: ['teacher'] }
      },
      {
        path: 'schedule',
        name: 'TeacherSchedule',
        component: () => import('@/views/teacher/MySchedule.vue'),
        meta: { title: '我的课表', roles: ['teacher'] }
      },
      {
        path: 'course-students',
        name: 'CourseStudents',
        component: () => import('@/views/teacher/CourseStudents.vue'),
        meta: { title: '学生名单', roles: ['teacher'] }
      },
      // 选课管理
      {
        path: 'selection-stats',
        name: 'SelectionStats',
        component: () => import('@/views/teacher/SelectionStats.vue'),
        meta: { title: '选课统计', roles: ['teacher'] }
      },
      // 成绩管理
      {
        path: 'score-entry',
        name: 'ScoreEntry',
        component: () => import('@/views/teacher/ScoreEntry.vue'),
        meta: { title: '成绩录入', roles: ['teacher'] }
      },
      {
        path: 'score-import',
        name: 'ScoreImport',
        component: () => import('@/views/teacher/ScoreImport.vue'),
        meta: { title: '批量导入', roles: ['teacher'] }
      },
      {
        path: 'score-stats',
        name: 'TeacherScoreStats',
        component: () => import('@/views/teacher/ScoreStats.vue'),
        meta: { title: '成绩统计', roles: ['teacher'] }
      },
      // 考勤管理
      {
        path: 'attendance',
        name: 'TeacherAttendance',
        component: () => import('@/views/teacher/Attendance.vue'),
        meta: { title: '课堂考勤', roles: ['teacher'] }
      },
      // 作业管理
      {
        path: 'homework',
        name: 'TeacherHomework',
        component: () => import('@/views/teacher/Homework.vue'),
        meta: { title: '作业批改', roles: ['teacher'] }
      },
      // 课程资料
      {
        path: 'materials',
        name: 'TeacherMaterials',
        component: () => import('@/views/teacher/Materials.vue'),
        meta: { title: '资料管理', roles: ['teacher'] }
      },
      // 公告管理
      {
        path: 'announcement',
        name: 'TeacherAnnouncement',
        component: () => import('@/views/teacher/Announcement.vue'),
        meta: { title: '发布公告', roles: ['teacher'] }
      },
      // 公共页面
      ...getCommonChildren()
    ]
  }
]

export default teacherRoutes
