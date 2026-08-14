<!-- src/views/student/Homework.vue -->
<!-- 我的作业，支持查看详情、提交、补交，提交弹窗含上传 -->
<template>
  <el-card shadow="never">
    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="name" label="作业名称" min-width="180" />
      <el-table-column prop="courseName" label="所属课程" width="140" />
      <el-table-column prop="deadline" label="截止时间" width="170" />
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="得分" width="90" align="center">
        <template #default="{ row }">
          <span v-if="row.score !== null" :style="{ color: row.score >= 60 ? '#67c23a' : '#f56c6c' }">{{ row.score }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleDetail(row)">查看详情</el-button>
          <el-button
            v-if="row.status === '未提交'"
            type="success"
            link
            size="small"
            @click="handleSubmit(row)"
          >提交</el-button>
          <el-button
            v-if="row.status === '已提交'"
            type="warning"
            link
            size="small"
            @click="handleSubmit(row)"
          >补交</el-button>
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

    <!-- 提交作业弹窗 -->
    <el-dialog v-model="dialogVisible" title="提交作业" width="520px">
      <el-form :model="submitForm" label-width="90px">
        <el-form-item label="作业名称">
          <el-input v-model="submitForm.name" disabled />
        </el-form-item>
        <el-form-item label="所属课程">
          <el-input v-model="submitForm.courseName" disabled />
        </el-form-item>
        <el-form-item label="上传作业">
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
        <el-button type="primary" @click="handleSubmitConfirm">确认提交</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'

const page = reactive({
  current: 1,
  size: 10,
  total: 4
})

// mock 作业数据
// TODO: 对接后端 我的作业列表接口
const tableData = ref([
  { id: 1, name: '实验一 线性表实现', courseName: '数据结构', deadline: '2025-09-20 23:59:59', status: '已批改', score: 88 },
  { id: 2, name: '第二章 课后习题', courseName: '计算机网络', deadline: '2025-10-05 23:59:59', status: '已提交', score: null },
  { id: 3, name: '需求分析报告', courseName: '软件工程', deadline: '2025-10-15 23:59:59', status: '未提交', score: null },
  { id: 4, name: '实验二 栈与队列', courseName: '数据结构', deadline: '2025-10-20 23:59:59', status: '未提交', score: null }
])

// 状态 tag 类型
const statusTagType = (status) => {
  if (status === '已批改') return 'success'
  if (status === '已提交') return 'warning'
  return 'info'
}

// 查看详情
const handleDetail = (row) => {
  // TODO: 对接后端 作业详情接口
  ElMessage.info(`作业【${row.name}】详情待对接`)
}

// 提交弹窗
const dialogVisible = ref(false)
const fileList = ref([])
const submitForm = reactive({
  id: null,
  name: '',
  courseName: ''
})

const handleSubmit = (row) => {
  submitForm.id = row.id
  submitForm.name = row.name
  submitForm.courseName = row.courseName
  fileList.value = []
  dialogVisible.value = true
}

// 超出文件数量限制
const handleExceed = () => {
  ElMessage.warning('只能上传 1 个文件，请先移除已选文件')
}

// 确认提交
const handleSubmitConfirm = () => {
  if (fileList.value.length === 0) {
    ElMessage.warning('请先选择要上传的文件')
    return
  }
  // TODO: 对接后端 作业提交接口
  const row = tableData.value.find((item) => item.id === submitForm.id)
  if (row) {
    row.status = '已提交'
  }
  dialogVisible.value = false
  ElMessage.success('作业提交成功')
}
</script>

<style scoped>
</style>
