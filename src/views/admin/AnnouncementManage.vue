<!-- src/views/admin/AnnouncementManage.vue -->
<!-- 公告系统管理：公告管理、公告审核、分类管理 -->
<template>
  <el-card shadow="never">
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <!-- 公告管理 -->
      <el-tab-pane label="公告管理" name="announce">
        <!-- 搜索栏 -->
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="标题">
            <el-input v-model="searchForm.keyword" placeholder="请输入标题" clearable />
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="searchForm.categoryId" placeholder="请选择分类" clearable>
              <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
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
          <el-button type="danger" :icon="Delete" :disabled="!selectedIds.length" @click="handleBatchDelete">批量删除</el-button>
        </div>

        <!-- 列表 -->
        <el-table :data="tableData" border stripe v-loading="loading" style="width: 100%; margin-top: 16px" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" />
          <el-table-column prop="title" label="标题" min-width="220" />
          <el-table-column label="分类" width="120">
            <template #default="{ row }">{{ row.categoryName || categoryName(row.categoryId) }}</template>
          </el-table-column>
          <el-table-column prop="publisher" label="发布人" width="110" />
          <el-table-column prop="publishTime" label="发布时间" width="170" />
          <el-table-column label="状态" width="110" align="center">
            <template #default="{ row }">
              <el-tag :type="statusTagType(row)">{{ statusText(row) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="320" align="center" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
              <el-button v-if="!row.top" type="warning" link size="small" @click="handleTop(row)">置顶</el-button>
              <el-button v-else type="info" link size="small" @click="handleCancelTop(row)">取消置顶</el-button>
              <el-button type="success" link size="small" @click="handleOnline(row)">上架</el-button>
              <el-button type="warning" link size="small" @click="handleOffline(row)">下架</el-button>
              <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          class="pagination"
          v-model:current-page="page.current"
          v-model:page-size="page.size"
          :page-sizes="[10, 20, 50]"
          :total="tableData.length"
          layout="total, sizes, prev, pager, next, jumper"
          background
        />
      </el-tab-pane>

      <!-- 公告审核 -->
      <el-tab-pane label="公告审核" name="review">
        <el-table :data="reviewList" border stripe v-loading="reviewLoading" style="width: 100%; margin-top: 16px">
          <el-table-column prop="title" label="标题" min-width="220" />
          <el-table-column label="分类" width="120">
            <template #default="{ row }">{{ row.categoryName || categoryName(row.categoryId) }}</template>
          </el-table-column>
          <el-table-column prop="publisher" label="发布人" width="110" />
          <el-table-column prop="publishTime" label="发布时间" width="170" />
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template #default="{ row }">
              <el-button type="success" link size="small" @click="handleApprove(row)">通过</el-button>
              <el-button type="danger" link size="small" @click="handleReject(row)">驳回</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 分类管理 -->
      <el-tab-pane label="分类管理" name="category">
        <div class="toolbar">
          <el-button type="primary" :icon="Plus" @click="handleAddCategory">新增分类</el-button>
        </div>
        <el-table :data="categoryList" border stripe v-loading="categoryLoading" style="width: 100%; margin-top: 16px">
          <el-table-column prop="name" label="分类名称" min-width="200" />
          <el-table-column label="状态" width="120" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '启用' : '禁用' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220" align="center">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="handleEditCategory(row)">编辑</el-button>
              <el-button type="warning" link size="small" @click="handleToggleCategoryStatus(row)">{{ row.status === 1 ? '禁用' : '启用' }}</el-button>
              <el-button type="danger" link size="small" @click="handleDeleteCategory(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 新增/编辑公告弹窗 -->
    <el-dialog v-model="dialogVisible" :title="editMode ? '编辑公告' : '新增公告'" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入公告标题" />
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择分类" style="width: 100%">
            <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="6" placeholder="请输入公告内容" />
        </el-form-item>
        <el-form-item label="是否置顶" prop="top">
          <el-switch v-model="form.top" :active-value="1" :inactive-value="0" active-text="置顶" inactive-text="不置顶" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleConfirm">确认</el-button>
      </template>
    </el-dialog>

    <!-- 驳回弹窗 -->
    <el-dialog v-model="rejectDialogVisible" title="驳回公告" width="500px">
      <el-form ref="rejectFormRef" :model="rejectForm" :rules="rejectRules" label-width="100px">
        <el-form-item label="驳回原因" prop="rejectReason">
          <el-input v-model="rejectForm.rejectReason" type="textarea" :rows="4" placeholder="请输入驳回原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleConfirmReject">确认驳回</el-button>
      </template>
    </el-dialog>

    <!-- 新增/编辑分类弹窗 -->
    <el-dialog v-model="categoryDialogVisible" :title="categoryEditMode ? '编辑分类' : '新增分类'" width="450px">
      <el-form ref="categoryFormRef" :model="categoryForm" :rules="categoryRules" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="categoryDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleConfirmCategory">确认</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Delete } from '@element-plus/icons-vue'
import {
  getAnnouncementList,
  announcementSearch,
  toAddAnnouncement,
  addAnnouncement,
  toEditAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  batchDeleteAnnouncement,
  topAnnouncement,
  cancelTopAnnouncement,
  onlineAnnouncement,
  offlineAnnouncement,
  getReviewList,
  approveAnnouncement,
  toRejectAnnouncement,
  rejectAnnouncement,
  getCategoryList,
  addCategory,
  toEditCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus
} from '@/api/modules/admin/announcement'

const activeTab = ref('announce')
const loading = ref(false)
const submitting = ref(false)
const tableData = ref([])
const categoryList = ref([])
const courseList = ref([])
const selectedIds = ref([])
const page = reactive({ current: 1, size: 10 })

// 审核相关
const reviewLoading = ref(false)
const reviewList = ref([])

// 分类相关
const categoryLoading = ref(false)

// 状态选项
const statusOptions = ref([
  { label: '已发布', value: 1 },
  { label: '草稿', value: 0 },
  { label: '已下架', value: 2 }
])

const categoryName = (id) => {
  if (!id) return ''
  const c = categoryList.value.find((item) => item.id === id)
  return c ? c.name : ''
}

const statusTagType = (row) => {
  if (row.top) return 'danger'
  const s = Number(row.status)
  if (s === 1) return 'success'
  return 'info'
}
const statusText = (row) => {
  if (row.top) return '已置顶'
  const s = Number(row.status)
  if (s === 1) return '已发布'
  if (s === 2) return '已下架'
  if (s === 0) return '草稿'
  return row.status ?? ''
}

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getAnnouncementList()
    tableData.value = res.data.announcementList || []
  } catch (e) {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}

