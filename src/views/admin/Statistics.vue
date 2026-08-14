<!-- src/views/admin/Statistics.vue -->
<!-- 数据统计，顶部统计卡片 + 选课率/合格率/考勤率展示 -->
<template>
  <div class="statistics">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="16">
      <el-col :span="6" v-for="card in cards" :key="card.title">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <el-icon :size="44" :color="card.color"><component :is="card.icon" /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ card.value }}</div>
              <div class="stat-title">{{ card.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 下方两个数据卡片 -->
    <el-row :gutter="16" style="margin-top: 16px">
      <!-- 选课率/合格率/考勤率进度条 -->
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

      <!-- 各院系学生占比 -->
      <el-col :span="10">
        <el-card shadow="never">
          <template #header><span>各院系学生占比</span></template>
          <el-table :data="deptData" border stripe style="width: 100%">
            <el-table-column prop="name" label="院系" min-width="120" />
            <el-table-column prop="count" label="人数" width="90" align="center" />
            <el-table-column label="占比" width="200" align="center">
              <template #default="{ row }">
                <el-progress :percentage="row.percent" :stroke-width="12" />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 顶部统计卡片
// TODO: 对接后端 首页统计接口
const cards = ref([
  { title: '学生人数', value: 1280, icon: 'User', color: '#409eff' },
  { title: '教师人数', value: 86, icon: 'UserFilled', color: '#67c23a' },
  { title: '课程数量', value: 64, icon: 'Reading', color: '#e6a23c' },
  { title: '班级数量', value: 32, icon: 'OfficeBuilding', color: '#f56c6c' }
])

// 教学质量数据（选课率/合格率/考勤率）
// TODO: 对接后端 教学质量统计接口
const rateData = ref([
  { name: '选课率', value: 92, color: '#409eff' },
  { name: '合格率', value: 88, color: '#67c23a' },
  { name: '考勤率', value: 95, color: '#e6a23c' }
])

// 各院系学生占比
// TODO: 对接后端 院系学生统计接口
const deptData = ref([
  { name: '计算机学院', count: 520, percent: 41 },
  { name: '软件学院', count: 430, percent: 34 },
  { name: '信息工程学院', count: 330, percent: 25 }
])
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
</style>
