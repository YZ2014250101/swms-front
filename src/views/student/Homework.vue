<!-- src/views/student/Homework.vue -->
<!-- 我的作业，支持查看详情、提交、补交，提交弹窗含上传 -->
<!-- 接口：getHomeworkCourseList / getHomeworkByCourse / getHomeworkDetail / doSubmitHomework / downloadHomework（@/api/modules/student/homework） -->
<template>
  <el-card shadow="never">
    <!-- 课程选择 -->
    <div class="filter-bar">
      <span class="label">选择课程：</span>
      <el-select
        v-model="selectedCourse"
        placeholder="请选择课程"
        clearable
        style="width: 260px"
        @change="handleCourseChange"
      >
        <el-option v-for="item in courseList" :key="item.id" :label="item.courseName" :value="item.id" />
      </el-select>
    </div>

    <el-table :data="homeworkList" v-loading="loading" border stripe style="width: 100%; margin-top: 16px">
      <el-table-column prop="title" label="作业名称" min-width="180" />
      <el-table-column prop="deadline" label="截止时间" width="170" />
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.status)">{{ statusText(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="得分" width="90" align="center">
        <template #default="{ row }">
          <span v-if="row.score !== null && row.score !== undefined && row.score !== ''" :style="{ color: Number(row.score) >= 60 ? '#67c23a' : '#f56c6c' }">{{ row.score }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleDetail(row)">查看详情</el-button>
          <el-button v-if="row.attachmentName" type="info" link size="small" @click="handleDownload(row)">下载附件</el-button>
          <el-button
            v-if="canSubmit(row.status)"
            :type="row.status === '已提交' ? 'warning' : 'success'"
            link
            size="small"
            @click="handleSubmit(row)"
          >{{ row.status === '已提交' ? '补交' : '提交' }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-if="!loading && homeworkList.length === 0" description="暂无作业" :image-size="80" style="margin-top: 16px" />

    <!-- 查看详情弹窗 -->
    <el-dialog v-model="detailVisible" title="作业详情" width="640px">
      <div v-loading="detailLoading">
        <template v-if="detailHomework">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="作业名称" :span="2">{{ detailHomework.title }}</el-descriptions-item>
            <el-descriptions-item label="截止时间">{{ detailHomework.deadline }}</el-descriptions-item>
            <el-descriptions-item label="满分">{{ detailHomework.totalScore }}</el-descriptions-item>
            <el-descriptions-item label="作业描述" :span="2">{{ detailHomework.description }}</el-descriptions-item>
            <el-descriptions-item label="附件">{{ detailHomework.attachmentName || '无' }}</el-descriptions-item>
          </el-descriptions>

          <h3 class="section-title">我的提交</h3>
          <el-descriptions v-if="detailSubmission" :column="2" border>
            <el-descriptions-item label="提交内容" :span="2">{{ detailSubmission.content || '无' }}</el-descriptions-item>
            <el-descriptions-item label="提交文件">{{ detailSubmission.fileName || '无' }}</el-descriptions-item>
            <el-descriptions-item label="提交时间">{{ detailSubmission.submitTime || '-' }}</el-descriptions-item>
            <el-descriptions-item label="得分">{{ detailSubmission.score ?? '-' }}</el-descriptions-item>
            <el-descriptions-item label="评语">{{ detailSubmission.comment || '-' }}</el-descriptions-item>
          </el-descriptions>
          <el-empty v-else description="尚未提交" :image-size="60" />
        </template>
      </div>
    </el-dialog>

    <!-- 提交作业弹窗 -->
    <el-dialog v-model="dialogVisible" title="提交作业" width="560px">
      <el-form :model="submitForm" label-width="90px">
        <el-form-item label="作业名称">
          <el-input v-model="submitForm.title" disabled />
        </el-form-item>
        <el-form-item label="作业内容">
          <el-input
            v-model="submitForm.content"
            type="textarea"
            :rows="4"
            placeholder="可填写作业说明（可选）"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="上传文件">
          <el-upload
            v-model:file-list="fileList"
            action="#"
            :auto-upload="false"
            :limit="1"
            :on-exceed="handleExceed"
          >
            <el-button type="primary" :icon="Upload">选择文件</el-button>
            <template #tip>
              <div class="el-upload__tip">仅支持上传 1 个文件，单个文件不超过 20MB</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmitConfirm">确认提交</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import {
  getHomeworkCourseList,
  getHomeworkByCourse,
  getHomeworkDetail,
  doSubmitHomework,
  downloadHomework
} from '@/api/modules/student/homework'

const loading = ref(false)
const selectedCourse = ref('')

// 课程下拉
const courseList = ref([])
// 作业列表
const homeworkList = ref([])

// 状态文案
const statusText = (status) => {
  if (!status) return '未提交'
  const map = { '未提交': '未提交', '已提交': '已提交', '已批改': '已批改' }
  return map[status] || status
}
// 状态 tag 类型
const statusTagType = (status) => {
  if (status === '已批改') return 'success'
  if (status === '已提交') return 'warning'
  return 'info'
}
// 是否可提交/补交
const canSubmit = (status) => status !== '已批改'

// 加载课程下拉
const loadCourseList = async () => {
  try {
    const res = await getHomeworkCourseList()
    courseList.value = res.data?.courseList || []
    if (courseList.value.length > 0) {
      selectedCourse.value = courseList.value[0].id
      await loadHomeworkList(selectedCourse.value)
    }
  } catch (err) {
    console.error('获取课程列表失败', err)
  }
}

// 加载某课程作业列表
const loadHomeworkList = async (courseId) => {
  if (!courseId) {
    homeworkList.value = []
    return
  }
  loading.value = true
  try {
    const res = await getHomeworkByCourse(courseId)
    homeworkList.value = res.data?.homeworkList || []
  } catch (err) {
    console.error('获取作业列表失败', err)
  } finally {
    loading.value = false
  }
}

// 切换课程
const handleCourseChange = (courseId) => {
  loadHomeworkList(courseId)
}

// 查看详情
const detailVisible = ref(false)
const detailLoading = ref(false)
const detailHomework = ref(null)
const detailSubmission = ref(null)

const handleDetail = async (row) => {
  detailVisible.value = true
  detailLoading.value = true
  detailHomework.value = null
  detailSubmission.value = null
  try {
    const res = await getHomeworkDetail(row.id)
    const data = res.data || {}
    detailHomework.value = data.homework || null
    detailSubmission.value = data.submission || null
  } catch (err) {
    console.error('获取作业详情失败', err)
  } finally {
    detailLoading.value = false
  }
}

// 下载附件
function downloadBlob(response, filename) {
  const blob = new Blob([response.data])
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

const handleDownload = async (row) => {
  try {
    const response = await downloadHomework(row.id)
    downloadBlob(response, row.attachmentName || '作业附件')
    ElMessage.success('下载成功')
  } catch (err) {
    console.error('下载失败', err)
  }
}

// 提交弹窗
const dialogVisible = ref(false)
const submitting = ref(false)
const fileList = ref([])
const submitForm = reactive({
  homeworkId: '',
  title: '',
  content: ''
})

const handleSubmit = (row) => {
  submitForm.homeworkId = row.id
  submitForm.title = row.title
  submitForm.content = ''
  fileList.value = []
  dialogVisible.value = true
}

// 超出文件数量限制
const handleExceed = () => {
  ElMessage.warning('只能上传 1 个文件，请先移除已选文件')
}

// 确认提交
const handleSubmitConfirm = async () => {
  if (!submitForm.content && fileList.value.length === 0) {
    ElMessage.warning('请填写作业内容或上传文件')
    return
  }
  const fd = new FormData()
  fd.append('homeworkId', submitForm.homeworkId)
  if (submitForm.content) fd.append('content', submitForm.content)
  if (fileList.value[0]?.raw) fd.append('file', fileList.value[0].raw)

  submitting.value = true
  try {
    await doSubmitHomework(fd)
    ElMessage.success('作业提交成功')
    dialogVisible.value = false
    await loadHomeworkList(selectedCourse.value)
  } catch (err) {
    console.error('作业提交失败', err)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadCourseList()
})
</script>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
}
.label {
  font-size: 14px;
  color: #606266;
  margin-right: 8px;
}
.section-title {
  margin: 16px 0 8px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}
</style>
