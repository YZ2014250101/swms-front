<!-- src/views/student/Materials.vue -->
<!-- 课程资料下载，左侧选课程，右侧展示资料列表 -->
<template>
  <el-card shadow="never">
    <div class="filter-bar">
      <span class="label">选择课程：</span>
      <el-select v-model="selectedCourse" placeholder="请选择课程" style="width: 260px" @change="handleCourseChange">
        <el-option v-for="item in courseList" :key="item.id" :label="item.courseName" :value="item.id" />
      </el-select>
    </div>

    <el-table :data="tableData" border stripe style="width: 100%; margin-top: 16px">
      <el-table-column prop="name" label="资料名称" min-width="200" />
      <el-table-column prop="type" label="类型" width="100" align="center">
        <template #default="{ row }">
          <el-tag>{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="uploader" label="上传教师" width="120" />
      <el-table-column prop="uploadTime" label="上传时间" width="170" />
      <el-table-column prop="size" label="大小" width="100" align="center" />
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link :icon="Download" @click="handleDownload(row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 16px; justify-content: flex-end"
      v-model:current-page="page.current"
      v-model:page-size="page.size"
      :total="page.total"
      layout="total, prev, pager, next"
    />
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'

// 课程下拉
// TODO: 对接后端 我的课程列表接口
const courseList = ref([
  { id: 1, courseName: '数据结构' },
  { id: 2, courseName: '计算机网络' },
  { id: 3, courseName: '软件工程' }
])

const selectedCourse = ref('')

// 分页参数
const page = reactive({
  current: 1,
  size: 10,
  total: 4
})

// mock 资料列表
// TODO: 对接后端 课程资料列表接口，参数 courseId
const tableData = ref([
  { id: 1, name: '数据结构 第一章 绪论.pdf', type: 'PDF', uploader: '张伟', uploadTime: '2025-09-01 10:20:30', size: '2.3MB' },
  { id: 2, name: '数据结构 实验指导书.docx', type: 'DOC', uploader: '张伟', uploadTime: '2025-09-05 14:10:00', size: '880KB' },
  { id: 3, name: '数据结构 历年真题.zip', type: 'ZIP', uploader: '张伟', uploadTime: '2025-10-10 09:00:00', size: '5.1MB' },
  { id: 4, name: '数据结构 课件第三章.pptx', type: 'PPT', uploader: '张伟', uploadTime: '2025-10-15 16:30:00', size: '3.7MB' }
])

// 切换课程
const handleCourseChange = () => {
  // TODO: 对接后端 课程资料列表接口
  ElMessage.success('课程已切换')
}

// 下载
const handleDownload = (row) => {
  // TODO: 对接后端 资料下载接口
  ElMessage.info(`下载【${row.name}】接口待对接`)
}
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
