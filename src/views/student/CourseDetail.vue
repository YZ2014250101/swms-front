<!-- src/views/student/CourseDetail.vue -->
<!-- 课程详情页，通过路由参数 id 加载课程信息 -->
<!-- 接口：getCourseDetail / downloadMaterial（@/api/modules/student/course） -->
<template>
  <el-card shadow="never">
    <div class="header">
      <el-button :icon="ArrowLeft" @click="goBack">返回</el-button>
      <span class="title">课程详情</span>
    </div>

    <div v-loading="loading" style="margin-top: 16px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="课程编号">{{ course.courseNo }}</el-descriptions-item>
        <el-descriptions-item label="课程名称">{{ course.courseName }}</el-descriptions-item>
        <el-descriptions-item label="授课教师">{{ course.teacherName }}</el-descriptions-item>
        <el-descriptions-item label="学分">{{ course.credit }}</el-descriptions-item>
        <el-descriptions-item label="学时">{{ course.hours }}</el-descriptions-item>
        <el-descriptions-item label="上课地点">{{ course.classroom }}</el-descriptions-item>
        <el-descriptions-item v-if="course.assessment" label="考核方式">{{ course.assessment }}</el-descriptions-item>
        <el-descriptions-item v-if="course.examStartTime" label="考试时间">
          {{ course.examStartTime }}<span v-if="course.examEndTime"> ~ {{ course.examEndTime }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="课程简介" :span="2">{{ course.intro }}</el-descriptions-item>
      </el-descriptions>

      <!-- 上课时间 -->
      <h3 class="section-title">上课时间</h3>
      <el-table :data="scheduleList" border stripe style="width: 100%">
        <el-table-column label="星期" width="100" align="center">
          <template #default="{ row }">周{{ weekDayText(row.weekDay) }}</template>
        </el-table-column>
        <el-table-column label="节次" width="140" align="center">
          <template #default="{ row }">第{{ row.startSection }}-{{ row.endSection }}节</template>
        </el-table-column>
        <el-table-column prop="classroom" label="教室" min-width="140" />
        <el-table-column prop="weekRange" label="周次" min-width="140" />
      </el-table>

      <!-- 课程资料 -->
      <h3 class="section-title">课程资料</h3>
      <el-table :data="fileList" border stripe style="width: 100%">
        <el-table-column prop="fileName" label="资料名称" min-width="240" />
        <el-table-column prop="uploadTime" label="上传时间" width="180" align="center" />
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Download" @click="handleDownload(row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!loading && fileList.length === 0" description="暂无课程资料" :image-size="80" />
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Download } from '@element-plus/icons-vue'
import { getCourseDetail, downloadMaterial } from '@/api/modules/student/course'

const route = useRoute()
const router = useRouter()

const courseId = route.params.id

const loading = ref(false)
const course = ref({})
const scheduleList = ref([])
const fileList = ref([])

// 星期数字转中文
const weekDayText = (day) => {
  const map = { 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '日' }
  return map[day] || day || ''
}

// blob 下载辅助
function downloadBlob(response, filename) {
  const blob = new Blob([response.data])
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

// 加载课程详情
const loadDetail = async () => {
  loading.value = true
  try {
    const res = await getCourseDetail(courseId)
    const data = res.data || {}
    course.value = data.course || {}
    scheduleList.value = data.scheduleList || []
    fileList.value = data.fileList || []
  } catch (err) {
    console.error('获取课程详情失败', err)
  } finally {
    loading.value = false
  }
}

// 下载资料
const handleDownload = async (row) => {
  try {
    const response = await downloadMaterial(row.id)
    downloadBlob(response, row.fileName || '资料')
    ElMessage.success('下载成功')
  } catch (err) {
    console.error('下载失败', err)
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

onMounted(() => {
  loadDetail()
})
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
.section-title {
  margin: 20px 0 12px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}
</style>
