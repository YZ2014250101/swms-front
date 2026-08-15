// src/api/modules/common/ai.js 
import request from '../../request'

/**
 * 与AI对话
 * POST /ai/ask，params: { message } → { message }
 * @param {string} message
 */
export function askAi(message) {
  return request({
    url: '/admin/ai/ask',
    method: 'post',
    data: { message }
  })
}
