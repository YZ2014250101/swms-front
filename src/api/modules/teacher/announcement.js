// src/api/modules/teacher/announcement.js
// 教师端公告接口
import request from '../../request'

// 发布公告
export function publishAnnouncement(data) {
  return request({
    url: '/teacher/announcement',
    method: 'post',
    data
  })
}

// 获取公告列表
export function getAnnouncementList(params) {
  return request({
    url: '/teacher/announcement/list',
    method: 'get',
    params
  })
}

// 更新公告
export function updateAnnouncement(data) {
  return request({
    url: '/teacher/announcement',
    method: 'put',
    data
  })
}

// 删除公告
export function deleteAnnouncement(id) {
  return request({
    url: `/teacher/announcement/${id}`,
    method: 'delete'
  })
}

// 置顶公告
export function topAnnouncement(id) {
  return request({
    url: `/teacher/announcement/${id}/top`,
    method: 'put'
  })
}
