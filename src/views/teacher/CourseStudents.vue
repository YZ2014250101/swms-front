<!-- src/views/teacher/CourseStudents.vue -->
<!-- 授课班级学生名单查询，支持按课程筛选、导出与按学号添加学生 -->
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
        <el-button type="success" :icon="Download" @click="handleExport">导出名单</el-button>
        <el-button type="warning" :icon="Plus" @click="handleAdd">按学号添加</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="studentNo" label="学号" width="130" />
      <el-table-column prop="name" label="姓名" width="110" />
      <el-table-column prop="gender" label="性别" width="80" align="center" />
      <el-table-column prop="className" label="班级" width="160" />
      <el-table-column prop="phone" label="联系方式" width="150" />
      <el-table-column label="操作" width="120" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleDetail(row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="summary">
      <el-tag type="success" size="large">选课人数：{{ tableData.length }} 人</el-tag>
      <el-tag type="primary" size="large">男生：{{ maleCount }} 人</el-tag>
      <el-tag type="warning" size="large">女生：{{ femaleCount }} 人</el-tag>
    </div>

    <!-- 按学号添加学生弹窗 -->
    <el-dialog v-model="addDialog" title="按学号添加学生到课程" width="460px">
      <el-form :model="addForm" label-width="90px">
        <el-form-item label="课程">
          <el-input :model-value="currentCourseName" disabled />
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="addForm.studentNo" placeholder="请输入学生学号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAddConfirm">确认添加</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Download, Plus } from '@element-plus/icons-vue'
import { getTeacherCourses } from '@/api/modules/teacher/course'
import { getCourseStudents, addStudentToCourse } from '@/api/modules/teacher/student'
import { exportStudentList } from '@/api/modules/teacher/score'
import { onMounted } from 'vue'

const route = useRoute()

// 课程下拉
const courseOptions = ref([])

const queryForm = reactive({
  courseId: route.query.courseId ? Number(route.query.courseId) : ''
})

const loading = ref(false)
const tableData = ref([])
const currentCourse = ref({})

const currentCourseName = computed(() => currentCourse.value?.courseName || '')

// 性别统计
const maleCount = computed(() => tableData.value.filter((item) => item.gender === '男').length)
const femaleCount = computed(() => tableData.value.filter((item) => item.gender === '女').length)

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
    // 路由带 courseId 时自动选中并查询
    if (queryForm.courseId) {
      handleQuery()
    }
  } catch (e) {
    // 拦截器已提示
  }
}

// 拉取学生名单
const fetchStudents = async () => {
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
  } catch (e) {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}

// 查询
const handleQuery = () => {
  fetchStudents()
}

// 导出名单
const handleExport = async () => {
  if (!queryForm.courseId) {
    ElMessage.warning('请先选择课程')
    return
  }
  try {
    const response = await exportStudentList(queryForm.courseId)
    const name = `学生名单_${currentCourseName.value || queryForm.courseId}.csv`
    downloadBlob(response, name)
    ElMessage.success('导出成功')
  } catch (e) {
    // 拦截器已提示
  }
}

// 查看详情
const handleDetail = (row) => {
  ElMessage.info(`学生【${row.name}】详情待对接`)
}

// 添加学生弹窗
const addDialog = ref(false)
const addForm = reactive({ studentNo: '' })

const handleAdd = () => {
  if (!queryForm.courseId) {
    ElMessage.warning('请先选择课程')
    return
  }
  addForm.studentNo = ''
  addDialog.value = true
}

const handleAddConfirm = async () => {
  if (!addForm.studentNo) {
    ElMessage.warning('请输入学生学号')
    return
  }
  try {
    await addStudentToCourse(queryForm.courseId, addForm.studentNo)
    ElMessage.success('添加成功')
    addDialog.value = false
    fetchStudents()
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
.summary {
  margin-top: 16px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
