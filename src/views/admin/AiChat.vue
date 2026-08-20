<template>
  <div class="ai-chat">
    <!-- 左侧：会话列表 -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <el-button type="primary" class="new-btn" @click="newSession">+ 新建对话</el-button>
      </div>
      <div class="session-list">
        <div
          v-for="s in sessions"
          :key="s.session_id"
          class="session-item"
          :class="{ active: s.session_id === currentSessionId }"
          @click="selectSession(s.session_id)"
        >
          <div class="session-title">{{ s.title || '新对话' }}</div>
          <div class="session-time">{{ s.update_time || s.create_time }}</div>
        </div>
        <div v-if="!sessions.length" class="empty-tip">暂无历史对话</div>
      </div>
    </aside>

    <!-- 右侧：对话窗口 -->
    <main class="chat">
      <header class="chat-header">
        <div class="chat-title">
          {{ currentSessionTitle || '新对话' }}
        </div>
      </header>

      <div class="chat-body" ref="chatBodyRef">
        <div v-if="loadingHistory" class="loading-tip">加载历史消息中...</div>
        <template v-else>
          <div
            v-for="(m, i) in chatList"
            :key="i"
            class="msg-row"
            :class="m.role"
          >
            <div class="msg-avatar">{{ avatarText(m.role) }}</div>
            <div class="msg-content">
              <div v-if="m.role === 'tool'" class="tool-bubble">{{ m.content }}</div>
              <div v-else class="bubble">{{ m.content || (m.role === 'ai' ? '...' : '') }}</div>
            </div>
          </div>
        </template>
      </div>

      <footer class="chat-footer">
        <el-input
          v-model="dialogMessage"
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 4 }"
          placeholder="输入问题，Enter 发送，Shift+Enter 换行"
          @keydown.enter="onEnter"
          :disabled="loading"
          resize="none"
        />
        <el-button type="primary" :loading="loading" @click="sendDialog">
          {{ loading ? '回复中' : '发送' }}
        </el-button>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { getAiSessions, getAiMessages, streamAiChat } from '@/api/modules/common/ai'

// ============ 状态 ============
const sessions = ref([])              // 左侧会话列表
const currentSessionId = ref('')     // 当前选中 session_id
const chatList = ref([])             // 右侧消息列表 [{role:'user'|'ai'|'tool', content}]
const dialogMessage = ref('')        // 输入框
const loading = ref(false)           // 正在等 AI 回复
const loadingHistory = ref(false)    // 正在加载历史
const chatBodyRef = ref(null)

const currentSessionTitle = computed(() => {
  const s = sessions.value.find(x => x.session_id === currentSessionId.value)
  return s ? s.title : ''
})

// ============ 工具函数 ============
function avatarText(role) {
  return { user: '我', ai: 'AI', assistant: 'AI', tool: '🔧', system: '⚙' }[role] || '?'
}

/**
 * 滚动聊天容器到底部
 * await nextTick 确保DOM渲染完成后再执行滚动
 */
async function scrollToBottom() {
  await nextTick()
  const el = chatBodyRef.value
  if (el) {
    el.scrollTop = el.scrollHeight
  }
}

// DB 历史返回的 role：system/user/assistant/tool
// 前端 chatList 用的 role：user/ai/tool（system 不展示）
function mapDbRole(r) {
  if (r === 'assistant') return 'ai'
  if (r === 'system') return null  // 系统提示词不在对话里显示
  return r
}

// ============ 会话列表 ============
async function loadSessions() {
  try {
    const res = await getAiSessions()
    sessions.value = res.data || []
    // 如果当前未选会话且有历史，默认选第一个
    if (sessions.value.length && !currentSessionId.value) {
      await selectSession(sessions.value[0].session_id)
    }
  } catch (e) {
    console.error('loadSessions error', e)
  }
}

async function selectSession(sid) {
  if (loading.value) {
    ElMessage.warning('正在回复中，请稍候')
    return
  }
  currentSessionId.value = sid
  await loadHistory(sid)
  // 加载历史完成，滚动到底部
  await scrollToBottom()
}

async function loadHistory(sid) {
  loadingHistory.value = true
  try {
    const res = await getAiMessages(sid)
    const list = res.data || []
    chatList.value = list
      .map(m => {
        const role = mapDbRole(m.role)
        if (!role) return null
        // tool 消息内容是 JSON 字符串，转成可读提示
        if (role === 'tool') {
          let parsed = m.content
          try { parsed = JSON.stringify(JSON.parse(m.content), null, 2) } catch (_) {}
          return { role: 'tool', content: `🔧 工具结果：\n${parsed}` }
        }
        return { role, content: m.content || '' }
      })
      .filter(Boolean)

  } catch (e) {
    console.error('loadHistory error', e)
  } finally {
    loadingHistory.value = false
  }
}

