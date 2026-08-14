<!-- src/views/teacher/Attendance.vue -->
<!-- 课堂考勤，按课程与日期登记学生出勤状态，支持手动登记与提交 -->
<template>
  <el-card shadow="never">
    <el-form :inline="true" :model="queryForm" class="search-bar">
      <el-form-item label="课程">
        <el-select v-model="queryForm.courseId" placeholder="请选择课程" clearable style="width: 220px" @change="handleQuery">
          <el-option v-for="item in courseOptions" :key="item.id" :label="item.courseName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker v-model="queryForm.date" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 180px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="studentNo" label="学号" width="130" />
      <el-table-column prop="name" label="姓名" width="110" />
      <el-table-column label="出勤状态" width="160" align="center">
        <template #default="{ row }">
          <el-select v-model="row.status" placeholder="请选择" size="small" style="width: 120px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="200">
        <template #default="{ row }">
          <el-input v-model="row.remark" placeholder="请输入备注" size="small" clearable />
        </template>
      </el-table-column>
    </el-table>

    <div class="footer-bar">
      <el-button type="success" :icon="Check" @click="handleSubmit">提交考勤</el-button>
    </div>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Check } from '@element-plus/icons-vue'
import { getAttendanceManagement, attendanceCheck, batchSaveAttendance } from '@/api/modules/teacher/attendance'
import { onMounted } from 'vue'

// 课程下拉：来自考勤管理首页
const courseOptions = ref([])

// 出勤状态选项
const statusOptions = [
  { label: '出勤', value: '出勤' },
  { label: '迟到', value: '迟到' },
  { label: '早退', value: '早退' },
  { label: '缺勤', value: '缺勤' }
]

const queryForm = reactive({
  courseId: '',
  date: ''
})

const loading = ref(false)
const tableData = ref([])

// 拉取课程下拉
const fetchCourses = async () => {
  try {
    const res = await getAttendanceManagement()
    courseOptions.value = res.data?.courseList || []
  } catch (e) {
    // 拦截器已提示
  }
}

// 拉取考勤名单
const fetchAttendance = async () => {
  if (!queryForm.courseId) {
    ElMessage.warning('请先选择课程')
    return
  }
  loading.value = true
  try {
    const res = await attendanceCheck(queryForm.courseId)
    const data = res.data || {}
    const attendanceList = data.attendanceList || []
    // 将已有考勤记录合并到学生行，默认状态"出勤"
    tableData.value = (data.studentList || []).map((stu) => {
      const record = attendanceList.find((a) => (a.studentId || a.studentNo) === (stu.studentId || stu.studentNo))
      return {
        ...stu,
        status: record?.status || '出勤',
        remark: record?.remark || ''
      }
    })
  } catch (e) {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}

// 查询
const handleQuery = () => {
  fetchAttendance()
}

// 提交考勤
const handleSubmit = async () => {
  if (!queryForm.courseId) {
    ElMessage.warning('请先选择课程')
    return
  }
  if (!queryForm.date) {
    ElMessage.warning('请先选择日期')
    return
  }
  if (tableData.value.length === 0) {
    ElMessage.warning('没有可提交的考勤记录')
    return
  }
  try {
    await batchSaveAttendance({
      studentIds: tableData.value.map((r) => r.studentId || r.id),
      courseId: queryForm.courseId,
      attendanceDate: queryForm.date,
      statuses: tableData.value.map((r) => r.status)
    })
    ElMessage.success(`已提交 ${tableData.value.length} 名学生的考勤记录`)
    fetchAttendance()
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
.footer-bar {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
