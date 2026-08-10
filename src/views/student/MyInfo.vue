<!-- src/views/MyInfo.vue -->
<template>
  <div class="container">
    <h2>👤 个人信息</h2>

    <!-- 加载中提示 -->
    <div v-if="loading" class="loading">正在加载个人信息...</div>
    <!-- 错误提示 -->
    <div v-else-if="errorMsg" class="error">{{ errorMsg }}</div>
    <!-- 正常渲染信息 -->
    <div v-else>
      <div class="info-item">学号：{{ student.studentId }}</div>
      <div class="info-item">姓名：{{ student.name }}</div>
      <div class="info-item">性别：{{ student.gender }}</div>
      <div class="info-item">专业：{{ student.major }}</div>
    </div>
  </div>
</template>

<script setup>
// 引入Vue响应式API
import { ref, onMounted } from 'vue'
// 引入axios（需提前安装：npm install axios）
import axios from 'axios'

// 1. 定义响应式数据
// 学生信息初始空对象
const student = ref({
  studentId: '',
  name: '',
  gender: '',
  major: ''
})
// 加载状态
const loading = ref(false)
// 错误信息
const errorMsg = ref('')

// 2. 封装获取个人信息的接口函数
const getStudentInfo = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    // 后端接口地址，替换为你的真实接口
    // 示例：GET /api/student/getMyInfo，请求头携带token鉴权
    const res = await axios.get('/api/student/myInfo', {
      headers: {
        // 从本地存储取出登录时保存的token
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    // 判断后端返回成功（按照你的Result统一返回格式 code=200）
    if (res.data.code === 200) {
      // 赋值给响应式变量
      student.value = res.data.data
    } else {
      // 后端业务异常提示
      errorMsg.value = res.data.msg || '获取个人信息失败'
    }
  } catch (err) {
    // 网络/服务器报错捕获
    console.error('请求个人信息接口异常：', err)
    errorMsg.value = '服务器请求异常，请稍后重试'
  } finally {
    // 无论成功失败，关闭加载状态
    loading.value = false
  }
}

// 3. 页面挂载完成自动调用接口
onMounted(() => {
  getStudentInfo()
})
</script>

<style scoped>
.container {
  width: 600px;
  margin: 30px auto;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

h2 {
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-top: 0;
  color: #333;
}

.info-item {
  font-size: 16px;
  line-height: 2.2;
  color: #444;
}

.loading {
  color: #666;
  padding: 20px 0;
}

.error {
  color: #f56c6c;
  padding: 20px 0;
}
</style>