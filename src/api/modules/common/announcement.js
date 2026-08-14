// src/api/modules/common/announcement.js
// 公共公告接口
import request from '../../request'

// 公告列表
export function getAnnouncementList(params) {
  return request({
    url: '/common/announcement/list',
    method: 'get',
    params
  })
}

// 公告详情
export function getAnnouncementDetail(id) {
  return request({
    url: `/common/announcement/${id}`,
    method: 'get'
  })
}
