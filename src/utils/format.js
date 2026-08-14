// src/utils/format.js
// 通用格式化工具函数

/**
 * 格式化日期：2025-01-01 12:00:00
 * @param {string|number|Date} value
 * @param {string} fmt 默认 YYYY-MM-DD HH:mm:ss
 */
export function formatDateTime(value, fmt = 'YYYY-MM-DD HH:mm:ss') {
  if (!value) return ''
  const date = new Date(value)
  if (isNaN(date.getTime())) return ''
  const map = {
    YYYY: date.getFullYear(),
    MM: String(date.getMonth() + 1).padStart(2, '0'),
    DD: String(date.getDate()).padStart(2, '0'),
    HH: String(date.getHours()).padStart(2, '0'),
    mm: String(date.getMinutes()).padStart(2, '0'),
    ss: String(date.getSeconds()).padStart(2, '0')
  }
  return fmt.replace(/YYYY|MM|DD|HH|mm|ss/g, (m) => map[m])
}

// 格式化日期：2025-01-01
export function formatDate(value) {
  return formatDateTime(value, 'YYYY-MM-DD')
}

/**
 * 性别格式化
 * @param {number|string} gender 1/男 2/女
 */
export function formatGender(gender) {
  const map = { 1: '男', 2: '女', 男: '男', 女: '女' }
  return map[gender] || '未知'
}

/**
 * 通用状态格式化
 * @param {number|string} status
 * @param {object} mapping { 0: '禁用', 1: '正常' }
 */
export function formatStatus(status, mapping) {
  return mapping[status] ?? status
}
