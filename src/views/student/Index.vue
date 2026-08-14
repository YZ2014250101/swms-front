<!-- src/views/student/Index.vue -->
<!-- 学生端首页：数据概览卡片 -->
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
          <template #header>
            <span>今日课程</span>
          </template>
          <el-empty description="今日暂无课程" :image-size="80" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never">
          <template #header>
            <span>待办事项</span>
          </template>
          <el-empty description="暂无待办" :image-size="80" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

// TODO: 对接后端首页统计接口
const cards = reactive([
  { title: '已选课程', value: 0, icon: 'Notebook', color: '#409eff' },
  { title: '未读消息', value: 0, icon: 'Bell', color: '#e6a23c' },
  { title: '待交作业', value: 0, icon: 'Edit', color: '#f56c6c' },
  { title: '本周课时', value: 0, icon: 'Calendar', color: '#67c23a' }
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
  font-size: 28px;
  font-weight: 600;
  color: #303133;
}
.stat-title {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}
</style>
