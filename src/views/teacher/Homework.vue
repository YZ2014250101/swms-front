<!-- src/views/teacher/Homework.vue -->
<!-- 作业管理，支持按课程查看、发布作业与批改学生提交 -->
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
        <el-button type="success" :icon="Plus" @click="handlePublish">发布作业</el-button>
      </el-form-item>
    </el-form>

    <!-- 已发布作业列表 -->
    <el-table :data="tableData" border stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="title" label="作业名称" min-width="180" />
      <el-table-column prop="courseName" label="课程" width="140" />
      <el-table-column prop="deadline" label="截止时间" width="170" />
      <el-table-column label="已提交" width="100" align="center">
        <template #default="{ row }">
          <el-tag type="success">{{ row.submitted || 0 }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="未提交" width="100" align="center">
        <template #default="{ row }">
          <el-tag type="danger">{{ row.unsubmitted || 0 }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleGrade(row)">批改</el-button>
          <el-button type="success" link size="small" @click="handleDownloadAttachment(row)">下载附件</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 发布作业弹窗 -->
    <el-dialog v-model="publishDialog" title="发布作业" width="520px">
      <el-form :model="publishForm" label-width="90px">
        <el-form-item label="作业标题">
          <el-input v-model="publishForm.title" placeholder="请输入作业标题" />
        </el-form-item>
        <el-form-item label="所属课程">
          <el-select v-model="publishForm.courseId" placeholder="请选择课程" style="width: 100%">
            <el-option v-for="item in courseOptions" :key="item.id" :label="item.courseName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止时间">
          <el-date-picker v-model="publishForm.deadline" type="datetime" placeholder="选择截止时间" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
        </el-form-item>
        <el-form-item label="作业要求">
          <el-input v-model="publishForm.content" type="textarea" :rows="4" placeholder="请输入作业要求" />
        </el-form-item>
        <el-form-item label="附件">
          <el-upload
            ref="publishUploadRef"
            action="#"
            :auto-upload="false"
            :limit="1"
            :on-change="(file) => (publishForm.attachment = file.raw)"
            :on-exceed="() => ElMessage.warning('只能上传 1 个附件')"
          >
            <el-button type="primary" :icon="Upload">选择附件</el-button>
            <template #tip>
              <div class="el-upload__tip">可选，仅支持上传 1 个附件</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="publishDialog = false">取消</el-button>
        <el-button type="primary" @click="handlePublishConfirm">确认发布</el-button>
      </template>
    </el-dialog>

    <!-- 批改弹窗：学生提交列表 -->
    <el-dialog v-model="gradeDialog" title="批改作业" width="820px" v-loading="gradeLoading">
      <div class="grade-header">作业：{{ currentHomework.title }}（{{ currentHomework.courseName }}）</div>
      <el-table :data="submissionList" border stripe style="width: 100%">
        <el-table-column prop="studentNo" label="学号" width="120" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="submitTime" label="提交时间" width="170" />
        <el-table-column label="得分" width="140" align="center">
          <template #default="{ row }">
            <el-input-number v-model="row.score" :min="0" :max="100" :precision="1" controls-position="right" size="small" style="width: 110px" />
          </template>
        </el-table-column>
        <el-table-column label="评语" min-width="160">
          <template #default="{ row }">
            <el-input v-model="row.comment" placeholder="请输入评语" size="small" clearable />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleSaveGrade(row)">保存</el-button>
            <el-button type="success" link size="small" @click="handleDownloadSubmission(row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Search, Upload } from '@element-plus/icons-vue'
import {
  getHomeworkManagement,
  getHomeworkList,
  saveHomework,
  getHomeworkSubmissions,
  saveHomeworkGrade,
  downloadSubmission,
  downloadHomeworkAttachment
} from '@/api/modules/teacher/homework'
import { onMounted } from 'vue'

// 课程下拉：来自作业管理首页
const courseOptions = ref([])

const queryForm = reactive({ courseId: '' })

const loading = ref(false)
const tableData = ref([])

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
    const res = await getHomeworkManagement()
    courseOptions.value = res.data?.courseList || []
  } catch (e) {
    // 拦截器已提示
  }
}

