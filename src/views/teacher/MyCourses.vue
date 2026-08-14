<!-- src/views/teacher/MyCourses.vue -->
<!-- 所授课程列表，按学期筛选，支持查看学生名单与成绩录入跳转 -->
<template>
  <el-card shadow="never">
    <el-form :inline="true" :model="queryForm" class="search-bar">
      <el-form-item label="学期">
        <el-select v-model="queryForm.semester" placeholder="请选择学期" clearable style="width: 220px" @change="handleQuery">
          <el-option v-for="item in semesterOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="courseNo" label="课程编号" width="120" />
      <el-table-column prop="courseName" label="课程名称" min-width="150" />
      <el-table-column prop="className" label="授课班级" width="160" />
      <el-table-column prop="credit" label="学分" width="80" align="center" />
      <el-table-column prop="hours" label="学时" width="80" align="center" />
      <el-table-column label="上课时间" min-width="180">
        <template #default="{ row }">{{ formatClassTime(row) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleStudents(row)">学生名单</el-button>
          <el-button type="success" link size="small" @click="handleScoreEntry(row)">成绩录入</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 16px; justify-content: flex-end"
      v-model:current-page="page.current"
      v-model:page-size="page.size"
      :page-sizes="[10, 20, 50]"
      :total="page.total"
      layout="total, sizes, prev, pager, next, jumper"
    />
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getTeacherCourses } from '@/api/modules/teacher/course'

const router = useRouter()

// 学期下拉（后端 myCourse 未返回学期信息，保留筛选 UI）
const semesterOptions = ref([
  '2025-2026 第一学期',
  '2024-2025 第二学期',
  '2024-2025 第一学期'
])

const queryForm = reactive({
  semester: ''
})

// 分页参数
const page = reactive({
  current: 1,
  size: 10,
  total: 0
})

const loading = ref(false)
const tableData = ref([])

const weekDayMap = { 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六', 7: '周日' }

// 拼接上课时间：优先使用后端 classTime，否则用 weekDay/startSection/endSection/classroom 组合
const formatClassTime = (row) => {
  if (row.classTime) return row.classTime
  if (row.weekDay || row.startSection) {
    const day = weekDayMap[row.weekDay] || ''
    const section = row.startSection && row.endSection ? `${row.startSection}-${row.endSection}节` : ''
    const room = row.classroom || ''
    return [day, section, room].filter(Boolean).join(' ')
  }
  return ''
}

// 拉取所授课程列表
const fetchCourses = async () => {
  loading.value = true
  try {
    const res = await getTeacherCourses()
    const list = res.data?.courseList || []
    tableData.value = list
    page.total = list.length
  } catch (e) {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}

// 查询
const handleQuery = () => {
  fetchCourses()
}

// 查看学生名单
const handleStudents = (row) => {
  router.push({ name: 'CourseStudents', query: { courseId: row.id, courseName: row.courseName } })
}

// 成绩录入
const handleScoreEntry = (row) => {
  router.push({ name: 'ScoreEntry', query: { courseId: row.id, courseName: row.courseName } })
}

import { onMounted } from 'vue'
onMounted(() => {
  fetchCourses()
})
</script>

<style scoped>
.search-bar {
  margin-bottom: 16px;
}
</style>