const fetchCategory = async () => {
  categoryLoading.value = true
  try {
    const res = await getCategoryList()
    categoryList.value = res.data.categoryList || []
  } catch (e) {
    // 拦截器已提示
  } finally {
    categoryLoading.value = false
  }
}

const fetchReview = async () => {
  reviewLoading.value = true
  try {
    const res = await getReviewList()
    reviewList.value = res.data.announcementList || []
  } catch (e) {
    // 拦截器已提示
  } finally {
    reviewLoading.value = false
  }
}

onMounted(async () => {
  await fetchList()
  fetchCategory()
})

const handleTabChange = (name) => {
  if (name === 'review') fetchReview()
  else if (name === 'category') fetchCategory()
}

// 搜索
const searchForm = reactive({ keyword: '', categoryId: '', status: '' })
const handleSearch = async () => {
  loading.value = true
  page.current = 1
  try {
    const params = {}
    if (searchForm.categoryId) params.categoryId = searchForm.categoryId
    if (searchForm.status !== '' && searchForm.status !== null) params.status = searchForm.status
    if (searchForm.keyword) params.keyword = searchForm.keyword
    const res = await announcementSearch(params)
    tableData.value = res.data.announcementList || []
    categoryList.value = res.data.categoryList || categoryList.value
  } catch (e) {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.categoryId = ''
  searchForm.status = ''
  fetchList()
}

const handleSelectionChange = (rows) => {
  selectedIds.value = rows.map((r) => r.id)
}

// 公告新增/编辑弹窗
const dialogVisible = ref(false)
const editMode = ref(false)
const formRef = ref(null)
const form = reactive({ id: null, title: '', categoryId: '', content: '', top: 0 })
const rules = {
  title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }]
}

const resetForm = () => {
  form.id = null
  form.title = ''
  form.categoryId = ''
  form.content = ''
  form.top = 0
}

const handleAdd = async () => {
  editMode.value = false
  resetForm()
  try {
    const res = await toAddAnnouncement()
    categoryList.value = res.data.categoryList || categoryList.value
    courseList.value = res.data.courseList || []
  } catch (e) {}
  dialogVisible.value = true
}

const handleEdit = async (row) => {
  editMode.value = true
  resetForm()
  try {
    const res = await toEditAnnouncement(row.id)
    const a = res.data.announcement || {}
    categoryList.value = res.data.categoryList || categoryList.value
    courseList.value = res.data.courseList || []
    form.id = a.id
    form.title = a.title || ''
    form.categoryId = a.categoryId ?? ''
    form.content = a.content || ''
    form.top = a.top ? 1 : 0
    dialogVisible.value = true
  } catch (e) {
    // 拦截器已提示
  }
}

