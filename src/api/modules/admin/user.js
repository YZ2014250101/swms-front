// src/api/modules/admin/user.js
// 管理员端用户管理接口：学生管理（5.2）+ 教师管理（5.3）+ 管理员账号管理（文档无，空实现）
import request from '../../request'

// ============== 学生管理（5.2）==============

/**
 * 全部学生列表
 * GET /admin/studentList → { studentList }
 */
export function getStudentList() {
  return request({
    url: '/admin/studentList',
    method: 'get'
  })
}

/**
 * 新增学生（表单参数）
 * POST /admin/addStudent，params: data(Student 表单) → { msg }
 * @param {object} data
 */
export function addStudent(data) {
  return request({
    url: '/admin/addStudent',
    method: 'post',
    params: data
  })
}

/**
 * 学生编辑回显
 * GET /admin/toEdit，params: { id } → { stu }
 * @param {number|string} id
 */
export function toEditStudent(id) {
  return request({
    url: '/admin/toEdit',
    method: 'get',
    params: { id }
  })
}

/**
 * 更新学生（表单参数）
 * POST /admin/update，params: data → { msg }
 * @param {object} data
 */
export function updateStudent(data) {
  return request({
    url: '/admin/update',
    method: 'post',
    params: data
  })
}

/**
 * 启用/禁用学生
 * GET /admin/updateStuStatus，params: { id, status } → { msg }
 * @param {number|string} id
 * @param {number|string} status
 */
export function updateStuStatus(id, status) {
  return request({
    url: '/admin/updateStuStatus',
    method: 'get',
    params: { id, status }
  })
}

/**
 * 重置学生密码
 * GET /admin/resetStuPwd，params: { id } → { msg }
 * @param {number|string} id
 */
export function resetStuPwd(id) {
  return request({
    url: '/admin/resetStuPwd',
    method: 'get',
    params: { id }
  })
}

/**
 * 删除学生
 * GET /admin/delete，params: { id } → { msg }
 * @param {number|string} id
 */
export function deleteStudent(id) {
  return request({
    url: '/admin/delete',
    method: 'get',
    params: { id }
  })
}

/**
 * 批量导入学生（文件上传 multipart/form-data）
 * POST /admin/importStudent，data: FormData(file) → { msg }
 * @param {FormData} formData
 */
export function importStudent(formData) {
  return request({
    url: '/admin/importStudent',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// ============== 教师管理（5.3）==============

/**
 * 全部教师列表
 * GET /admin/teacherList → { teacherList }
 */
export function getTeacherList() {
  return request({
    url: '/admin/teacherList',
    method: 'get'
  })
}

/**
 * 新增教师（表单参数）
 * POST /admin/addTeacher，params: data(teacherId, username, password, name, age, gender, department, title) → { msg }
 * @param {object} data
 */
export function addTeacher(data) {
  return request({
    url: '/admin/addTeacher',
    method: 'post',
    params: data
  })
}

/**
 * 教师编辑回显
 * GET /admin/toEditTea，params: { id } → { tea }
 * @param {number|string} id
 */
export function toEditTeacher(id) {
  return request({
    url: '/admin/toEditTea',
    method: 'get',
    params: { id }
  })
}

/**
 * 更新教师（表单参数）
 * POST /admin/updateTea，params: data → { msg }
 * @param {object} data
 */
export function updateTeacher(data) {
  return request({
    url: '/admin/updateTea',
    method: 'post',
    params: data
  })
}

/**
 * 启用/禁用教师
 * GET /admin/updateTeaStatus，params: { id, status } → { msg }
 * @param {number|string} id
 * @param {number|string} status
 */
export function updateTeaStatus(id, status) {
  return request({
    url: '/admin/updateTeaStatus',
    method: 'get',
    params: { id, status }
  })
}

/**
 * 重置教师密码
 * GET /admin/resetTeaPwd，params: { id } → { msg }
 * @param {number|string} id
 */
export function resetTeaPwd(id) {
  return request({
    url: '/admin/resetTeaPwd',
    method: 'get',
    params: { id }
  })
}

// ============== 管理员账号管理（后端无此接口，空实现）==============

// 后端无管理员账号管理接口
export function getAdminList() {
  // 后端无管理员账号管理接口
  return Promise.resolve({ data: { adminList: [] } })
}

// 后端无管理员账号管理接口
export function addAdmin() {
  // 后端无管理员账号管理接口
  return Promise.resolve({ data: {} })
}

// 后端无管理员账号管理接口
export function updateAdmin() {
  // 后端无管理员账号管理接口
  return Promise.resolve({ data: {} })
}

// 后端无管理员账号管理接口
export function deleteAdmin() {
  // 后端无管理员账号管理接口
  return Promise.resolve({ data: {} })
}
