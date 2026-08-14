<!-- src/views/teacher/MySchedule.vue -->
<!-- 教师个人课表，按学期展示周一到周日 × 节次的课表网格 -->
<template>
  <el-card shadow="never">
    <div class="filter-bar">
      <span class="label">选择学期：</span>
      <el-select v-model="selectedSemester" placeholder="请选择学期" style="width: 220px" @change="handleSemesterChange">
        <el-option v-for="item in semesterOptions" :key="item" :label="item" :value="item" />
      </el-select>
    </div>

    <table class="schedule-table" border="1" cellpadding="6" cellspacing="0">
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
        <tr v-for="section in sectionCount" :key="section">
          <td class="section-num">
            第{{ section }}节<br />
            <small>{{ sectionTimeMap[section] }}</small>
          </td>
          <td v-for="day in 7" :key="day" class="course-cell">
            <div v-if="scheduleMap[day] && scheduleMap[day][section]" class="course-box">
              <div class="name">{{ scheduleMap[day][section].courseName }}</div>
              <div class="room">{{ scheduleMap[day][section].className }}</div>
              <div class="room">{{ scheduleMap[day][section].classroom }}</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 学期下拉
const semesterOptions = ref([
  '2025-2026 第一学期',
  '2024-2025 第二学期',
  '2024-2025 第一学期'
])
const selectedSemester = ref('')

// 节次数
const sectionCount = 11

// 节次时间映射
const sectionTimeMap = ref({
  1: '08:00-08:45',
  2: '08:55-09:40',
  3: '10:00-10:45',
  4: '10:55-11:40',
  5: '14:00-14:45',
  6: '14:55-15:40',
  7: '16:00-16:45',
  8: '16:55-17:40',
  9: '19:00-19:45',
  10: '19:55-20:40',
  11: '20:50-21:35'
})

// mock 课表数据，结构 scheduleMap[day][section] = { courseName, className, classroom }
// TODO: 对接后端 教师个人课表接口，参数 semester
const scheduleMap = ref({
  1: {
    1: { courseName: '数据结构', className: '计算机2301班', classroom: '教学楼A301' },
    2: { courseName: '数据结构', className: '计算机2301班', classroom: '教学楼A301' }
  },
  2: {
    5: { courseName: '计算机网络', className: '计算机2302班', classroom: '教学楼B205' },
    6: { courseName: '计算机网络', className: '计算机2302班', classroom: '教学楼B205' }
  },
  3: {
    3: { courseName: '数据结构', className: '计算机2301班', classroom: '教学楼A301' },
    4: { courseName: '数据结构', className: '计算机2301班', classroom: '教学楼A301' }
  },
  4: {
    1: { courseName: '高等数学', className: '计算机2301班', classroom: '教学楼A101' },
    2: { courseName: '高等数学', className: '计算机2301班', classroom: '教学楼A101' }
  },
  5: {
    3: { courseName: '软件工程', className: '软件2301班', classroom: '教学楼C102' },
    4: { courseName: '软件工程', className: '软件2301班', classroom: '教学楼C102' }
  }
})

// 切换学期
const handleSemesterChange = () => {
  // TODO: 对接后端 教师个人课表接口
  ElMessage.success('学期已切换')
}
</script>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.label {
  font-size: 14px;
  color: #606266;
  margin-right: 8px;
}
.schedule-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
.schedule-table th {
  background: #165DFF;
  color: #fff;
  padding: 10px;
  font-size: 15px;
}
.section-num {
  background: #f5f7fa;
  width: 90px;
  font-size: 13px;
  text-align: center;
}
.course-cell {
  height: 70px;
  vertical-align: top;
  padding: 4px;
}
.course-box {
  background: #e8f3ff;
  padding: 4px;
  border-radius: 4px;
  font-size: 13px;
  border-left: 3px solid #165DFF;
}
.course-box .name {
  font-weight: bold;
  color: #0056b3;
}
.course-box .room {
  color: #606266;
  margin-top: 2px;
}
</style>