// 拉取课程作业列表
const fetchHomeworkList = async () => {
  if (!queryForm.courseId) {
    ElMessage.warning('请先选择课程')
    return
  }
  loading.value = true
  try {
    const res = await getHomeworkList(queryForm.courseId)
    const data = res.data || {}
    tableData.value = data.homeworkList || []
  } catch (e) {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}

// 查询
const handleQuery = () => {
  fetchHomeworkList()
}

// 发布作业弹窗
const publishDialog = ref(false)
const publishUploadRef = ref()
const publishForm = reactive({
  title: '',
  courseId: '',
  deadline: '',
  content: '',
  attachment: null
})

const handlePublish = () => {
  publishForm.title = ''
  publishForm.courseId = queryForm.courseId
  publishForm.deadline = ''
  publishForm.content = ''
  publishForm.attachment = null
  publishUploadRef.value?.clearFiles()
  publishDialog.value = true
}

// 确认发布
const handlePublishConfirm = async () => {
  if (!publishForm.title) {
    ElMessage.warning('请输入作业标题')
    return
  }
  if (!publishForm.courseId) {
    ElMessage.warning('请选择所属课程')
    return
  }
  try {
    const formData = new FormData()
    formData.append('courseId', publishForm.courseId)
    formData.append('title', publishForm.title)
    formData.append('content', publishForm.content || '')
    formData.append('deadline', publishForm.deadline || '')
    if (publishForm.attachment) {
      formData.append('attachment', publishForm.attachment)
    }
    await saveHomework(formData)
    ElMessage.success('作业发布成功')
    publishDialog.value = false
    if (queryForm.courseId === publishForm.courseId) {
      fetchHomeworkList()
    } else {
      queryForm.courseId = publishForm.courseId
      fetchHomeworkList()
    }
  } catch (e) {
    // 拦截器已提示
  }
}

// 下载作业附件
const handleDownloadAttachment = async (row) => {
  if (!row.id) {
    ElMessage.info('该作业无附件')
    return
  }
  try {
    const response = await downloadHomeworkAttachment(row.id)
    downloadBlob(response, `作业附件_${row.title || row.id}`)
    ElMessage.success('下载成功')
  } catch (e) {
    // 拦截器已提示
  }
}

// 批改弹窗
const gradeDialog = ref(false)
const gradeLoading = ref(false)
const currentHomework = reactive({ id: null, title: '', courseName: '' })
const submissionList = ref([])

const handleGrade = async (row) => {
  currentHomework.id = row.id
  currentHomework.title = row.title
  currentHomework.courseName = row.courseName
  gradeDialog.value = true
  gradeLoading.value = true
  try {
    const res = await getHomeworkSubmissions(row.id)
    const data = res.data || {}
    submissionList.value = (data.submissionList || []).map((item) => ({
      ...item,
      score: item.score ?? 0,
      comment: item.comment || ''
    }))
  } catch (e) {
    // 拦截器已提示
  } finally {
    gradeLoading.value = false
  }
}

// 保存单条批改
const handleSaveGrade = async (row) => {
  try {
    await saveHomeworkGrade(row.submissionId || row.id, row.score, row.comment || '')
    ElMessage.success(`学生【${row.name}】批改已保存，得分：${row.score}`)
  } catch (e) {
    // 拦截器已提示
  }
}

// 下载学生提交
const handleDownloadSubmission = async (row) => {
  const submissionId = row.submissionId || row.id
  if (!submissionId) {
    ElMessage.info('该学生无提交文件')
    return
  }
  try {
    const response = await downloadSubmission(submissionId)
    downloadBlob(response, `学生提交_${row.name || submissionId}`)
    ElMessage.success('下载成功')
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
.grade-header {
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}
</style>
