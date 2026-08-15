<template>
  <div style="width:600px;margin:20px;">
    <h1>AI对话框</h1>

    <!-- 🔴对话消息列表区域 -->
    <div style="border:1px solid #ccc;padding:12px;height:400px;overflow-y:auto;margin-bottom:16px;border-radius:6px;">
      <!-- 循环渲染全部对话记录 -->
      <div v-for="item in chatList" :key="item.id" style="margin:8px 0;">
        <!-- 用户消息 -->
        <div v-if="item.role === 'user'" style="text-align:right;">
          <span style="background:#409eff;color:white;padding:8px 12px;border-radius:8px;display:inline-block;max-width:80%;white-space:pre-wrap;">
            {{ item.content }}
          </span>
        </div>
        <!-- AI回复消息 -->
        <div v-if="item.role === 'ai'" style="text-align:left;">
          <span style="background:#f5f7fa;color:#333;padding:8px 12px;border-radius:8px;display:inline-block;max-width:80%;white-space:pre-wrap;">
            {{ item.content }}
          </span>
        </div>
      </div>
    </div>

    <!-- 输入框 -->
    <el-input
        v-model="dialogMessage"
        placeholder="请输入消息"
        clearable
        @keyup.enter="sendDialog"
    ></el-input>

    <div style="margin-top:12px;gap:10px;display:flex;">
      <el-button type="primary" @click="sendDialog">发送</el-button>
      <el-button type="warning" @click="clearDialog">清空对话</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { askAi } from '@/api/modules/common/ai'

// 输入框绑定的文本
const dialogMessage = ref('')
// 📌对话历史数组，存放用户和AI消息
const chatList = ref([])

/**
 * 发送消息
 */
const sendDialog = async () => {
  const msg = dialogMessage.value.trim()
  if (!msg) return

  // 1.先把用户消息推入聊天列表
  chatList.value.push({
    id: Date.now(), // 使用时间戳作为唯一id
    role: 'user',
    content: msg
  })

  // 清空输入框
  dialogMessage.value = ''

  try {
    // 请求后端接口，传用户输入的文本
    const res = await askAi(msg)
    if (res.code === 200) {
      // 2.拿到AI返回的回答，追加到消息列表
      chatList.value.push({
        id: Date.now() + 1,
        role: 'ai',
        content: res.data // 后端Result<String>，data就是AI回答文本
      })
    }
  } catch (e) {
    // 请求异常，写入错误提示到聊天框
    chatList.value.push({
      id: Date.now() + 2,
      role: 'ai',
      content: 'AI请求失败，请稍后重试'
    })
    console.error(e)
  }
}

/**
 * 清空全部对话
 */
const clearDialog = () => {
  chatList.value = []
  dialogMessage.value = ''
}

</script>