// src/api/modules/teacher/announcement.js
// 教师端公告管理接口（对应文档 4.3 公告管理）
import request from '../../request'

/**
 * 我发布的公告
 * GET /teacher/myAnnouncementList → { announcementList }
 */
export function getMyAnnouncementList() {
  return request({
    url: '/teacher/myAnnouncementList',
    method: 'get'
  })
}

/**
 * 发布公告（表单参数）
 * POST /teacher/addAnnouncement，params: data(title, content, courseId, ...) → { msg }
 * @param {object} data
 */
export function addAnnouncement(data) {
  return request({
    url: '/teacher/addAnnouncement',
    method: 'post',
    params: data
  })
}

/**
 * 修改公告（表单参数）
 * POST /teacher/updateAnnouncement，params: data(id, title, content, ...) → { msg }
 * @param {object} data
 */
export function updateAnnouncement(data) {
  return request({
    url: '/teacher/updateAnnouncement',
    method: 'post',
    params: data
  })
}

/**
 * 删除公告
 * GET /teacher/deleteAnnouncement，params: { id } → { msg }
 * @param {number|string} id
 */
export function deleteAnnouncement(id) {
  return request({
    url: '/teacher/deleteAnnouncement',
    method: 'get',
    params: { id }
  })
}

/**
 * 公告详情
 * GET /teacher/announcementDetail，params: { id } → { announcement }
 * @param {number|string} id
 */
export function getAnnouncementDetail(id) {
  return request({
    url: '/teacher/announcementDetail',
    method: 'get',
    params: { id }
  })
}
