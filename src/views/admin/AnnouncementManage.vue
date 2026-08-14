<!-- src/views/admin/AnnouncementManage.vue -->
<!-- 公告系统管理，支持增删改查、置顶、状态管理 -->
<template>
  <el-card shadow="never">
    <!-- 搜索栏 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="标题">
        <el-input v-model="searchForm.title" placeholder="请输入标题" clearable />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="searchForm.category" placeholder="请选择分类" clearable>
          <el-option v-for="item in categoryOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作栏 -->
    <div class="toolbar">
      <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
    </div>

    <!-- 列表 -->
    <el-table :data="tableData" border stripe style="width: 100%; margin-top: 16px">
      <el-table-column prop="title" label="标题" min-width="220" />
      <el-table-column prop="category" label="分类" width="120" />
      <el-table-column prop="publisher" label="发布人" width="110" />
      <el-table-column prop="publishTime" label="发布时间" width="170" />
      <el-table-column label="状态" width="110" align="center">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row)">{{ statusText(row) }}</el-tag>
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

    <el-pagination
      class="pagination"
      v-model:current-page="page.current"
      v-model:page-size="page.size"
      :page-sizes="[10, 20, 50]"
      :total="page.total"
      layout="total, sizes, prev, pager, next, jumper"
      background
    />

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="editMode ? '编辑公告' : '新增公告'" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入公告标题" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类" style="width: 100%">
            <el-option v-for="item in categoryOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="6" placeholder="请输入公告内容" />
        </el-form-item>
        <el-form-item label="是否置顶" prop="top">
          <el-switch v-model="form.top" active-text="置顶" inactive-text="不置顶" />
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
import { Search, Refresh, Plus } from '@element-plus/icons-vue'

// 公告分类
const categoryOptions = ref(['系统公告', '教务通知', '活动通知', '考试通知'])

// mock 公告列表
// TODO: 对接后端 公告列表接口
const tableData = ref([
  { id: 1, title: '2025-2026学年第一学期开学通知', category: '系统公告', publisher: '管理员', publishTime: '2025-08-25 09:00:00', status: '已发布', top: true },
  { id: 2, title: '期中考试安排通知', category: '考试通知', publisher: '管理员', publishTime: '2025-11-01 14:00:00', status: '已发布', top: false },
  { id: 3, title: '校园文化活动周安排', category: '活动通知', publisher: '管理员', publishTime: '2025-10-10 10:30:00', status: '草稿', top: false },
  { id: 4, title: '选课系统开放通知', category: '教务通知', publisher: '管理员', publishTime: '2025-08-20 16:00:00', status: '已发布', top: false }
])

// 状态 tag 类型
const statusTagType = (row) => {
  if (row.top) return 'danger'
  if (row.status === '已发布') return 'success'
  return 'info'
}
const statusText = (row) => (row.top ? '已置顶' : row.status)

// 搜索
const searchForm = reactive({ title: '', category: '' })
const handleSearch = () => {
  // TODO: 对接后端 公告列表查询接口
  ElMessage.success('查询成功')
}
const handleReset = () => {
  searchForm.title = ''
  searchForm.category = ''
}

// 分页
const page = reactive({ current: 1, size: 10, total: 4 })

// 弹窗
const dialogVisible = ref(false)
const editMode = ref(false)
const formRef = ref(null)
const form = reactive({ id: null, title: '', category: '', content: '', top: false })
const rules = {
  title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }]
}

const handleAdd = () => {
  editMode.value = false
  form.id = null
  form.title = ''
  form.category = ''
  form.content = ''
  form.top = false
  dialogVisible.value = true
}

const handleEdit = (row) => {
  editMode.value = true
  form.id = row.id
  form.title = row.title
  form.category = row.category
  form.content = ''
  form.top = row.top
  dialogVisible.value = true
}

const handleConfirm = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    // TODO: 对接后端 公告新增/编辑接口
    if (editMode.value) {
      const row = tableData.value.find((item) => item.id === form.id)
      if (row) {
        row.title = form.title
        row.category = form.category
        row.top = form.top
      }
      ElMessage.success('编辑成功')
    } else {
      tableData.value.unshift({
        id: Date.now(),
        title: form.title,
        category: form.category,
        publisher: '管理员',
        publishTime: new Date().toLocaleString(),
        status: '已发布',
        top: form.top
      })
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
  })
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
      if (idx !== -1) tableData.value.splice(idx, 1)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
</script>

<style scoped>
.search-form {
  margin-bottom: 8px;
}
.toolbar {
  display: flex;
  justify-content: flex-end;
}
.pagination {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>
