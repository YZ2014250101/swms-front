<!-- src/views/student/ScoreGpa.vue -->
<!-- 绩点 GPA 总览及各学期明细 -->
<!-- 接口：getScoreList（@/api/modules/student/score）→ { gradeList, gpaInfo, allGrades } -->
<template>
  <el-card shadow="never" v-loading="loading">
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
    <el-table :data="semesterTable" border stripe style="width: 100%; margin-top: 16px">
      <el-table-column prop="semester" label="学期" min-width="180" />
      <el-table-column prop="credit" label="学分" width="120" align="center" />
      <el-table-column prop="gpa" label="绩点" width="120" align="center">
        <template #default="{ row }">
          <span :style="{ color: gpaColor(row.gpa) }">{{ row.gpa }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-if="!loading && semesterTable.length === 0" description="暂无绩点数据" :image-size="80" style="margin-top: 16px" />
  </el-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getScoreList } from '@/api/modules/student/score'

const loading = ref(false)
const gpaInfo = ref({})
const gradeList = ref([])
const allGrades = ref({})

// 总学分：优先 gpaInfo，否则由成绩列表累加
const totalCredit = computed(() => {
  const v = Number(gpaInfo.value.totalCredit)
  if (!isNaN(v) && gpaInfo.value.totalCredit != null) return v
  return gradeList.value.reduce((p, c) => p + Number(c.credit || 0), 0)
})

// 总绩点：优先 gpaInfo，否则学分加权
const totalGpa = computed(() => {
  const v = gpaInfo.value.totalGpa
  if (v != null) return v
  const sum = gradeList.value.reduce((p, c) => p + Number(c.gpa || 0) * Number(c.credit || 0), 0)
  return sum.toFixed(1)
})

// 平均绩点：优先 gpaInfo，否则计算
const avgGpa = computed(() => {
  const v = gpaInfo.value.avgGpa
  if (v != null) return v
  const sum = gradeList.value.reduce((p, c) => p + Number(c.gpa || 0) * Number(c.credit || 0), 0)
  return totalCredit.value ? (sum / totalCredit.value).toFixed(2) : '0.00'
})

// 各学期明细：兼容 allGrades 为对象（按学期分组）或数组（已是明细）
const semesterTable = computed(() => {
  const ag = allGrades.value
  if (Array.isArray(ag)) {
    return ag.map((item) => ({
      semester: item.semester || item.semesterName || '',
      credit: Number(item.credit || 0),
      gpa: item.gpa != null ? Number(item.gpa) : 0
    }))
  }
  if (ag && typeof ag === 'object') {
    return Object.keys(ag).map((sem) => {
      const items = ag[sem] || []
      const credit = items.reduce((p, c) => p + Number(c.credit || 0), 0)
      const weighted = items.reduce((p, c) => p + Number(c.gpa || 0) * Number(c.credit || 0), 0)
      const gpa = credit ? weighted / credit : 0
      return { semester: sem, credit, gpa: gpa.toFixed(2) }
    })
  }
  return []
})

// 绩点颜色
const gpaColor = (gpa) => {
  const n = Number(gpa)
  if (isNaN(n)) return '#909399'
  if (n >= 3.7) return '#67c23a'
  if (n >= 3.0) return '#409eff'
  if (n >= 2.0) return '#e6a23c'
  return '#f56c6c'
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getScoreList()
    const data = res.data || {}
    gradeList.value = data.gradeList || []
    gpaInfo.value = data.gpaInfo || {}
    allGrades.value = data.allGrades || {}
  } catch (err) {
    console.error('获取绩点数据失败', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
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
