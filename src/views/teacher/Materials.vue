<!-- src/views/teacher/Materials.vue -->
<!-- 课程资料管理：后端文档教师端暂无资料管理接口，页面以空表格 + el-empty 占位 -->
<template>
  <el-card shadow="never">
    <el-alert title="教师资料管理（后端暂未提供接口）" type="info" show-icon :closable="false" style="margin-bottom: 16px" />

    <el-form :inline="true" :model="queryForm" class="search-bar">
      <el-form-item label="课程">
        <el-select v-model="queryForm.courseId" placeholder="请选择课程" clearable style="width: 220px" @change="handleCourseChange">
          <el-option v-for="item in courseOptions" :key="item.id" :label="item.courseName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Upload" @click="handleUpload">上传资料</el-button>
      </el-form-item>
    </el-form>

    <!-- 后端暂未提供接口，空表格占位 -->
    <el-empty description="教师资料管理（后端暂未提供接口）" />

    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="name" label="资料名称" min-width="200" />
      <el-table-column prop="category" label="分类" width="120" align="center">
        <template #default="{ row }">
          <el-tag>{{ row.category }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="size" label="大小" width="100" align="center" />
      <el-table-column prop="uploadTime" label="上传时间" width="170" />
      <el-table-column label="操作" width="160" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link :icon="Download" size="small" @click="handleDownload(row)">下载</el-button>
          <el-button type="danger" link :icon="Delete" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 上传资料弹窗 -->
    <el-dialog v-model="uploadDialog" title="上传资料" width="520px">
      <el-form :model="uploadForm" label-width="90px">
        <el-form-item label="资料名称">
          <el-input v-model="uploadForm.name" placeholder="请输入资料名称" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="uploadForm.category" placeholder="请选择分类" style="width: 100%">
            <el-option v-for="item in categoryOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属课程">
          <el-select v-model="uploadForm.courseId" placeholder="请选择课程" style="width: 100%">
            <el-option v-for="item in courseOptions" :key="item.id" :label="item.courseName" :value="item.id" />
          </el-select>
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
              <div class="el-upload__tip">单个文件不超过 50MB</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="uploadDialog = false">取消</el-button>
        <el-button type="primary" @click="handleUploadConfirm">确认上传</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload, Download, Delete } from '@element-plus/icons-vue'

// 课程下拉（保留 UI，后端无资料管理接口）
const courseOptions = ref([])

// 分类选项
const categoryOptions = ref(['课件', '教案', '习题', '实验指导', '其他'])

const queryForm = reactive({
  courseId: ''
})

// 后端暂无教师资料管理接口，表格保留为空
const tableData = ref([])

// 切换课程
const handleCourseChange = () => {
  // 后端暂未提供接口
  ElMessage.info('后端暂未提供资料管理接口')
}

// 上传弹窗
const uploadDialog = ref(false)
const fileList = ref([])
const uploadForm = reactive({
  name: '',
  category: '',
  courseId: ''
})

const handleUpload = () => {
  uploadForm.name = ''
  uploadForm.category = ''
  uploadForm.courseId = queryForm.courseId
  fileList.value = []
  uploadDialog.value = true
}

// 超出限制
const handleExceed = () => {
  ElMessage.warning('只能上传 1 个文件，请先移除已选文件')
}

// 确认上传
const handleUploadConfirm = () => {
  // 后端暂未提供资料管理接口
  ElMessage.info('后端暂未提供资料管理接口')
  uploadDialog.value = false
}

// 下载
const handleDownload = (row) => {
  ElMessage.info('后端暂未提供资料管理接口')
}

// 删除（二次确认）
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认要删除资料【${row.name}】吗？删除后无法恢复。`, '删除确认', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      ElMessage.info('后端暂未提供资料管理接口')
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}
</script>

<style scoped>
.search-bar {
  margin-bottom: 16px;
}
</style>
