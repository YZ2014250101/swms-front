<!-- src/views/admin/Statistics.vue -->
<!-- 数据统计：顶部统计卡片 + 选课率 + 访问统计 -->
<template>
  <div class="statistics" v-loading="loading">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="16">
      <el-col :span="6" v-for="card in cards" :key="card.title">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <el-icon :size="44" :color="card.color"><component :is="card.icon" /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ card.value }}{{ card.suffix }}</div>
              <div class="stat-title">{{ card.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 下方两个数据卡片 -->
    <el-row :gutter="16" style="margin-top: 16px">
      <!-- 选课率进度 -->
      <el-col :span="14">
        <el-card shadow="never">
          <template #header><span>教学质量数据</span></template>
          <div class="rate-list">
            <div v-for="item in rateData" :key="item.name" class="rate-item">
              <div class="rate-label">
                <span>{{ item.name }}</span>
                <span class="rate-value">{{ item.value }}%</span>
              </div>
              <el-progress :percentage="item.value" :color="item.color" :stroke-width="14" />
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 访问趋势折线图：每时/每日/每周/每月/每年 -->
      <el-col :span="12">
        <el-card shadow="never">
          <template #header><span>访问趋势</span></template>
          <div class="chart-grid">
            <div v-for="chart in visitCharts" :key="chart.title" class="chart-card">
              <div class="chart-title">{{ chart.title }}</div>
              <svg class="line-chart" :viewBox="`0 0 ${CW} ${CH}`" preserveAspectRatio="none">
                <polyline
                  class="chart-area"
                  :points="chart.areaPoints"
                />
                <polyline
                  class="chart-line"
                  :points="chart.linePoints"
                />
              </svg>
              <div class="chart-axis">
                <span>{{ chart.startLabel }}</span>
                <span>{{ chart.endLabel }}</span>
              </div>
              <div class="chart-summary">
                <span>峰值 {{ chart.max }}</span>
                <span>合计 {{ chart.sum }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { User, UserFilled, Reading, TrendCharts } from '@element-plus/icons-vue'
import { getOverview, getVisitStats } from '@/api/modules/admin/statistics'

const loading = ref(false)
const overview = ref({ studentCount: 0, teacherCount: 0, courseCount: 0, selectionRate: 0 })
const visitStats = ref({
  totalVisits: 0,
  todayVisits: 0,
  weekVisits: 0,
  monthVisits: 0,
  yearVisits: 0,
  hourlyStats: [],
  dailyStats: [],
  weeklyStats: [],
  monthlyStats: [],
  yearlyStats: []
})

// 选课率转为百分比整数
const selectionPercent = computed(() => {
  const r = Number(overview.value.selectionRate) || 0
  return r > 0 && r < 1 ? Math.round(r * 100) : Math.round(r)
})

const cards = computed(() => [
  { title: '学生人数', value: overview.value.studentCount, icon: User, color: '#409eff', suffix: '' },
  { title: '教师人数', value: overview.value.teacherCount, icon: UserFilled, color: '#67c23a', suffix: '' },
  { title: '课程数量', value: overview.value.courseCount, icon: Reading, color: '#e6a23c', suffix: '' },
  { title: '选课率', value: selectionPercent.value, icon: TrendCharts, color: '#f56c6c', suffix: '%' }
])

const rateData = computed(() => [
  { name: '选课率', value: selectionPercent.value, color: '#409eff' }
])

// ===== 折线图相关 =====
// SVG 画布尺寸
const CW = 2400
const CH = 800
const PAD = 6

// 将后端返回的统计数组归一化为 { labels, values }
// 兼容：数字数组、{value/count/visits} 对象数组、{label/hour/day/...} 标签
function normalizeStats(raw) {
  const arr = Array.isArray(raw) ? raw : []
  const labels = []
  const values = []
  arr.forEach((item, idx) => {
    if (item === null || item === undefined) return
    if (typeof item === 'number') {
      values.push(item)
      labels.push(String(idx))
    } else if (typeof item === 'object') {
      const v = Number(item.value ?? item.count ?? item.visits ?? item.visitCount ?? 0)
      const l = item.label ?? item.hour ?? item.day ?? item.date ?? item.month ?? item.year ?? item.week ?? idx
      values.push(isNaN(v) ? 0 : v)
      labels.push(String(l))
    }
  })
  return { labels, values }
}

// 根据数值数组生成 SVG 折线坐标点
function buildPoints(values) {
  const n = values.length
  if (n === 0) return { linePoints: '', areaPoints: '' }
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = max - min || 1
  const innerW = CW - PAD * 2
  const innerH = CH - PAD * 2
  const stepX = n === 1 ? 0 : innerW / (n - 1)
  const pts = values.map((v, i) => {
    const x = PAD + i * stepX
    const y = PAD + innerH - ((v - min) / range) * innerH
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  const linePoints = pts.join(' ')
  // 区域填充：首尾延伸到底部
  const baseY = CH - PAD
  const areaPoints = `${PAD},${baseY} ${linePoints} ${PAD + (n - 1) * stepX},${baseY}`
  return { linePoints, areaPoints }
}

// 构建单个图表配置
function buildChart(title, raw, unit) {
  const { labels, values } = normalizeStats(raw)
  const { linePoints, areaPoints } = buildPoints(values)
  const max = values.length ? Math.max(...values) : 0
  const sum = values.reduce((a, b) => a + b, 0)
  
  return {
    title,
    unit,
    linePoints,
    areaPoints,
    max,
    sum,
    startLabel: labels.length ? labels[0] : '-',
    endLabel: labels.length ? labels[labels.length - 1] : '-'
  }
}

const visitCharts = computed(() => [
  buildChart('每时访问', visitStats.value.hourlyStats, '时'),
  buildChart('每日访问', visitStats.value.dailyStats, '日'),
  buildChart('每月访问', visitStats.value.monthlyStats, '月'),
  buildChart('每年访问', visitStats.value.yearlyStats, '年')
])

const fetchOverview = async () => {
  loading.value = true
  try {
    const res = await getOverview()
    overview.value = {
      studentCount: res.data.studentCount ?? 0,
      teacherCount: res.data.teacherCount ?? 0,
      courseCount: res.data.courseCount ?? 0,
      selectionRate: res.data.selectionRate ?? 0
    }
  } catch (e) {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}

const fetchVisit = async () => {
  try {
    const res = await getVisitStats()
    const d = res.data || {}
    visitStats.value = {
      totalVisits: d.totalVisits ?? 0,
      todayVisits: d.todayVisits ?? 0,
      weekVisits: d.weekVisits ?? 0,
      monthVisits: d.monthVisits ?? 0,
      yearVisits: d.yearVisits ?? 0,
      hourlyStats: d.hourlyStats || [],
      dailyStats: d.dailyStats || [],
      weeklyStats: d.weeklyStats || [],
      monthlyStats: d.monthlyStats || [],
      yearlyStats: d.yearlyStats || []
    }
  } catch (e) {
    // 拦截器已提示
  }
}

onMounted(async () => {
  await fetchOverview()
  fetchVisit()
})
</script>

<style scoped>
.stat-card {
  margin-bottom: 16px;
}
.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}
.stat-value {
  font-size: 30px;
  font-weight: 600;
  color: #303133;
}
.stat-title {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}
.rate-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 8px 0;
}
.rate-item .rate-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #303133;
}
.rate-value {
  font-weight: 600;
}
/* 折线图卡片网格 */
.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}
.chart-card {
  border: 2px solid #ebeef5;
  border-radius: 6px;
  padding: 10px 12px;
  background: #ffffff;
}
.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}
.line-chart {
  width: 100%;
  height: 200px;
  display: block;
}
.chart-line {
  fill: none;
  stroke: #409eff;
  stroke-width: 2;
  stroke-linejoin: round;
  stroke-linecap: round;
}
.chart-area {
  fill: rgba(64, 158, 255, 0.12);
  stroke: none;
}
.chart-axis {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #909399;
  margin-top: 4px;
}
.chart-summary {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #606266;
  margin-top: 2px;
}
</style>
