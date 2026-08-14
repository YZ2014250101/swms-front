<!-- src/views/admin/Department.vue -->
<!-- 院系管理，支持增删改查 -->
<template>
  <el-card shadow="never">
    <!-- 搜索栏 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="院系名称">
        <el-input v-model="searchForm.name" placeholder="请输入院系名称" clearable />
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
    <el-table :data="filteredList" border stripe v-loading="loading" style="width: 100%; margin-top: 16px">
      <el-table-column prop="code" label="院系编号" width="140" />
      <el-table-column prop="name" label="院系名称" min-width="180" />
      <el-table-column prop="description" label="描述" min-width="200" />
      <el-table-column prop="createTime" label="创建时间" width="170" />
      <el-table-column label="操作" width="160" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      v-model:current-page="page.current"
      v-model:page-size="page.size"
      :page-sizes="[10, 20, 50]"
      :total="filteredList.length"
      layout="total, sizes, prev, pager, next, jumper"
      background
    />

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="editMode ? '编辑院系' : '新增院系'" width="480px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="院系编号" prop="code">
          <el-input v-model="form.code" placeholder="请输入院系编号" />
        </el-form-item>
        <el-form-item label="院系名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入院系名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入院系描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleConfirm">确认</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { getDepartmentList, addDepartment, toEditDepartment, updateDepartment, deleteDepartment } from '@/api/modules/admin/department'

const loading = ref(false)
const submitting = ref(false)
const tableData = ref([])

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getDepartmentList()
    tableData.value = res.data.deptList || []
  } catch (e) {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}

onMounted(fetchList)

// 搜索
const searchForm = reactive({ name: '' })
const filteredList = computed(() => {
  return tableData.value.filter((row) => {
    if (searchForm.name && !(row.name || '').includes(searchForm.name)) return false
    return true
  })
})
const handleSearch = () => {
  page.current = 1
}
const handleReset = () => {
  searchForm.name = ''
}

// 分页
const page = reactive({ current: 1, size: 10 })

// 弹窗
const dialogVisible = ref(false)
const editMode = ref(false)
const formRef = ref(null)
const form = reactive({ id: null, code: '', name: '', description: '' })
const rules = {
  name: [{ required: true, message: '请输入院系名称', trigger: 'blur' }]
}

const resetForm = () => {
  form.id = null
  form.code = ''
  form.name = ''
  form.description = ''
}

const handleAdd = () => {
  editMode.value = false
  resetForm()
  dialogVisible.value = true
}

const handleEdit = async (row) => {
  editMode.value = true
  resetForm()
  try {
    const res = await toEditDepartment(row.id)
    const dept = res.data.department || {}
    form.id = dept.id
    form.code = dept.code || ''
    form.name = dept.name || ''
    form.description = dept.description || ''
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
      const payload = { code: form.code, name: form.name, description: form.description }
      if (editMode.value) {
        await updateDepartment({ id: form.id, ...payload })
        ElMessage.success('编辑成功')
      } else {
        await addDepartment(payload)
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

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认要删除院系【${row.name}】吗？`, '删除确认', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await deleteDepartment(row.id)
        ElMessage.success('删除成功')
        fetchList()
      } catch (e) {}
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
