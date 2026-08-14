<!-- src/views/teacher/Index.vue -->
<!-- 教师端首页：数据概览 -->
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
          <template #header><span>今日授课</span></template>
          <el-empty description="今日暂无授课安排" :image-size="80" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never">
          <template #header><span>待批作业</span></template>
          <el-empty description="暂无待批作业" :image-size="80" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

// TODO: 对接后端首页统计接口
const cards = reactive([
  { title: '授课门数', value: 0, icon: 'Reading', color: '#409eff' },
  { title: '授课学生', value: 0, icon: 'User', color: '#67c23a' },
  { title: '待批作业', value: 0, icon: 'Edit', color: '#e6a23c' },
  { title: '未读消息', value: 0, icon: 'Bell', color: '#f56c6c' }
])
</script>

<style scoped>
.stat-card { margin-bottom: 16px; }
.stat-content { display: flex; align-items: center; gap: 16px; }
.stat-value { font-size: 28px; font-weight: 600; color: #303133; }
.stat-title { font-size: 13px; color: #909399; margin-top: 4px; }
</style>
