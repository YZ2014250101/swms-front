// src/api/modules/admin/announcement.js
// 管理员端公告管理接口（对应文档 5.7 公告管理 + 5.8 公告审核 + 5.9 公告分类管理）
import request from '../../request'

// ============== 公告管理（5.7）==============

/**
 * 公告列表
 * GET /admin/announcementList → { announcementList }
 */
export function getAnnouncementList() {
  return request({
    url: '/admin/announcementList',
    method: 'get'
  })
}

/**
 * 搜索公告
 * GET /admin/announcementSearch，params: { categoryId?, status?, keyword? } → { announcementList, categoryList, categoryId, status, keyword }
 * @param {object} params { categoryId, status, keyword }
 */
export function announcementSearch(params) {
  return request({
    url: '/admin/announcementSearch',
    method: 'get',
    params
  })
}

/**
 * 新增公告页数据
 * GET /admin/toAddAnnouncement → { categoryList, courseList }
 */
export function toAddAnnouncement() {
  return request({
    url: '/admin/toAddAnnouncement',
    method: 'get'
  })
}

/**
 * 发布公告（表单参数）
 * POST /admin/addAnnouncement，params: data(title, content, categoryId, ...) → { msg }
 * @param {object} data
 */
export function addAnnouncement(data) {
  return request({
    url: '/admin/addAnnouncement',
    method: 'post',
    params: data
  })
}

/**
 * 编辑回显
 * GET /admin/toEditAnnouncement，params: { id } → { announcement, categoryList, courseList }
 * @param {number|string} id
 */
export function toEditAnnouncement(id) {
  return request({
    url: '/admin/toEditAnnouncement',
    method: 'get',
    params: { id }
  })
}

/**
 * 修改公告（表单参数）
 * POST /admin/updateAnnouncement，params: data → { msg }
 * @param {object} data
 */
export function updateAnnouncement(data) {
  return request({
    url: '/admin/updateAnnouncement',
    method: 'post',
    params: data
  })
}

/**
 * 删除公告
 * GET /admin/deleteAnnouncement，params: { id } → { msg }
 * @param {number|string} id
 */
export function deleteAnnouncement(id) {
  return request({
    url: '/admin/deleteAnnouncement',
    method: 'get',
    params: { id }
  })
}

/**
 * 批量删除公告（数组参数）
 * POST /admin/batchDeleteAnnouncement，params: { ids(数组) } → { msg }
 * @param {Array} ids
 */
export function batchDeleteAnnouncement(ids) {
  return request({
    url: '/admin/batchDeleteAnnouncement',
    method: 'post',
    params: { ids }
  })
}

/**
 * 置顶
 * GET /admin/topAnnouncement，params: { id } → { msg }
 * @param {number|string} id
 */
export function topAnnouncement(id) {
  return request({
    url: '/admin/topAnnouncement',
    method: 'get',
    params: { id }
  })
}

/**
 * 取消置顶
 * GET /admin/cancelTopAnnouncement，params: { id } → { msg }
 * @param {number|string} id
 */
export function cancelTopAnnouncement(id) {
  return request({
    url: '/admin/cancelTopAnnouncement',
    method: 'get',
    params: { id }
  })
}

/**
 * 下架
 * GET /admin/offlineAnnouncement，params: { id } → { msg }
 * @param {number|string} id
 */
export function offlineAnnouncement(id) {
  return request({
    url: '/admin/offlineAnnouncement',
    method: 'get',
    params: { id }
  })
}

/**
 * 上架
 * GET /admin/onlineAnnouncement，params: { id } → { msg }
 * @param {number|string} id
 */
export function onlineAnnouncement(id) {
  return request({
    url: '/admin/onlineAnnouncement',
    method: 'get',
    params: { id }
  })
}

// ============== 公告审核（5.8）==============

/**
 * 待审核列表
 * GET /admin/announcementReviewList → { announcementList }
 */
export function getReviewList() {
  return request({
    url: '/admin/announcementReviewList',
    method: 'get'
  })
}

/**
 * 审核通过
 * GET /admin/approveAnnouncement，params: { id } → { msg }
 * @param {number|string} id
 */
export function approveAnnouncement(id) {
  return request({
    url: '/admin/approveAnnouncement',
    method: 'get',
    params: { id }
  })
}

/**
 * 驳回回显
 * GET /admin/toRejectAnnouncement，params: { id } → { announcement }
 * @param {number|string} id
 */
export function toRejectAnnouncement(id) {
  return request({
    url: '/admin/toRejectAnnouncement',
    method: 'get',
    params: { id }
  })
}

/**
 * 驳回公告（表单参数）
 * POST /admin/rejectAnnouncement，params: { id, rejectReason } → { msg }
 * @param {number|string} id
 * @param {string} rejectReason
 */
export function rejectAnnouncement(id, rejectReason) {
  return request({
    url: '/admin/rejectAnnouncement',
    method: 'post',
    params: { id, rejectReason }
  })
}

// ============== 公告分类管理（5.9）==============

/**
 * 分类列表
 * GET /admin/announcementCategoryList → { categoryList }
 */
export function getCategoryList() {
  return request({
    url: '/admin/announcementCategoryList',
    method: 'get'
  })
}

/**
 * 新增分类（表单参数）
 * POST /admin/addAnnouncementCategory，params: data → { msg }
 * @param {object} data
 */
export function addCategory(data) {
  return request({
    url: '/admin/addAnnouncementCategory',
    method: 'post',
    params: data
  })
}

/**
 * 分类编辑回显
 * GET /admin/toEditAnnouncementCategory，params: { id } → { category }
 * @param {number|string} id
 */
export function toEditCategory(id) {
  return request({
    url: '/admin/toEditAnnouncementCategory',
    method: 'get',
    params: { id }
  })
}

/**
 * 更新分类（表单参数）
 * POST /admin/updateAnnouncementCategory，params: data → { msg }
 * @param {object} data
 */
export function updateCategory(data) {
  return request({
    url: '/admin/updateAnnouncementCategory',
    method: 'post',
    params: data
  })
}

/**
 * 删除分类
 * GET /admin/deleteAnnouncementCategory，params: { id } → { msg }
 * @param {number|string} id
 */
export function deleteCategory(id) {
  return request({
    url: '/admin/deleteAnnouncementCategory',
    method: 'get',
    params: { id }
  })
}

/**
 * 切换分类状态
 * GET /admin/toggleAnnouncementCategoryStatus，params: { id } → { msg }
 * @param {number|string} id
 */
export function toggleCategoryStatus(id) {
  return request({
    url: '/admin/toggleAnnouncementCategoryStatus',
    method: 'get',
    params: { id }
  })
}
