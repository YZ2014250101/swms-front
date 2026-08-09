<!-- src/views/MyInfo.vue -->
<template>
  <div class="container">
    <h2>👤 个人信息</h2>
    <div class="info-item">学号：{{ student.studentId }}</div>
    <div class="info-item">姓名：{{ student.name }}</div>
    <div class="info-item">性别：{{ student.gender }}</div>
    <div class="info-item">专业：{{ student.major }}</div>
  </div>
</template>

<script setup>
// 先写死模拟数据，后面替换成后端接口
import { ref } from 'vue'
const student = ref({
  studentId: '2025334149',
  name: '小明',
  gender: '男',
  major: '软件工程'
})
</script>

<style scoped>
.container {
  width: 600px;
  margin: 30px auto;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}
.info-item {
  font-size: 16px;
  line-height: 2.2;
}
</style>