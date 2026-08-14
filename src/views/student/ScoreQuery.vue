<!-- src/views/student/ScoreQuery.vue -->
<!-- 各科成绩查询，按学期筛选 -->
<template>
  <el-card shadow="never">
    <el-form :inline="true" :model="queryForm" class="search-bar">
      <el-form-item label="学期">
        <el-select v-model="queryForm.semester" placeholder="请选择学期" clearable style="width: 200px">
          <el-option v-for="item in semesterOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe show-summary :summary-method="getSummary" style="width: 100%">
      <el-table-column prop="courseCode" label="课程编号" width="120" />
      <el-table-column prop="courseName" label="课程名称" min-width="160" />
      <el-table-column prop="credit" label="学分" width="80" align="center" />
      <el-table-column prop="usualScore" label="平时成绩" width="100" align="center" />
      <el-table-column prop="finalScore" label="期末成绩" width="100" align="center" />
      <el-table-column prop="totalScore" label="综合成绩" width="100" align="center">
        <template #default="{ row }">
          <span :style="{ color: scoreColor(row.totalScore) }">{{ row.totalScore }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="gpa" label="绩点" width="100" align="center" />
    </el-table>

    <el-pagination
      style="margin-top: 16px; justify-content: flex-end"
      v-model:current-page="page.current"
      v-model:page-size="page.size"
      :total="page.total"
      layout="total, prev, pager, next"
    />
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

// 学期下拉
const semesterOptions = ref(['2024-2025 第二学期', '2024-2025 第一学期', '2023-2024 第二学期'])

const queryForm = reactive({
  semester: ''
})

const page = reactive({
  current: 1,
  size: 10,
  total: 5
})

// mock 成绩数据
// TODO: 对接后端 成绩查询接口，参数 semester
const tableData = ref([
  { courseCode: 'CS101', courseName: '数据结构', credit: 4, usualScore: 88, finalScore: 82, totalScore: 84, gpa: 3.7 },
  { courseCode: 'CS100', courseName: '高等数学', credit: 5, usualScore: 90, finalScore: 85, totalScore: 86, gpa: 3.8 },
  { courseCode: 'CS103', courseName: '计算机网络', credit: 3, usualScore: 78, finalScore: 72, totalScore: 74, gpa: 2.7 },
  { courseCode: 'CS104', courseName: '软件工程', credit: 2, usualScore: 92, finalScore: 95, totalScore: 94, gpa: 4.0 },
  { courseCode: 'CS105', courseName: '大学英语', credit: 3, usualScore: 85, finalScore: 80, totalScore: 81, gpa: 3.0 }
])

// 查询
const handleQuery = () => {
  // TODO: 对接后端 成绩查询接口
  ElMessage.success('查询成功')
}

// 综合成绩颜色
const scoreColor = (score) => {
  if (score >= 90) return '#67c23a'
  if (score >= 60) return '#303133'
  return '#f56c6c'
}

// 合计行
const getSummary = ({ columns, data }) => {
  const sums = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    }
    const prop = column.property
    if (['credit', 'gpa'].includes(prop)) {
      sums[index] = data.reduce((prev, cur) => prev + Number(cur[prop] || 0), 0).toFixed(1)
    } else if (prop === 'totalScore') {
      const total = data.reduce((prev, cur) => prev + Number(cur[prop] || 0), 0)
      sums[index] = (total / data.length).toFixed(1)
    } else {
      sums[index] = '-'
    }
  })
  return sums
}
</script>

<style scoped>
.search-bar {
  margin-bottom: 16px;
}
</style>
