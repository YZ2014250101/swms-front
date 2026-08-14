// src/api/modules/common/notice.js
// 消息通知接口：后端文档无消息通知接口，统一空实现
// 后端暂无消息通知接口
import request from '../../request'

// 后端暂无消息通知接口，返回空数据
export function getNoticeList() {
  // 后端暂无消息通知接口
  return Promise.resolve({ data: { list: [] } })
}

// 后端暂无消息通知接口
export function readNotice() {
  // 后端暂无消息通知接口
  return Promise.resolve({ data: { list: [] } })
}

// 后端暂无消息通知接口
export function clearNotice() {
  // 后端暂无消息通知接口
  return Promise.resolve({ data: { list: [] } })
}
