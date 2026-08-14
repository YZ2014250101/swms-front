<!-- src/views/teacher/ScoreImport.vue -->
<!-- 成绩批量导入导出，支持上传 Excel、下载模板、导入后预览与导出 -->
<template>
  <el-card shadow="never">
    <!-- 课程选择 + 操作区 -->
    <el-form :inline="true" :model="queryForm" class="search-bar">
      <el-form-item label="课程">
        <el-select v-model="queryForm.courseId" placeholder="请选择课程" clearable style="width: 260px">
          <el-option v-for="item in courseOptions" :key="item.id" :label="item.courseName" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>

    <div class="upload-area">
      <el-upload
        ref="uploadRef"
        action="#"
        :auto-upload="false"
        accept=".xlsx,.xls"
        :limit="1"
        :on-change="handleFileChange"
        :on-exceed="handleExceed"
      >
        <el-button type="primary" :icon="Upload">上传 Excel</el-button>
        <template #tip>
          <div class="el-upload__tip">仅支持 .xlsx、.xls 格式文件，请先下载模板按格式填写</div>
        </template>
      </el-upload>
      <el-button type="success" :icon="Download" @click="handleDownloadTemplate" style="margin-left: 12px">下载模板</el-button>
      <el-button type="warning" :icon="Check" @click="handleImport" style="margin-left: 12px">导入数据</el-button>
      <el-button type="primary" :icon="Download" @click="handleExport" style="margin-left: 12px">导出成绩</el-button>
    </div>

    <!-- 预览表格 -->
    <el-table :data="tableData" border stripe style="width: 100%; margin-top: 16px" v-loading="loading">
      <el-table-column prop="studentNo" label="学号" width="130" />
      <el-table-column prop="name" label="姓名" width="110" />
      <el-table-column prop="className" label="班级" width="160" />
      <el-table-column prop="dailyScore" label="平时成绩" width="100" align="center" />
      <el-table-column prop="finalScore" label="期末成绩" width="100" align="center" />
      <el-table-column label="综合成绩" width="110" align="center">
        <template #default="{ row }">{{ calcTotal(row) }}</template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload, Download, Check } from '@element-plus/icons-vue'
import { getTeacherCourses } from '@/api/modules/teacher/course'
import { downloadGradeTemplate, importGrade, exportGrade, gradeInput } from '@/api/modules/teacher/score'
import { onMounted } from 'vue'

const uploadRef = ref()
const loading = ref(false)
const tableData = ref([])
const currentFile = ref(null)

// 课程下拉
const courseOptions = ref([])
const queryForm = reactive({ courseId: '' })

// blob 下载通用函数
function downloadBlob(response, filename) {
  const blob = new Blob([response.data])
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  window.URL.revokeObjectURL(url)
}

// 综合成绩 = 平时*0.3 + 期末*0.7
const calcTotal = (row) => {
  const daily = Number(row.dailyScore) || 0
  const final = Number(row.finalScore) || 0
  return Math.round((daily * 0.3 + final * 0.7) * 10) / 10
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

// 文件选择
const handleFileChange = (file) => {
  currentFile.value = file.raw
}

// 超出限制
const handleExceed = () => {
  ElMessage.warning('只能上传 1 个文件，请先移除已选文件')
}

// 下载模板
const handleDownloadTemplate = async () => {
  try {
    const response = await downloadGradeTemplate()
    downloadBlob(response, '成绩导入模板.xlsx')
    ElMessage.success('模板下载成功')
  } catch (e) {
    // 拦截器已提示
  }
}

// 导入数据
const handleImport = async () => {
  if (!queryForm.courseId) {
    ElMessage.warning('请先选择课程')
    return
  }
  if (!currentFile.value) {
    ElMessage.warning('请先选择要导入的文件')
    return
  }
  loading.value = true
  try {
    const formData = new FormData()
    formData.append('file', currentFile.value)
    formData.append('courseId', queryForm.courseId)
    await importGrade(formData)
    ElMessage.success('导入成功')
    // 导入后调 gradeInput 刷新预览
    await fetchPreview()
    // 清空已选文件
    uploadRef.value?.clearFiles()
    currentFile.value = null
  } catch (e) {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}

// 导入后预览：调 gradeInput 拿学生成绩列表
const fetchPreview = async () => {
  if (!queryForm.courseId) return
  try {
    const res = await gradeInput(queryForm.courseId)
    const data = res.data || {}
    tableData.value = (data.studentList || []).map((item) => ({
      ...item,
      dailyScore: item.dailyScore ?? item.usualScore ?? 0,
      finalScore: item.finalScore ?? item.examScore ?? 0
    }))
  } catch (e) {
    // 拦截器已提示
  }
}

// 导出成绩
const handleExport = async () => {
  if (!queryForm.courseId) {
    ElMessage.warning('请先选择课程')
    return
  }
  try {
    const response = await exportGrade(queryForm.courseId)
    const name = `成绩_${queryForm.courseId}.csv`
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
  margin-bottom: 12px;
}
.upload-area {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
</style>
