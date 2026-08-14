<!-- src/views/student/ScoreGpa.vue -->
<!-- 绩点 GPA 总览及各学期明细 -->
<template>
  <el-card shadow="never">
    <!-- 统计卡片 -->
    <el-row :gutter="16">
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-title">总学分</div>
          <div class="stat-value">{{ totalCredit }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-title">总绩点</div>
          <div class="stat-value">{{ totalGpa }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card highlight">
          <div class="stat-title">平均绩点 GPA</div>
          <div class="stat-value big">{{ avgGpa }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 各学期绩点明细 -->
    <el-table :data="tableData" border stripe style="width: 100%; margin-top: 16px">
      <el-table-column prop="semester" label="学期" min-width="180" />
      <el-table-column prop="credit" label="学分" width="120" align="center" />
      <el-table-column prop="gpa" label="绩点" width="120" align="center">
        <template #default="{ row }">
          <span :style="{ color: gpaColor(row.gpa) }">{{ row.gpa }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, computed } from 'vue'

// mock 各学期绩点明细
// TODO: 对接后端 绩点统计接口
const tableData = ref([
  { semester: '2023-2024 第一学期', credit: 18, gpa: 3.2 },
  { semester: '2023-2024 第二学期', credit: 20, gpa: 3.5 },
  { semester: '2024-2025 第一学期', credit: 22, gpa: 3.6 },
  { semester: '2024-2025 第二学期', credit: 17, gpa: 3.8 }
])

// 总学分
const totalCredit = computed(() => tableData.value.reduce((prev, cur) => prev + cur.credit, 0))
// 总绩点（学分加权）
const totalGpa = computed(() =>
  tableData.value.reduce((prev, cur) => prev + cur.gpa * cur.credit, 0).toFixed(1)
)
// 平均绩点
const avgGpa = computed(() => {
  const sum = tableData.value.reduce((prev, cur) => prev + cur.gpa * cur.credit, 0)
  return (sum / totalCredit.value).toFixed(2)
})

// 绩点颜色
const gpaColor = (gpa) => {
  if (gpa >= 3.7) return '#67c23a'
  if (gpa >= 3.0) return '#409eff'
  if (gpa >= 2.0) return '#e6a23c'
  return '#f56c6c'
}
</script>

<style scoped>
.stat-card {
  text-align: center;
}
.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}
.stat-value {
  font-size: 32px;
  font-weight: 600;
  color: #303133;
}
.stat-value.big {
  font-size: 40px;
  color: #409eff;
}
.stat-card.highlight {
  background: linear-gradient(135deg, #ecf5ff 0%, #ffffff 100%);
}
</style>
