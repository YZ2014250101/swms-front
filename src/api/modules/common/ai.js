// src/api/modules/common/ai.js
// AI 对话相关接口封装
//   - askAi：同步问一答（旧 SpringBoot 接口，保留向后兼容）
//   - getAiSessions / getAiMessages：会话列表与历史（调用Python FastAPI，使用fetch）
//   - streamAiChat：SSE 流式对话（fetch + ReadableStream，不能走 axios）
import request from '../../request'
import { getToken } from '@/utils/auth'

/**
 * 同步问一答（旧接口 SpringBoot）
 * POST /admin/ai/ask，data: { message }
 */
export function askAi(message) {
  return request({
    url: '/admin/ai/ask',
    method: 'post',
    data: { message }
  })
}

/**
 * 获取当前登录用户的全部会话列表（按最近更新倒序）
 * GET /pyapi/agent/sessions → vite代理转发到FastAPI:8000 /api/agent/sessions
 * 返回：{ code, data: [{ session_id, title, create_time, update_time }] }
 */
export async function getAiSessions() {
  const token = getToken() || ''
  const res = await fetch('/pyapi/agent/sessions', {
    method: 'GET',
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} 获取会话列表失败`)
  }
  return await res.json()
}

/**
 * 获取某会话全部历史消息（按 seq 正序）
 * GET /pyapi/agent/messages?session_id=xxx
 * 返回：{ code, data: [{ role, content, tool_calls, tool_call_id, seq }] }
 */
export async function getAiMessages(sessionId) {
  const token = getToken() || ''
  const url = new URL('/pyapi/agent/messages', location.origin)
  url.searchParams.set('session_id', sessionId)

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} 获取历史消息失败`)
  }
  return await res.json()
}

/**
 * SSE 流式对话
 * POST /pyapi/agent/chat（直接 fetch，不走 axios；axios 不支持流式读取）
 *
 * @param {Object} payload - { session_id, user_input }
 * @param {Object} cbs - 回调集合
 *   - onAnswer(chunk): 收到文本分片
 *   - onToolCall({name, args}): 收到工具调用通知
 *   - onError({code, msg}): 错误事件
 *   - onDone(): 本轮对话正常结束
 * @param {Object} options - { signal } 用于取消
 */
export async function streamAiChat(payload, cbs = {}, options = {}) {
  const token = getToken() || ''
  const res = await fetch('/pyapi/agent/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify(payload),
    signal: options.signal
  })

  // 非 2xx 直接抛错
  if (!res.ok) {
    let errMsg = `请求失败（HTTP ${res.status}）`
    try {
      const errData = await res.json()
      errMsg = errData.msg || errData.message || errMsg
    } catch (_) {}
    throw new Error(errMsg)
  }
  if (!res.body) throw new Error('服务异常，无数据流')

  // 解析单个 SSE 事件块
  const handleEvent = (part) => {
    if (!part.trim()) return
    let eventName = ''
    let dataStr = ''
    const lines = part.split('\n')
    for (const line of lines) {
      if (line.startsWith('event:')) {
        eventName = line.slice(6).trim()
      } else if (line.startsWith('data:')) {
        dataStr = dataStr ? `${dataStr}\n${line.slice(5).trim()}` : line.slice(5).trim()
      }
    }
    if (!dataStr) return
    let data
    try { data = JSON.parse(dataStr) } catch (_) { return }
    switch (eventName) {
      case 'answer':    cbs.onAnswer?.(data.chunk || ''); break
      case 'tool_call': cbs.onToolCall?.({ name: data.name, args: data.args }); break
      case 'error':     cbs.onError?.({ code: data.code, msg: data.msg }); break
      case 'done':      cbs.onDone?.(); break
    }
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const chunks = buffer.split('\n\n')
    buffer = chunks.pop() || ''
    for (const part of chunks) handleEvent(part)
  }
  buffer += decoder.decode()
  if (buffer.trim()) handleEvent(buffer)
}