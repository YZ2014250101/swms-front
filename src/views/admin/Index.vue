<!-- src/views/admin/Index.vue -->
<!-- 管理员端首页：系统数据概览 -->
<template>
  <div class="dashboard">
    <el-row :gutter="16">
      <el-col :span="6" v-for="card in cards" :key="card.title">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <el-icon :size="40" :color="card.color"><component :is="card.icon" /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ card.value }}</div>
              <div class="stat-title">{{ card.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="16">
        <el-card shadow="never">
          <template #header><span>系统概览</span></template>
          <el-empty description="暂无数据" :image-size="80" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never">
          <template #header><span>最近操作日志</span></template>
          <el-empty description="暂无日志" :image-size="80" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { getOverview } from '@/api/modules/admin/statistics'

const loading = ref(false)
const cards = reactive([
  { title: '学生人数', value: 0, icon: 'User', color: '#409eff' },
  { title: '教师人数', value: 0, icon: 'UserFilled', color: '#67c23a' },
  { title: '课程数量', value: 0, icon: 'Reading', color: '#e6a23c' },
  { title: '选课率', value: '0%', icon: 'TrendCharts', color: '#f56c6c' }
])

async function loadOverview() {
  loading.value = true
  try {
    const res = await getOverview()
    const data = res.data || {}
    cards[0].value = data.studentCount ?? 0
    cards[1].value = data.teacherCount ?? 0
    cards[2].value = data.courseCount ?? 0
    const rate = Number(data.selectionRate)
    cards[3].value = isNaN(rate) ? '0%' : `${rate}%`
  } catch (e) {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}

onMounted(loadOverview)
</script>

<style scoped>
.stat-card { margin-bottom: 16px; }
.stat-content { display: flex; align-items: center; gap: 16px; }
.stat-value { font-size: 28px; font-weight: 600; color: #303133; }
.stat-title { font-size: 13px; color: #909399; margin-top: 4px; }
</style>