const handleConfirm = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      const payload = {
        title: form.title,
        content: form.content,
        categoryId: form.categoryId,
        top: form.top
      }
      if (editMode.value) {
        await updateAnnouncement({ id: form.id, ...payload })
        ElMessage.success('编辑成功')
      } else {
        await addAnnouncement(payload)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      fetchList()
    } catch (e) {
      // 拦截器已提示
    } finally {
      submitting.value = false
    }
  })
}

// 置顶/取消置顶
const handleTop = async (row) => {
  try {
    await topAnnouncement(row.id)
    ElMessage.success('已置顶')
    fetchList()
  } catch (e) {}
}
const handleCancelTop = async (row) => {
  try {
    await cancelTopAnnouncement(row.id)
    ElMessage.success('已取消置顶')
    fetchList()
  } catch (e) {}
}

// 上架/下架
const handleOnline = async (row) => {
  try {
    await onlineAnnouncement(row.id)
    ElMessage.success('已上架')
    fetchList()
  } catch (e) {}
}
const handleOffline = async (row) => {
  try {
    await offlineAnnouncement(row.id)
    ElMessage.success('已下架')
    fetchList()
  } catch (e) {}
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认要删除公告【${row.title}】吗？`, '删除确认', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await deleteAnnouncement(row.id)
        ElMessage.success('删除成功')
        fetchList()
      } catch (e) {}
    })
    .catch(() => {})
}

// 批量删除
const handleBatchDelete = () => {
  if (!selectedIds.value.length) return
  ElMessageBox.confirm(`确认要删除选中的 ${selectedIds.value.length} 条公告吗？`, '批量删除', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await batchDeleteAnnouncement(selectedIds.value)
        ElMessage.success('删除成功')
        fetchList()
      } catch (e) {}
    })
    .catch(() => {})
}

// ============== 公告审核 ==============
const rejectDialogVisible = ref(false)
const rejectFormRef = ref(null)
const rejectForm = reactive({ id: null, rejectReason: '' })
const rejectRules = {
  rejectReason: [{ required: true, message: '请输入驳回原因', trigger: 'blur' }]
}

const handleApprove = (row) => {
  ElMessageBox.confirm(`确认通过公告【${row.title}】的审核吗？`, '审核通过', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'success'
  })
    .then(async () => {
      try {
        await approveAnnouncement(row.id)
        ElMessage.success('审核通过')
        fetchReview()
      } catch (e) {}
    })
    .catch(() => {})
}

const handleReject = async (row) => {
  rejectForm.id = row.id
  rejectForm.rejectReason = ''
  try {
    await toRejectAnnouncement(row.id)
  } catch (e) {}
  rejectDialogVisible.value = true
}

const handleConfirmReject = () => {
  rejectFormRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      await rejectAnnouncement(rejectForm.id, rejectForm.rejectReason)
      ElMessage.success('已驳回')
      rejectDialogVisible.value = false
      fetchReview()
    } catch (e) {
      // 拦截器已提示
    } finally {
      submitting.value = false
    }
  })
}

// ============== 分类管理 ==============
const categoryDialogVisible = ref(false)
const categoryEditMode = ref(false)
const categoryFormRef = ref(null)
const categoryForm = reactive({ id: null, name: '' })
const categoryRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
}

const handleAddCategory = () => {
  categoryEditMode.value = false
  categoryForm.id = null
  categoryForm.name = ''
  categoryDialogVisible.value = true
}

const handleEditCategory = async (row) => {
  categoryEditMode.value = true
  categoryForm.id = null
  categoryForm.name = ''
  try {
    const res = await toEditCategory(row.id)
    const c = res.data.category || {}
    categoryForm.id = c.id
    categoryForm.name = c.name || ''
    categoryDialogVisible.value = true
  } catch (e) {
    // 拦截器已提示
  }
}

const handleConfirmCategory = () => {
  categoryFormRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      if (categoryEditMode.value) {
        await updateCategory({ id: categoryForm.id, name: categoryForm.name })
        ElMessage.success('编辑成功')
      } else {
        await addCategory({ name: categoryForm.name })
        ElMessage.success('新增成功')
      }
      categoryDialogVisible.value = false
      fetchCategory()
    } catch (e) {
      // 拦截器已提示
    } finally {
      submitting.value = false
    }
  })
}

const handleDeleteCategory = (row) => {
  ElMessageBox.confirm(`确认要删除分类【${row.name}】吗？`, '删除确认', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await deleteCategory(row.id)
        ElMessage.success('删除成功')
        fetchCategory()
      } catch (e) {}
    })
    .catch(() => {})
}

const handleToggleCategoryStatus = async (row) => {
  try {
    await toggleCategoryStatus(row.id)
    ElMessage.success('状态已切换')
    fetchCategory()
  } catch (e) {}
}
</script>

<style scoped>
.search-form {
  margin-bottom: 8px;
}
.toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.pagination {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>