function newSession() {
  if (loading.value) {
    ElMessage.warning('正在回复中，请稍候')
    return
  }
  currentSessionId.value = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)
  chatList.value = []
  dialogMessage.value = ''
}

// ============ 发送消息 + SSE 流式 ============
async function sendDialog() {
  const msg = dialogMessage.value.trim()
  if (!msg || loading.value) return
  if (!currentSessionId.value) newSession()

  chatList.value.push({ role: 'user', content: msg })
  dialogMessage.value = ''

  // AI 占位空消息，后面边收边追加
  const aiItem = reactive({ role: 'ai', content: '' })
  chatList.value.push(aiItem)
  loading.value = true
  await scrollToBottom()

  try {
    await streamAiChat(
      { session_id: currentSessionId.value, user_input: msg },
      {
        onAnswer: (chunk) => {
          aiItem.content += chunk
          scrollToBottom()
        },
        onToolCall: ({ name, args }) => {
          chatList.value.push({
            role: 'tool',
            content: `🔧 调用工具：${name}，参数：${JSON.stringify(args)}`
          })
          scrollToBottom()
        },
        onError: ({ code, msg }) => {
          aiItem.content += `\n[错误 ${code || ''}] ${msg || ''}`
          ElMessage.error(msg || '请求失败')
        },
        onDone: () => { /* 正常结束 */ }
      }
    )
  } catch (err) {
    console.error('sse请求异常：', err)
    if (!aiItem.content) aiItem.content = 'AI请求失败，请稍后重试'
    else aiItem.content += '\n\n[请求中断]'
  } finally {
    loading.value = false
    // 只刷新左侧会话列表，**不要重新loadHistory**，避免聊天内容闪烁
    await loadSessions()
  }
}

function onEnter(e) {
  if (e.shiftKey) return  // Shift+Enter 换行，默认行为
  e.preventDefault()
  sendDialog()
}

onMounted(() => {
  loadSessions()
})
</script>

<style scoped>
.ai-chat {
  display: flex;
  height: calc(100vh - 90px);
  min-height: 500px;
  background: #fff;
  border: 1px solid #e9e9e9;
  border-radius: 8px;
  overflow: hidden;
}

/* ============ 左侧 ============ */
.sidebar {
  width: 260px;
  flex-shrink: 0;
  background: #fafafa;
  border-right: 1px solid #e9e9e9;
  display: flex;
  flex-direction: column;
}
.sidebar-header { padding: 12px; }
.new-btn { width: 100%; }

.session-list { flex: 1; overflow-y: auto; padding: 0 8px; }
.session-item {
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 4px;
}
.session-item:hover { background: #efefef; }
.session-item.active { background: #e3eefd; }
.session-title {
  font-size: 14px;
  color: #1f1f1f;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.session-time { font-size: 12px; color: #999; margin-top: 2px; }
.empty-tip { padding: 20px 12px; color: #aaa; font-size: 13px; text-align: center; }

/* ============ 右侧 ============ */
.chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
}
.chat-header {
  height: 52px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  padding: 0 20px;
}
.chat-title { font-size: 15px; font-weight: 600; color: #333; }

.chat-body { flex: 1; overflow-y: auto; padding: 20px; }
.loading-tip { color: #aaa; text-align: center; padding: 20px; }

.msg-row {
  display: flex;
  margin-bottom: 16px;
  gap: 10px;
}
.msg-row.user { flex-direction: row-reverse; }
.msg-avatar {
  width: 32px; height: 32px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #1a89ea;
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px;
}
.msg-row.ai .msg-avatar { background: #2eb872; }
.msg-row.tool .msg-avatar { background: #f5a623; }

.msg-content { max-width: 75%; }
.msg-row.user .msg-content { display: flex; flex-direction: row-reverse; }

.bubble {
  padding: 10px 14px;
  border-radius: 12px;
  background: #f1f1f1;
  color: #1f1f1f;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}
.msg-row.user .bubble { background: #1a89ea; color: #fff; }

.tool-bubble {
  padding: 8px 12px;
  background: #fff8e1;
  border: 1px dashed #f5a623;
  border-radius: 8px;
  font-size: 12px;
  color: #8a6d3b;
  white-space: pre-wrap;
  word-break: break-word;
}

.chat-footer {
  border-top: 1px solid #eee;
  padding: 12px 16px;
  display: flex;
  gap: 10px;
  align-items: flex-end;
}
.chat-footer :deep(.el-textarea__inner) {
  min-height: 38px !important;
}
</style>
