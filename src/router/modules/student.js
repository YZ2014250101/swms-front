// src/router/modules/student.js
// 学生端路由
import AppLayout from '@/components/layout/AppLayout.vue'
import { getCommonChildren } from './common'

const studentRoutes = [
  {
    path: '/student',
    component: AppLayout,
    redirect: '/student/index',
    meta: { roles: ['student'] },
    children: [
      {
        path: 'index',
        name: 'StudentIndex',
        component: () => import('@/views/student/Index.vue'),
        meta: { title: '首页', roles: ['student'] }
      },
      // 个人信息（对接后端 /student/myInfo）
      {
        path: 'my-info',
        name: 'StudentMyInfo',
        component: () => import('@/views/student/MyInfo.vue'),
        meta: { title: '个人信息', roles: ['student'] }
      },
      // 选课管理
      {
        path: 'course-select',
        name: 'CourseSelect',
        component: () => import('@/views/student/CourseSelect.vue'),
        meta: { title: '可选课程', roles: ['student'] }
      },
      {
        path: 'my-courses',
        name: 'StudentMyCourses',
        component: () => import('@/views/student/MyCourses.vue'),
        meta: { title: '我的课程', roles: ['student'] }
      },
      // 课程学习
      {
        path: 'schedule',
        name: 'StudentSchedule',
        component: () => import('@/views/student/MySchedule.vue'),
        meta: { title: '我的课表', roles: ['student'] }
      },
      {
        path: 'course-detail/:id',
        name: 'StudentCourseDetail',
        component: () => import('@/views/student/CourseDetail.vue'),
        meta: { title: '课程详情', roles: ['student'], hidden: true }
      },
      {
        path: 'materials',
        name: 'StudentMaterials',
        component: () => import('@/views/student/Materials.vue'),
        meta: { title: '课程资料', roles: ['student'] }
      },
      // 成绩管理
      {
        path: 'score',
        name: 'StudentScore',
        component: () => import('@/views/student/ScoreQuery.vue'),
        meta: { title: '成绩查询', roles: ['student'] }
      },
      {
        path: 'gpa',
        name: 'StudentGpa',
        component: () => import('@/views/student/ScoreGpa.vue'),
        meta: { title: '绩点GPA', roles: ['student'] }
      },
      {
        path: 'score-appeal',
        name: 'ScoreAppeal',
        component: () => import('@/views/student/ScoreAppeal.vue'),
        meta: { title: '成绩申诉', roles: ['student'] }
      },
      // 考勤管理
      {
        path: 'attendance',
        name: 'StudentAttendance',
        component: () => import('@/views/student/Attendance.vue'),
        meta: { title: '考勤记录', roles: ['student'] }
      },
      // 作业管理
      {
        path: 'homework',
        name: 'StudentHomework',
        component: () => import('@/views/student/Homework.vue'),
        meta: { title: '我的作业', roles: ['student'] }
      },
      // 考试管理
      {
        path: 'exam',
        name: 'StudentExam',
        component: () => import('@/views/student/Exam.vue'),
        meta: { title: '考试安排', roles: ['student'] }
      },
      // 公共页面
      ...getCommonChildren()
    ]
  }
]

export default studentRoutes
