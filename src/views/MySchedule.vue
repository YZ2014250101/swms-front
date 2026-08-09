<!-- src/views/MySchedule.vue -->
<template>
  <div class="container">
    <h2>📅 我的课表</h2>
    <table border="1" cellpadding="8" cellspacing="0" width="100%">
      <thead>
        <tr>
          <th>课程名称</th>
          <th>上课教室</th>
          <th>星期</th>
          <th>节次</th>
        </tr>
      </thead>
      <tbody>
        <!-- v-for 循环渲染列表，等同于Thymeleaf th:each -->
        <tr v-for="item in courseList" :key="item.id">
          <td>{{ item.courseName }}</td>
          <td>{{ item.classroom }}</td>
          <td>{{ item.weekDay }}</td>
          <td>{{ item.section }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// 模拟后端返回的数组
const courseList = ref([
  { id: 1, courseName: '高等数学', classroom: '教学楼A201', weekDay: '周一', section: '1-2节' },
  { id: 2, courseName: 'Java程序设计', classroom: '实验楼B302', weekDay: '周三', section: '3-4节' },
  { id: 3, courseName: '计算机网络', classroom: '教学楼A405', weekDay: '周五', section: '5-6节' }
])
</script>

<style scoped>
.container {
  width: 800px;
  margin: 30px auto;
}
</style>