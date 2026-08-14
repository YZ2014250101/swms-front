<!-- src/views/student/MySchedule.vue -->
<!-- 我的课表：按周次查看课程安排，7天 × 11节次网格 -->
<template>
  <div class="schedule-page">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>📅 我的课表</span>
          <div class="week-select">
            <span>选择周次：</span>
            <el-select v-model="queryWeek" placeholder="请选择" style="width: 120px" @change="getScheduleData">
              <el-option v-for="w in validWeeks" :key="w" :label="`第${w}周`" :value="w" />
            </el-select>
            <el-tag type="info" effect="plain" style="margin-left: 12px">当前第{{ currentWeek }}周</el-tag>
          </div>
        </div>
      </template>

      <div v-loading="loading">
        <el-empty v-if="!hasSchedules && !loading" description="本周暂无课程安排" />

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
            <tr v-for="section in 11" :key="section">
              <td class="section-num">
                {{ section }}<br />
                <small>{{ sectionTimeMap[section] }}</small>
              </td>
              <td v-for="day in 7" :key="day" class="course-cell">
                <div v-if="scheduleMap[day]?.[section]" class="course-box">
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
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getStudentSchedule } from '@/api/modules/student/schedule'

// 查询周次，挂载后赋值为当前周
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
    const res = await getStudentSchedule(params)
    const data = res.data
    // 解构赋值绑定页面变量
    validWeeks.value = data.validWeeks || []
    sectionTimeMap.value = data.sectionTimeMap || {}
    scheduleMap.value = data.scheduleMap || {}
    currentWeek.value = data.currentWeek || 1
    hasSchedules.value = data.hasSchedules || false
    selectedCourses.value = data.selectedCourses || []

    // 首次加载默认选中当前周
    if (!queryWeek.value && data.currentWeek) {
      queryWeek.value = data.currentWeek
    }
  } catch (err) {
    console.error('请求课表失败', err)
    ElMessage.error('获取课表失败')
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
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.week-select {
  display: flex;
  align-items: center;
  font-size: 14px;
}
.schedule-table {
  width: 100%;
  border-collapse: collapse;
}
.schedule-table th {
  background: #165dff;
  color: #fff;
  padding: 10px;
  font-size: 15px;
}
.section-num {
  background: #f5f7fa;
  width: 80px;
  font-size: 14px;
  text-align: center;
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
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
}
.course-list h3 {
  margin-top: 0;
  color: #333;
}
.course-list li {
  line-height: 2.2;
  list-style: inside disc;
}
</style>
