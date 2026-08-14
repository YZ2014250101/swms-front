// src/api/modules/admin/announcement.js
// 管理员端公告接口
import request from '../../request'

// 获取公告列表
export function getAnnouncementList(params) {
  return request({
    url: '/admin/announcement/list',
    method: 'get',
    params
  })
}

// 新增公告
export function addAnnouncement(data) {
  return request({
    url: '/admin/announcement',
    method: 'post',
    data
  })
}

// 更新公告
export function updateAnnouncement(data) {
  return request({
    url: '/admin/announcement',
    method: 'put',
    data
  })
}

// 删除公告
export function deleteAnnouncement(id) {
  return request({
    url: `/admin/announcement/${id}`,
    method: 'delete'
  })
}

// 置顶公告
export function topAnnouncement(id) {
  return request({
    url: `/admin/announcement/${id}/top`,
    method: 'put'
  })
}
