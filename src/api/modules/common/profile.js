// src/api/modules/common/profile.js
// 公共个人信息接口：按角色路由到各端 myInfo
// 学生 GET /student/myInfo → {studentId, name, gender, major}
// 教师 GET /teacher/myInfo → {name, teacherId, department, title}
// 管理员 GET /admin/myInfo → {name, adminId, ...}
import request from '../../request'

const INFO_URL = {
  student: '/student/myInfo',
  teacher: '/teacher/myInfo',
  admin: '/admin/myInfo'
}

// 获取当前角色个人信息
export function getMyInfo(role) {
  return request({
    url: INFO_URL[role],
    method: 'get'
  })
}
