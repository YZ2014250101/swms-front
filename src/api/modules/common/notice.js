// src/api/modules/common/notice.js
// 公共消息通知接口
import request from '../../request'

// 消息通知列表
export function getNoticeList(params) {
  return request({
    url: '/common/notice/list',
    method: 'get',
    params
  })
}

// 标记消息已读
export function readNotice(id) {
  return request({
    url: `/common/notice/${id}/read`,
    method: 'put'
  })
}

// 清空消息
export function clearNotice() {
  return request({
    url: '/common/notice/clear',
    method: 'delete'
  })
}
