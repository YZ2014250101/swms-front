<template>
  <div class="schedule-wrap">
    <h2>📅 我的本周课表</h2>

    <!-- 周次切换下拉框 -->
    <div class="week-select">
      <span>选择周次：</span>
      <select v-model="queryWeek" @change="getScheduleData">
        <option v-for="w in validWeeks" :key="w" :value="w">第{{ w }}周</option>
      </select>
      <span class="tip">当前第{{ currentWeek }}周</span>
    </div>

    <!-- 加载提示 -->
    <div v-if="loading" class="loading">数据加载中...</div>
    <div v-if="!hasSchedules && !loading" class="empty">本周暂无课程安排</div>

    <!-- 课表主表格 7天 × 11节次 -->
    <table v-if="hasSchedules" class="schedule-table" border="1" cellpadding="6" cellspacing="0">
      <thead>
        <tr>
          <th>节次</th>
          <th>周一</th>
          <th>周二</th>
          <th>周三</th>
          <th>周四</th>
          <th>周五</th>
          <th>周六</th>
          <th>周日</th>
        </tr>
      </thead>
      <tbody>
        <!-- 循环11个节次 -->
        <tr v-for="section in 11" :key="section">
          <td class="section-num">
            {{ section }}<br/>
            <small>{{ sectionTimeMap[section] }}</small>
          </td>
          <!-- 循环周一到周日 weekDay 1~7 -->
          <td v-for="day in 7" :key="day" class="course-cell">
            <!-- scheduleMap[星期][节次] 拿到课程对象 -->
            <div v-if="scheduleMap[day] && scheduleMap[day][section]" class="course-box">
              <div class="name">{{ scheduleMap[day][section].courseName }}</div>
              <div class="room">{{ scheduleMap[day][section].classroom }}</div>
              <div class="teacher">{{ scheduleMap[day][section].teacherName }}</div>
              <div class="week-range">周{{ scheduleMap[day][section].weekRange }}周</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 无排课时展示已选课程列表 -->
    <div v-if="!hasSchedules && selectedCourses.length > 0" class="course-list">
      <h3>已选全部课程</h3>
      <ul>
        <li v-for="c in selectedCourses" :key="c.id">
          {{ c.courseName }} | 任课老师：{{ c.teacherName }} | 学分：{{ c.credit }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 查询周次
const queryWeek = ref('')
// 所有后端返回的数据容器
const validWeeks = ref([])
const sectionTimeMap = ref({})
const scheduleMap = ref({})
const currentWeek = ref(1)
const hasSchedules = ref(false)
const selectedCourses = ref([])
const loading = ref(false)

// 封装请求函数
const getScheduleData = async () => {
  loading.value = true
  try {
    // 带周次参数请求接口
    const params = {}
    if (queryWeek.value) {
      params.week = queryWeek.value
    }
    const res = await axios.get('/api/student/mySchedule', { params })
    const data = res.data.data

    // 解构赋值绑定页面变量
    validWeeks.value = data.validWeeks
    sectionTimeMap.value = data.sectionTimeMap
    scheduleMap.value = data.scheduleMap
    currentWeek.value = data.currentWeek
    hasSchedules.value = data.hasSchedules
    selectedCourses.value = data.selectedCourses
  } catch (err) {
    console.error('请求课表失败', err)
    // 401未登录跳登录页（后续JWT登录用）
    if (err.response?.data?.code === 401) {
      alert('请先登录系统')
    }
  } finally {
    loading.value = false
  }
}

// 页面挂载自动加载数据
onMounted(() => {
  getScheduleData()
})
</script>

<style scoped>
.schedule-wrap {
  width: 95%;
  margin: 20px auto;
}
.week-select {
  margin: 15px 0;
  font-size: 16px;
}
.week-select select {
  padding: 4px 8px;
  margin: 0 10px;
}
.tip {
  color: #666;
}
.loading, .empty {
  font-size: 18px;
  color: #888;
  padding: 30px;
  text-align: center;
}
.schedule-table {
  width: 100%;
  border-collapse: collapse;
}
.schedule-table th {
  background: #165DFF;
  color: #fff;
  padding: 10px;
}
.section-num {
  background: #f5f7fa;
  width: 80px;
  font-size: 14px;
}
.course-cell {
  height: 80px;
  vertical-align: top;
  padding: 4px;
}
.course-box {
  background: #e8f3ff;
  padding: 4px;
  border-radius: 4px;
  font-size: 13px;
}
.course-box .name {
  font-weight: bold;
  color: #0056b3;
}
.course-list {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}
.course-list li {
  line-height: 2.2;
}
</style>