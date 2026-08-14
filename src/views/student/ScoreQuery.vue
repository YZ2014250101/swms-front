<!-- src/views/student/ScoreQuery.vue -->
<!-- 各科成绩查询，按学期筛选 -->
<!-- 接口：getScoreList（@/api/modules/student/score）→ { gradeList, gpaInfo, allGrades } -->
<template>
  <el-card shadow="never">
    <!-- GPA 统计 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :span="8">
        <div class="stat-item">
          <div class="stat-title">总学分</div>
          <div class="stat-value">{{ gpaInfo.totalCredit ?? '-' }}</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="stat-item">
          <div class="stat-title">总绩点</div>
          <div class="stat-value">{{ gpaInfo.totalGpa ?? '-' }}</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="stat-item highlight">
          <div class="stat-title">平均绩点</div>
          <div class="stat-value big">{{ gpaInfo.avgGpa ?? '-' }}</div>
        </div>
      </el-col>
    </el-row>

    <el-form :inline="true" :model="queryForm" class="search-bar">
      <el-form-item label="学期">
        <el-select v-model="queryForm.semester" placeholder="请选择学期" clearable style="width: 220px">
          <el-option v-for="item in semesterOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="pagedData" v-loading="loading" border stripe show-summary :summary-method="getSummary" style="width: 100%">
      <el-table-column prop="courseNo" label="课程编号" width="120" />
      <el-table-column prop="courseName" label="课程名称" min-width="160" />
      <el-table-column prop="credit" label="学分" width="80" align="center" />
      <el-table-column prop="dailyScore" label="平时成绩" width="100" align="center" />
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
      :total="filteredList.length"
      layout="total, prev, pager, next"
    />
  </el-card>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getScoreList } from '@/api/modules/student/score'

const loading = ref(false)

// GPA 统计信息
const gpaInfo = ref({})
// 全部成绩（按学期分组，用于学期下拉）
const allGrades = ref({})
// 已发布成绩列表
const gradeList = ref([])

// 学期下拉（从 allGrades 的 key 生成）
const semesterOptions = computed(() => {
  const ag = allGrades.value
  if (ag && typeof ag === 'object' && !Array.isArray(ag)) {
    return Object.keys(ag)
  }
  return []
})

const queryForm = reactive({
  semester: ''
})

const page = reactive({
  current: 1,
  size: 10
})

// 客户端按学期过滤
const filteredList = computed(() => {
  if (!queryForm.semester) return gradeList.value
  return gradeList.value.filter((g) => !g.semester || g.semester === queryForm.semester)
})

// 当前页数据
const pagedData = computed(() => {
  const start = (page.current - 1) * page.size
  return filteredList.value.slice(start, start + page.size)
})

// 加载成绩
const loadScores = async () => {
  loading.value = true
  try {
    const res = await getScoreList()
    const data = res.data || {}
    gradeList.value = data.gradeList || []
    gpaInfo.value = data.gpaInfo || {}
    allGrades.value = data.allGrades || {}
  } catch (err) {
    console.error('获取成绩失败', err)
  } finally {
    loading.value = false
  }
}

// 查询
const handleQuery = () => {
  page.current = 1
}

// 综合成绩颜色
const scoreColor = (score) => {
  if (score == null) return '#909399'
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
      const valid = data.filter((c) => c[prop] != null)
      const total = valid.reduce((prev, cur) => prev + Number(cur[prop] || 0), 0)
      sums[index] = valid.length ? (total / valid.length).toFixed(1) : '-'
    } else {
      sums[index] = '-'
    }
  })
  return sums
}

onMounted(() => {
  loadScores()
})
</script>

<style scoped>
.stat-row {
  margin-bottom: 16px;
}
.stat-item {
  background: #f5f7fa;
  border-radius: 6px;
  padding: 16px;
  text-align: center;
}
.stat-item.highlight {
  background: linear-gradient(135deg, #ecf5ff 0%, #ffffff 100%);
}
.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}
.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
}
.stat-value.big {
  font-size: 34px;
  color: #409eff;
}
.search-bar {
  margin-bottom: 16px;
}
</style>
