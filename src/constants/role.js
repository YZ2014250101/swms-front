// src/constants/role.js
// 角色枚举定义，避免代码中出现魔法字符串

export const ROLE = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin'
}

// 角色中文映射
export const ROLE_LABEL = {
  [ROLE.STUDENT]: '学生',
  [ROLE.TEACHER]: '教师',
  [ROLE.ADMIN]: '管理员'
}

// 角色 -> 默认首页路径
export const ROLE_HOME = {
  [ROLE.STUDENT]: '/student',
  [ROLE.TEACHER]: '/teacher',
  [ROLE.ADMIN]: '/admin'
}
