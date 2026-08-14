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

    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="courseCode" label="课程编号" width="120" />
      <el-table-column prop="courseName" label="课程名称" min-width="150" />
      <el-table-column prop="className" label="授课班级" width="160" />
      <el-table-column prop="credit" label="学分" width="80" align="center" />
      <el-table-column prop="hours" label="学时" width="80" align="center" />
      <el-table-column prop="classTime" label="上课时间" min-width="180" />
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

const router = useRouter()

// 学期下拉
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
  total: 4
})

// mock 所授课程列表
// TODO: 对接后端 教师所授课程列表接口，参数 semester
const tableData = ref([
  { id: 1, courseCode: 'CS101', courseName: '数据结构', className: '计算机2301班', credit: 4, hours: 64, classTime: '周一 1-2节 教学楼A301 / 周三 3-4节 教学楼A301' },
  { id: 2, courseCode: 'CS103', courseName: '计算机网络', className: '计算机2302班', credit: 3, hours: 48, classTime: '周二 5-6节 教学楼B205' },
  { id: 3, courseCode: 'CS104', courseName: '软件工程', className: '软件2301班', credit: 2, hours: 32, classTime: '周五 3-4节 教学楼C102' },
  { id: 4, courseCode: 'CS100', courseName: '高等数学', className: '计算机2301班 / 计算机2302班', credit: 5, hours: 80, classTime: '周四 1-2节 教学楼A101' }
])

// 查询
const handleQuery = () => {
  // TODO: 对接后端 教师所授课程列表接口
  ElMessage.success('查询成功')
}

// 查看学生名单
const handleStudents = (row) => {
  router.push({ name: 'CourseStudents', query: { courseId: row.id, courseName: row.courseName } })
}

// 成绩录入
const handleScoreEntry = (row) => {
  router.push({ name: 'ScoreEntry', query: { courseId: row.id, courseName: row.courseName } })
}
</script>

<style scoped>
.search-bar {
  margin-bottom: 16px;
}
</style>
