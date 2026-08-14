<!-- src/views/teacher/Announcement.vue -->
<!-- 公告发布，支持发布、编辑、删除与置顶 -->
<template>
  <el-card shadow="never">
    <div class="toolbar">
      <el-button type="primary" :icon="Plus" @click="handlePublish">发布公告</el-button>
    </div>

    <el-table :data="tableData" border stripe style="width: 100%; margin-top: 16px">
      <el-table-column prop="title" label="标题" min-width="200" />
      <el-table-column prop="scope" label="范围" width="200" />
      <el-table-column prop="publishTime" label="发布时间" width="170" />
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="置顶" width="90" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.top" type="danger" size="small">置顶</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="warning" link size="small" @click="handleToggleTop(row)">{{ row.top ? '取消置顶' : '置顶' }}</el-button>
          <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 发布/编辑公告弹窗 -->
    <el-dialog v-model="dialogVisible" :title="editMode ? '编辑公告' : '发布公告'" width="560px">
      <el-form :model="form" label-width="90px">
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入公告标题" />
        </el-form-item>
        <el-form-item label="接收范围">
          <el-select v-model="form.scopeType" placeholder="请选择接收范围类型" style="width: 100%">
            <el-option label="按班级" value="班级" />
            <el-option label="按课程" value="课程" />
          </el-select>
        </el-form-item>
        <el-form-item label="范围对象">
          <el-select v-model="form.scopeValue" placeholder="请选择范围对象" style="width: 100%">
            <el-option v-for="item in scopeOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="form.content" type="textarea" :rows="5" placeholder="请输入公告内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 范围对象选项
const scopeOptions = ref([
  '计算机2301班',
  '计算机2302班',
  '软件2301班',
  '数据结构',
  '计算机网络',
  '软件工程'
])

// mock 公告列表
// TODO: 对接后端 公告列表接口
const tableData = ref([
  { id: 1, title: '数据结构期中考试安排通知', scope: '数据结构', publishTime: '2025-10-20 09:00:00', status: '已发布', top: true },
  { id: 2, title: '计算机网络实验报告提交说明', scope: '计算机网络', publishTime: '2025-10-18 14:30:00', status: '已发布', top: false },
  { id: 3, title: '软件工程课程分组通知', scope: '软件2301班', publishTime: '2025-10-15 16:00:00', status: '草稿', top: false }
])

// 状态 tag 类型
const statusTagType = (status) => {
  if (status === '已发布') return 'success'
  if (status === '草稿') return 'info'
  return 'warning'
}

// 弹窗
const dialogVisible = ref(false)
const editMode = ref(false)
const form = reactive({
  id: null,
  title: '',
  scopeType: '',
  scopeValue: '',
  content: ''
})

// 发布
const handlePublish = () => {
  editMode.value = false
  form.id = null
  form.title = ''
  form.scopeType = ''
  form.scopeValue = ''
  form.content = ''
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  editMode.value = true
  form.id = row.id
  form.title = row.title
  form.scopeType = row.scope.includes('班') ? '班级' : '课程'
  form.scopeValue = row.scope
  form.content = ''
  dialogVisible.value = true
}

// 确认
const handleConfirm = () => {
  if (!form.title) {
    ElMessage.warning('请输入公告标题')
    return
  }
  if (!form.scopeValue) {
    ElMessage.warning('请选择接收范围')
    return
  }
  // TODO: 对接后端 公告发布/编辑接口
  if (editMode.value) {
    const row = tableData.value.find((item) => item.id === form.id)
    if (row) {
      row.title = form.title
      row.scope = form.scopeValue
    }
    ElMessage.success('公告编辑成功')
  } else {
    tableData.value.unshift({
      id: Date.now(),
      title: form.title,
      scope: form.scopeValue,
      publishTime: new Date().toLocaleString(),
      status: '已发布',
      top: false
    })
    ElMessage.success('公告发布成功')
  }
  dialogVisible.value = false
}

// 置顶/取消置顶
const handleToggleTop = (row) => {
  // TODO: 对接后端 公告置顶接口
  row.top = !row.top
  ElMessage.success(row.top ? '已置顶' : '已取消置顶')
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认要删除公告【${row.title}】吗？`, '删除确认', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // TODO: 对接后端 公告删除接口
      const idx = tableData.value.findIndex((item) => item.id === row.id)
      if (idx !== -1) {
        tableData.value.splice(idx, 1)
      }
      ElMessage.success('删除成功')
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: flex-end;
}
</style>
