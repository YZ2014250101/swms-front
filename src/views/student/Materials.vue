<!-- src/views/student/Materials.vue -->
<!-- 课程资料下载，左侧选课程，右侧展示资料列表 -->
<!-- 接口：getHomeworkCourseList（@/api/modules/student/homework）+ getCourseDetail / downloadMaterial（@/api/modules/student/course） -->
<template>
  <el-card shadow="never">
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

    <el-table :data="fileList" v-loading="loading" border stripe style="width: 100%; margin-top: 16px">
      <el-table-column prop="fileName" label="资料名称" min-width="260" />
      <el-table-column prop="uploadTime" label="上传时间" width="180" align="center" />
      <el-table-column label="操作" width="120" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link :icon="Download" @click="handleDownload(row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-if="!loading && fileList.length === 0" description="暂无课程资料" :image-size="80" style="margin-top: 16px" />
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import { getHomeworkCourseList } from '@/api/modules/student/homework'
import { getCourseDetail, downloadMaterial } from '@/api/modules/student/course'

const loading = ref(false)
const selectedCourse = ref('')

// 课程下拉（来自后端我的作业课程列表）
const courseList = ref([])
// 当前课程资料列表（来自后端课程详情）
const fileList = ref([])

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

// 加载课程下拉
const loadCourseList = async () => {
  loading.value = true
  try {
    const res = await getHomeworkCourseList()
    courseList.value = res.data?.courseList || []
    // 默认选中第一门课程并加载资料
    if (courseList.value.length > 0) {
      selectedCourse.value = courseList.value[0].id
      await loadFileList(selectedCourse.value)
      return
    }
  } catch (err) {
    console.error('获取课程列表失败', err)
  } finally {
    loading.value = false
  }
}

// 根据课程加载资料
const loadFileList = async (courseId) => {
  if (!courseId) {
    fileList.value = []
    return
  }
  loading.value = true
  try {
    const res = await getCourseDetail(courseId)
    fileList.value = res.data?.fileList || []
  } catch (err) {
    console.error('获取课程资料失败', err)
  } finally {
    loading.value = false
  }
}

// 切换课程
const handleCourseChange = (courseId) => {
  loadFileList(courseId)
}

// 下载
const handleDownload = async (row) => {
  try {
    const response = await downloadMaterial(row.id)
    downloadBlob(response, row.fileName || '资料')
    ElMessage.success('下载成功')
  } catch (err) {
    console.error('下载失败', err)
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
</style>
