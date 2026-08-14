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
    <el-table :data="distribution" border stripe style="width: 100%; margin-top: 16px" v-loading="loading">
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
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getTeacherCourses } from '@/api/modules/teacher/course'
import { getGradeStats } from '@/api/modules/teacher/score'
import { onMounted } from 'vue'

// 课程下拉
const courseOptions = ref([])

const queryForm = reactive({
  courseId: ''
})

const loading = ref(false)

// 统计数据：取后端 stats 中的最高/最低/平均/及格率
const stats = reactive({
  max: 0,
  min: 0,
  avg: 0,
  passRate: 0
})

// 分数段分布：取后端 stats 中的分布数据
const distribution = ref([])

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

// 拉取课程下拉
const fetchCourses = async () => {
  try {
    const res = await getTeacherCourses()
    courseOptions.value = res.data?.courseList || []
  } catch (e) {
    // 拦截器已提示
  }
}

// 拉取成绩统计
const fetchStats = async () => {
  if (!queryForm.courseId) {
    ElMessage.warning('请先选择课程')
    return
  }
  loading.value = true
  try {
    const res = await getGradeStats(queryForm.courseId)
    const s = res.data?.stats || {}
    stats.max = s.max ?? s.maxScore ?? 0
    stats.min = s.min ?? s.minScore ?? 0
    stats.avg = s.avg ?? s.average ?? 0
    stats.passRate = s.passRate ?? s.passingRate ?? 0
    // 分数段分布：兼容字段名 range/label/segment、count/num、percent/ratio
    const total = (s.distribution || []).reduce((sum, it) => sum + (it.count ?? it.num ?? 0), 0) || 1
    distribution.value = (s.distribution || []).map((it) => {
      const count = it.count ?? it.num ?? 0
      const percent = it.percent ?? it.ratio ?? Math.round((count / total) * 1000) / 10
      return {
        range: it.range ?? it.label ?? it.segment ?? '',
        count,
        percent
      }
    })
  } catch (e) {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}

// 查询
const handleQuery = () => {
  fetchStats()
}

onMounted(() => {
  fetchCourses()
})
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
