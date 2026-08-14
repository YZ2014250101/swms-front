<!-- src/views/teacher/ScoreStats.vue -->
<!-- 班级成绩统计，含最高/最低/平均/及格率卡片与分数段分布 -->
<template>
  <el-card shadow="never">
    <el-form :inline="true" :model="queryForm" class="search-bar">
      <el-form-item label="课程">
        <el-select v-model="queryForm.courseId" placeholder="请选择课程" clearable style="width: 260px" @change="handleQuery">
          <el-option v-for="item in courseOptions" :key="item.id" :label="item.courseName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value" style="color: #67c23a">{{ stats.max }}</div>
          <div class="stat-title">最高分</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value" style="color: #f56c6c">{{ stats.min }}</div>
          <div class="stat-title">最低分</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value" style="color: #165DFF">{{ stats.avg }}</div>
          <div class="stat-title">平均分</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value" style="color: #e6a23c">{{ stats.passRate }}%</div>
          <div class="stat-title">及格率</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 分数段分布 -->
    <el-table :data="distribution" border stripe style="width: 100%; margin-top: 16px">
      <el-table-column prop="range" label="分数段" width="160" align="center" />
      <el-table-column prop="count" label="人数" width="120" align="center" />
      <el-table-column label="占比" min-width="200">
        <template #default="{ row }">
          <el-progress :percentage="row.percent" :color="rangeColor(row.range)" />
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

// 课程下拉
// TODO: 对接后端 教师所授课程列表接口
const courseOptions = ref([
  { id: 1, courseName: '数据结构' },
  { id: 2, courseName: '计算机网络' },
  { id: 3, courseName: '软件工程' },
  { id: 4, courseName: '高等数学' }
])

const queryForm = reactive({
  courseId: ''
})

// mock 成绩列表（用于统计）
// TODO: 对接后端 班级成绩统计接口，参数 courseId
const scoreList = ref([88, 92, 76, 55, 95, 68, 82, 90, 45, 78, 85, 62, 99, 58, 73])

// 统计数据
const stats = computed(() => {
  const list = scoreList.value
  if (list.length === 0) {
    return { max: 0, min: 0, avg: 0, passRate: 0 }
  }
  const max = Math.max(...list)
  const min = Math.min(...list)
  const avg = Math.round((list.reduce((p, c) => p + c, 0) / list.length) * 10) / 10
  const passCount = list.filter((s) => s >= 60).length
  const passRate = Math.round((passCount / list.length) * 1000) / 10
  return { max, min, avg, passRate }
})

// 分数段分布
const distribution = computed(() => {
  const list = scoreList.value
  const total = list.length || 1
  const ranges = [
    { range: '90-100', min: 90, max: 100 },
    { range: '80-89', min: 80, max: 89 },
    { range: '70-79', min: 70, max: 79 },
    { range: '60-69', min: 60, max: 69 },
    { range: '<60', min: 0, max: 59 }
  ]
  return ranges.map((r) => {
    const count = list.filter((s) => s >= r.min && s <= r.max).length
    return {
      range: r.range,
      count,
      percent: Math.round((count / total) * 1000) / 10
    }
  })
})

// 分数段颜色
const rangeColor = (range) => {
  const map = {
    '90-100': '#67c23a',
    '80-89': '#409eff',
    '70-79': '#165DFF',
    '60-69': '#e6a23c',
    '<60': '#f56c6c'
  }
  return map[range] || '#409eff'
}

// 查询
const handleQuery = () => {
  // TODO: 对接后端 班级成绩统计接口
  ElMessage.success('查询成功')
}
</script>

<style scoped>
.search-bar {
  margin-bottom: 16px;
}
.stat-row {
  margin-bottom: 8px;
}
.stat-card {
  text-align: center;
}
.stat-value {
  font-size: 32px;
  font-weight: 600;
}
.stat-title {
  font-size: 14px;
  color: #909399;
  margin-top: 6px;
}
</style>
