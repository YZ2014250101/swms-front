<!-- src/views/student/CourseDetail.vue -->
<!-- 课程详情页，通过路由参数 id 加载课程信息 -->
<template>
  <el-card shadow="never">
    <div class="header">
      <el-button :icon="ArrowLeft" @click="goBack">返回</el-button>
      <span class="title">课程详情</span>
    </div>

    <el-descriptions :column="2" border style="margin-top: 16px">
      <el-descriptions-item label="课程编号">{{ detail.courseCode }}</el-descriptions-item>
      <el-descriptions-item label="课程名称">{{ detail.courseName }}</el-descriptions-item>
      <el-descriptions-item label="授课教师">{{ detail.teacher }}</el-descriptions-item>
      <el-descriptions-item label="学分">{{ detail.credit }}</el-descriptions-item>
      <el-descriptions-item label="学时">{{ detail.hours }}</el-descriptions-item>
      <el-descriptions-item label="上课时间">{{ detail.classTime }}</el-descriptions-item>
      <el-descriptions-item label="上课地点">{{ detail.classLocation }}</el-descriptions-item>
      <el-descriptions-item label="考核方式">{{ detail.assessment }}</el-descriptions-item>
      <el-descriptions-item label="课程简介" :span="2">{{ detail.introduction }}</el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const courseId = route.params.id

// mock 课程详情
// TODO: 对接后端 课程详情接口，参数 id
const detail = ref({
  courseCode: 'CS101',
  courseName: '数据结构',
  teacher: '张伟',
  credit: 4,
  hours: 64,
  classTime: '周一 1-2节 / 周三 3-4节',
  classLocation: '教学楼A301',
  assessment: '平时成绩30% + 期末考试70%',
  introduction: '本课程系统讲授线性表、栈、队列、树、图等基本数据结构及其算法，培养数据组织与算法设计能力。'
})

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}
</style>
