<!-- src/views/teacher/ScoreImport.vue -->
<!-- 成绩批量导入导出，支持上传 Excel、下载模板、预览与导出 -->
<template>
  <el-card shadow="never">
    <!-- 上传区域 -->
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
    <el-table :data="tableData" border stripe style="width: 100%; margin-top: 16px">
      <el-table-column prop="studentNo" label="学号" width="130" />
      <el-table-column prop="name" label="姓名" width="110" />
      <el-table-column prop="className" label="班级" width="160" />
      <el-table-column prop="usualScore" label="平时成绩" width="100" align="center" />
      <el-table-column prop="examScore" label="期末成绩" width="100" align="center" />
      <el-table-column label="综合成绩" width="110" align="center">
        <template #default="{ row }">
          {{ calcTotal(row) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === '成功' ? 'success' : 'danger'">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload, Download, Check } from '@element-plus/icons-vue'

const uploadRef = ref()

// 预览数据
// TODO: 对接后端 成绩导入预览接口
const tableData = ref([
  { studentNo: '20230101', name: '张三', className: '计算机2301班', usualScore: 85, examScore: 78, status: '成功' },
  { studentNo: '20230102', name: '李四', className: '计算机2301班', usualScore: 90, examScore: 82, status: '成功' },
  { studentNo: '20230103', name: '王芳', className: '计算机2301班', usualScore: 78, examScore: 88, status: '成功' },
  { studentNo: '20230104', name: '刘洋', className: '计算机2301班', usualScore: 70, examScore: 55, status: '成功' }
])

// 综合成绩
const calcTotal = (row) => {
  return Math.round((row.usualScore * 0.3 + row.examScore * 0.7) * 10) / 10
}

// 文件选择
const handleFileChange = (file) => {
  // TODO: 对接后端 Excel 解析接口，返回预览数据
  ElMessage.info(`已选择文件：${file.name}，解析接口待对接`)
}

// 超出限制
const handleExceed = () => {
  ElMessage.warning('只能上传 1 个文件，请先移除已选文件')
}

// 下载模板
const handleDownloadTemplate = () => {
  // TODO: 对接后端 成绩导入模板下载接口
  ElMessage.info('成绩导入模板下载接口待对接')
}

// 导入数据
const handleImport = () => {
  // TODO: 对接后端 成绩批量导入接口
  ElMessage.info('成绩批量导入接口待对接')
}

// 导出成绩
const handleExport = () => {
  // TODO: 对接后端 成绩导出接口
  ElMessage.info('成绩导出接口待对接')
}
</script>

<style scoped>
.upload-area {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
</style>
