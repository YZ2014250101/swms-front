// src/api/modules/common/announcement.js
// 公共公告接口：后端无统一公告接口，各端各自有列表/详情接口
// - 学生：3.3 公告 → /student/announcementList, /student/announcementDetail
// - 教师：4.3 公告管理 → /teacher/myAnnouncementList, /teacher/announcementDetail
// - 管理员：5.7 公告管理 → /admin/announcementList, /admin/toEditAnnouncement（管理员无独立 detail，复用 toEditAnnouncement 返回的 announcement 字段）
import request from '../../request'

/**
 * 按角色获取公告列表
 * @param {string} role student/teacher/admin
 */
export function getAnnouncementList(role) {
  const urlMap = {
    student: '/student/announcementList',
    teacher: '/teacher/myAnnouncementList',
    admin: '/admin/announcementList'
  }
  return request({
    url: urlMap[role],
    method: 'get'
  })
}

/**
 * 按角色获取公告详情
 * @param {string} role student/teacher/admin
 * @param {number|string} id 公告 id
 */
export function getAnnouncementDetail(role, id) {
  const urlMap = {
    student: '/student/announcementDetail',
    teacher: '/teacher/announcementDetail',
    // 管理员文档无独立 detail 接口，使用 toEditAnnouncement 返回 {announcement, ...}
    admin: '/admin/toEditAnnouncement'
  }
  return request({
    url: urlMap[role],
    method: 'get',
    params: { id }
  })
}
