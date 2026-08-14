<!-- src/views/teacher/SelectionStats.vue -->
<!-- 选课学生统计与监控，含统计卡片与选课明细 -->
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
        <el-button type="success" :icon="Download" @click="handleExport">导出</el-button>
      </el-form-item>
    </el-form>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value">{{ stats.selectedCount }}</div>
          <div class="stat-title">已选人数</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value">{{ stats.capacity }}</div>
          <div class="stat-title">课程容量</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value">{{ selectionRate }}%</div>
          <div class="stat-title">选课率</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 选课学生明细 -->
    <el-table :data="tableData" border stripe style="width: 100%; margin-top: 16px" v-loading="loading">
      <el-table-column prop="studentNo" label="学号" width="130" />
      <el-table-column prop="name" label="姓名" width="110" />
      <el-table-column prop="className" label="班级" width="160" />
      <el-table-column prop="selectTime" label="选课时间" min-width="180" />
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Download } from '@element-plus/icons-vue'
import { getTeacherCourses } from '@/api/modules/teacher/course'
import { getCourseStudents } from '@/api/modules/teacher/student'
import { exportStudentList } from '@/api/modules/teacher/score'
import { onMounted } from 'vue'

// 课程下拉
const courseOptions = ref([])

const queryForm = reactive({
  courseId: ''
})

const loading = ref(false)
const tableData = ref([])

// 统计数据：选课人数取 studentList.length，课程容量取 course.maxNum
const stats = reactive({
  selectedCount: 0,
  capacity: 0
})
const currentCourse = ref({})

// 选课率
const selectionRate = computed(() => {
  if (stats.capacity === 0) return 0
  return ((stats.selectedCount / stats.capacity) * 100).toFixed(1)
})

// blob 下载通用函数
function downloadBlob(response, filename) {
  const blob = new Blob([response.data])
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  window.URL.revokeObjectURL(url)
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

// 拉取选课学生明细
const fetchStats = async () => {
  if (!queryForm.courseId) {
    ElMessage.warning('请先选择课程')
    return
  }
  loading.value = true
  try {
    const res = await getCourseStudents(queryForm.courseId)
    const data = res.data || {}
    tableData.value = data.studentList || []
    currentCourse.value = data.course || {}
    stats.selectedCount = tableData.value.length
    stats.capacity = currentCourse.value?.maxNum || 0
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

// 导出
const handleExport = async () => {
  if (!queryForm.courseId) {
    ElMessage.warning('请先选择课程')
    return
  }
  try {
    const response = await exportStudentList(queryForm.courseId)
    const name = `选课名单_${currentCourse.value?.courseName || queryForm.courseId}.csv`
    downloadBlob(response, name)
    ElMessage.success('导出成功')
  } catch (e) {
    // 拦截器已提示
  }
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
  color: #165DFF;
}
.stat-title {
  font-size: 14px;
  color: #909399;
  margin-top: 6px;
}
</style>
