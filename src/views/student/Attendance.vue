<!-- src/views/student/Attendance.vue -->
<!-- 考勤记录查询，按学期/课程筛选，含学期统计概览 -->
<template>
  <el-card shadow="never">
    <el-form :inline="true" :model="queryForm" class="search-bar">
      <el-form-item label="学期">
        <el-select v-model="queryForm.semester" placeholder="请选择学期" clearable style="width: 200px">
          <el-option v-for="item in semesterOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="课程">
        <el-select v-model="queryForm.courseId" placeholder="请选择课程" clearable style="width: 200px">
          <el-option v-for="item in courseOptions" :key="item.id" :label="item.courseName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="courseName" label="课程名称" min-width="160" />
      <el-table-column prop="attend" label="出勤次数" width="100" align="center" />
      <el-table-column prop="late" label="迟到次数" width="100" align="center" />
      <el-table-column prop="early" label="早退次数" width="100" align="center" />
      <el-table-column prop="absent" label="缺勤次数" width="100" align="center" />
      <el-table-column label="出勤率" width="180" align="center">
        <template #default="{ row }">
          <el-progress :percentage="row.rate" :color="rateColor(row.rate)" />
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
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const semesterOptions = ref(['2024-2025 第二学期', '2024-2025 第一学期', '2023-2024 第二学期'])

// 课程下拉
// TODO: 对接后端 我的课程列表接口
const courseOptions = ref([
  { id: 1, courseName: '数据结构' },
  { id: 2, courseName: '计算机网络' },
  { id: 3, courseName: '软件工程' }
])

const queryForm = reactive({
  semester: '',
  courseId: ''
})

// mock 考勤数据
// TODO: 对接后端 考勤记录查询接口，参数 semester / courseId
const tableData = ref([
  { courseName: '数据结构', attend: 28, late: 1, early: 0, absent: 1, rate: 93 },
  { courseName: '计算机网络', attend: 30, late: 0, early: 0, absent: 0, rate: 100 },
  { courseName: '软件工程', attend: 14, late: 2, early: 1, absent: 1, rate: 78 },
  { courseName: '高等数学', attend: 38, late: 0, early: 0, absent: 2, rate: 95 }
])

// 查询
const handleQuery = () => {
  // TODO: 对接后端 考勤记录查询接口
  ElMessage.success('查询成功')
}

// 出勤率颜色
const rateColor = (rate) => {
  if (rate >= 90) return '#67c23a'
  if (rate >= 75) return '#409eff'
  if (rate >= 60) return '#e6a23c'
  return '#f56c6c'
}

// 学期统计概览
const summary = computed(() => {
  const data = tableData.value
  const totalAttend = data.reduce((p, c) => p + c.attend, 0)
  const totalLate = data.reduce((p, c) => p + c.late, 0)
  const totalEarly = data.reduce((p, c) => p + c.early, 0)
  const totalAbsent = data.reduce((p, c) => p + c.absent, 0)
  const avgRate = data.length ? Math.round(data.reduce((p, c) => p + c.rate, 0) / data.length) : 0
  return { totalAttend, totalLate, totalEarly, totalAbsent, avgRate }
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
