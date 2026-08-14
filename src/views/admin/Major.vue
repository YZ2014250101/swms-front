<!-- src/views/admin/Major.vue -->
<!-- 专业管理，支持按院系筛选、增删改查 -->
<template>
  <el-card shadow="never">
    <!-- 搜索栏 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="所属院系">
        <el-select v-model="searchForm.deptId" placeholder="请选择院系" clearable>
          <el-option v-for="item in deptOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="专业名称">
        <el-input v-model="searchForm.name" placeholder="请输入专业名称" clearable />
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
      <el-table-column prop="majorNo" label="专业编号" width="130" />
      <el-table-column prop="name" label="专业名称" min-width="180" />
      <el-table-column prop="deptName" label="所属院系" width="160" />
      <el-table-column prop="duration" label="学制" width="100" align="center" />
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
      :total="page.total"
      layout="total, sizes, prev, pager, next, jumper"
      background
    />

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="editMode ? '编辑专业' : '新增专业'" width="480px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="专业编号" prop="majorNo">
          <el-input v-model="form.majorNo" placeholder="请输入专业编号" :disabled="editMode" />
        </el-form-item>
        <el-form-item label="专业名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入专业名称" />
        </el-form-item>
        <el-form-item label="所属院系" prop="deptId">
          <el-select v-model="form.deptId" placeholder="请选择所属院系" style="width: 100%">
            <el-option v-for="item in deptOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="学制" prop="duration">
          <el-select v-model="form.duration" placeholder="请选择学制" style="width: 100%">
            <el-option label="三年制" :value="3" />
            <el-option label="四年制" :value="4" />
            <el-option label="五年制" :value="5" />
          </el-select>
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

// 院系下拉
// TODO: 对接后端 院系下拉列表接口
const deptOptions = ref([
  { value: 1, label: '计算机学院' },
  { value: 2, label: '软件学院' },
  { value: 3, label: '信息工程学院' }
])

// mock 专业列表
// TODO: 对接后端 专业列表接口
const tableData = ref([
  { id: 1, majorNo: 'M001', name: '计算机科学与技术', deptId: 1, deptName: '计算机学院', duration: 4 },
  { id: 2, majorNo: 'M002', name: '软件工程', deptId: 2, deptName: '软件学院', duration: 4 },
  { id: 3, majorNo: 'M003', name: '网络工程', deptId: 1, deptName: '计算机学院', duration: 4 },
  { id: 4, majorNo: 'M004', name: '信息管理', deptId: 3, deptName: '信息工程学院', duration: 3 }
])

// 搜索
const searchForm = reactive({ deptId: '', name: '' })
const handleSearch = () => {
  // TODO: 对接后端 专业列表查询接口
  ElMessage.success('查询成功')
}
const handleReset = () => {
  searchForm.deptId = ''
  searchForm.name = ''
}

// 分页
const page = reactive({ current: 1, size: 10, total: 4 })

// 弹窗
const dialogVisible = ref(false)
const editMode = ref(false)
const formRef = ref(null)
const form = reactive({ id: null, majorNo: '', name: '', deptId: '', duration: '' })
const rules = {
  majorNo: [{ required: true, message: '请输入专业编号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入专业名称', trigger: 'blur' }],
  deptId: [{ required: true, message: '请选择所属院系', trigger: 'change' }],
  duration: [{ required: true, message: '请选择学制', trigger: 'change' }]
}

const handleAdd = () => {
  editMode.value = false
  form.id = null
  form.majorNo = ''
  form.name = ''
  form.deptId = ''
  form.duration = ''
  dialogVisible.value = true
}

const handleEdit = (row) => {
  editMode.value = true
  form.id = row.id
  form.majorNo = row.majorNo
  form.name = row.name
  form.deptId = row.deptId
  form.duration = row.duration
  dialogVisible.value = true
}

const handleConfirm = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    const deptName = deptOptions.value.find((d) => d.value === form.deptId)?.label || ''
    // TODO: 对接后端 专业新增/编辑接口
    if (editMode.value) {
      const row = tableData.value.find((item) => item.id === form.id)
      if (row) {
        row.majorNo = form.majorNo
        row.name = form.name
        row.deptId = form.deptId
        row.deptName = deptName
        row.duration = form.duration
      }
      ElMessage.success('编辑成功')
    } else {
      tableData.value.unshift({
        id: Date.now(),
        majorNo: form.majorNo,
        name: form.name,
        deptId: form.deptId,
        deptName,
        duration: form.duration
      })
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
  })
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认要删除专业【${row.name}】吗？`, '删除确认', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // TODO: 对接后端 专业删除接口
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
