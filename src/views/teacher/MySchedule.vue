<!-- src/views/teacher/MySchedule.vue -->
<!-- 教师个人课表：后端文档无教师课表单独接口，getTeacherSchedule 暂返回 myInfo 数据 -->
<!-- 故页面以"暂无数据"展示，并用 getTeacherCourses 的 courseList 简单展示授课时间 -->
<template>
  <el-card shadow="never">
    <div class="filter-bar">
      <span class="label">选择学期：</span>
      <el-select v-model="selectedSemester" placeholder="请选择学期" style="width: 220px" @change="handleSemesterChange">
        <el-option v-for="item in semesterOptions" :key="item" :label="item" :value="item" />
      </el-select>
    </div>

    <!-- 后端无教师课表接口，暂无数据 -->
    <el-empty description="教师课表（后端暂无教师课表接口，暂无数据）" v-loading="loading" />

    <!-- 用授课列表简单展示授课时间 -->
    <div class="course-time-title">授课时间一览（来源于所授课程）</div>
    <el-table :data="courseList" border stripe style="width: 100%">
      <el-table-column prop="courseName" label="课程名称" min-width="150" />
      <el-table-column prop="courseNo" label="课程编号" width="130" />
      <el-table-column label="上课时间" min-width="180">
        <template #default="{ row }">{{ formatClassTime(row) }}</template>
      </el-table-column>
      <el-table-column prop="classroom" label="教室" width="140" />
    </el-table>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getTeacherSchedule, getTeacherCourses } from '@/api/modules/teacher/course'
import { onMounted } from 'vue'

// 学期下拉
const semesterOptions = ref([
  '2025-2026 第一学期',
  '2024-2025 第二学期',
  '2024-2025 第一学期'
])
const selectedSemester = ref('')

const loading = ref(false)
// 后端无教师课表接口，getTeacherSchedule 暂返回 myInfo 数据，此处仅调用以保持接口约定
const teacherInfo = ref({})
// 用所授课程列表展示授课时间
const courseList = ref([])

const weekDayMap = { 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六', 7: '周日' }
const formatClassTime = (row) => {
  if (row.classTime) return row.classTime
  if (row.weekDay || row.startSection) {
    const day = weekDayMap[row.weekDay] || ''
    const section = row.startSection && row.endSection ? `${row.startSection}-${row.endSection}节` : ''
    const room = row.classroom || ''
    return [day, section, room].filter(Boolean).join(' ')
  }
  return ''
}

const fetchData = async () => {
  loading.value = true
  try {
    // 后端无教师课表接口，getTeacherSchedule 暂返回 myInfo
    const res = await getTeacherSchedule()
    teacherInfo.value = res.data || {}
    // 用所授课程列表展示授课时间
    const courseRes = await getTeacherCourses()
    courseList.value = courseRes.data?.courseList || []
  } catch (e) {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}

// 切换学期
const handleSemesterChange = () => {
  // 后端无教师课表接口，学期切换仅提示
  ElMessage.info('后端暂无教师课表接口，学期切换暂无数据')
}

onMounted(() => {
  fetchData()
})
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
.course-time-title {
  margin: 8px 0 12px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}
</style>
