// src/api/modules/student/schedule.js
// 学生端课表接口（对应文档 3.8 课表）
import request from '../../request'

/**
 * 获取个人课表
 * GET /student/mySchedule，params: { week(可选) }
 * 返回 { sectionTimeMap, scheduleMap, validWeeks, currentWeek, autoSwitched, hasSchedules, weekScheduleCount, maxWeek, selectedCourses }
 * @param {object} params { week }
 */
export function getStudentSchedule(params) {
  return request({
    url: '/student/mySchedule',
    method: 'get',
    params
  })
}
