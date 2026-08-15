<!-- src/views/student/Attendance.vue -->
<!-- 考勤记录查询，按课程筛选，含学期统计概览 -->
<!-- 接口：getAttendanceStats（@/api/modules/student/attendance）→ { stats, courseStats, attendanceList } -->
<template>
  <el-card shadow="never">
    <el-form :inline="true" :model="queryForm" class="search-bar">
      <el-form-item label="课程">
        <el-select v-model="queryForm.courseId" placeholder="请选择课程" clearable style="width: 220px">
          <el-option v-for="item in courseOptions" :key="item.id" :label="item.courseName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="filteredList" v-loading="loading" border stripe style="width: 100%">
      <el-table-column prop="courseName" label="课程名称" min-width="160" />
      <el-table-column prop="attend" label="出勤次数" width="100" align="center" />
      <el-table-column prop="late" label="迟到次数" width="100" align="center" />
      <el-table-column prop="early" label="早退次数" width="100" align="center" />
      <el-table-column prop="absent" label="缺勤次数" width="100" align="center" />
      <el-table-column label="出勤率" width="180" align="center">
        <template #default="{ row }">
          <el-progress :percentage="Number(row.rate) || 0" :color="rateColor(Number(row.rate) || 0)" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 学期统计概览 -->
    <div class="summary">
      <span class="summary-title">学期统计概览：</span>
      <el-tag type="success">总出勤 {{ summary.totalAttend }} 次</el-tag>
      <el-tag type="warning">总迟到 {{ summary.totalLate }} 次</el-tag>
      <el-tag type="warning">总早退 {{ summary.totalEarly }} 次</el-tag>
      <el-tag type="danger">总缺勤 {{ summary.totalAbsent }} 次</el-tag>
      <el-tag type="primary">平均出勤率 {{ summary.avgRate }}%</el-tag>
    </div>
  </el-card>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getAttendanceStats } from '@/api/modules/student/attendance'

const loading = ref(false)

// 分课程考勤统计
const courseStats = ref([])

// 课程下拉（由 courseStats 派生）
const courseOptions = computed(() => {
  const seen = new Map()
  courseStats.value.forEach((c) => {
    if (c.courseName && !seen.has(c.courseName)) {
      seen.set(c.courseName, { id: c.courseName, courseName: c.courseName })
    }
  })
  return Array.from(seen.values())
})

const queryForm = reactive({
  courseId: ''
})

// 客户端按课程过滤
const filteredList = computed(() => {
  if (!queryForm.courseId) return courseStats.value
  return courseStats.value.filter((c) => c.courseName === queryForm.courseId)
})

// 加载考勤统计
const loadAttendance = async () => {
  loading.value = true
  try {
    const res = await getAttendanceStats()
    const data = res?.data ?? {}
    courseStats.value = data.courseStats || []
  } catch (err) {
    console.error('获取考勤统计失败', err)
  } finally {
    loading.value = false
  }
}

// 查询
const handleQuery = () => {
  // 过滤为 computed 响应式，此处无需额外处理
}

// 出勤率颜色
const rateColor = (rate) => {
  if (rate >= 90) return '#67c23a'
  if (rate >= 75) return '#409eff'
  if (rate >= 60) return '#e6a23c'
  return '#f56c6c'
}

// 学期统计概览（由表格数据派生，避免依赖 stats 字段名）
const summary = computed(() => {
  const data = filteredList.value
  const totalAttend = data.reduce((p, c) => p + Number(c.attend || 0), 0)
  const totalLate = data.reduce((p, c) => p + Number(c.late || 0), 0)
  const totalEarly = data.reduce((p, c) => p + Number(c.early || 0), 0)
  const totalAbsent = data.reduce((p, c) => p + Number(c.absent || 0), 0)
  const avgRate = data.length ? Math.round(data.reduce((p, c) => p + Number(c.rate || 0), 0) / data.length) : 0
  return { totalAttend, totalLate, totalEarly, totalAbsent, avgRate }
})

onMounted(() => {
  loadAttendance()
})
</script>

<style scoped>
.search-bar {
  margin-bottom: 16px;
}
.summary {
  margin-top: 16px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.summary-title {
  font-weight: 600;
  color: #303133;
}
</style>
