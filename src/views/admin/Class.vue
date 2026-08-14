<!-- src/views/admin/Class.vue -->
<!-- 班级管理，支持院系+专业级联筛选、增删改查 -->
<template>
  <el-card shadow="never">
    <!-- 搜索栏 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="所属院系">
        <el-select v-model="searchForm.deptId" placeholder="请选择院系" clearable @change="handleDeptChange">
          <el-option v-for="item in deptOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="所属专业">
        <el-select v-model="searchForm.majorId" placeholder="请选择专业" clearable :disabled="!searchForm.deptId">
          <el-option v-for="item in filteredMajorOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="班级名称">
        <el-input v-model="searchForm.name" placeholder="请输入班级名称" clearable />
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
      <el-table-column prop="classNo" label="班级编号" width="130" />
      <el-table-column prop="name" label="班级名称" min-width="150" />
      <el-table-column prop="majorName" label="所属专业" width="160" />
      <el-table-column prop="grade" label="年级" width="100" align="center" />
      <el-table-column prop="counselor" label="辅导员" width="110" />
      <el-table-column prop="count" label="人数" width="90" align="center" />
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
    <el-dialog v-model="dialogVisible" :title="editMode ? '编辑班级' : '新增班级'" width="480px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="班级编号" prop="classNo">
          <el-input v-model="form.classNo" placeholder="请输入班级编号" :disabled="editMode" />
        </el-form-item>
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入班级名称" />
        </el-form-item>
        <el-form-item label="所属专业" prop="majorId">
          <el-select v-model="form.majorId" placeholder="请选择专业" style="width: 100%">
            <el-option v-for="item in majorOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-select v-model="form.grade" placeholder="请选择年级" style="width: 100%">
            <el-option v-for="y in gradeOptions" :key="y" :label="y + '级'" :value="y" />
          </el-select>
        </el-form-item>
        <el-form-item label="辅导员" prop="counselor">
          <el-input v-model="form.counselor" placeholder="请输入辅导员姓名" />
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
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'

// 院系下拉
// TODO: 对接后端 院系下拉列表接口
const deptOptions = ref([
  { value: 1, label: '计算机学院' },
  { value: 2, label: '软件学院' }
])

// 专业下拉（含 deptId 用于级联）
// TODO: 对接后端 专业下拉列表接口
const majorOptions = ref([
  { value: 1, label: '计算机科学与技术', deptId: 1 },
  { value: 2, label: '网络工程', deptId: 1 },
  { value: 3, label: '软件工程', deptId: 2 }
])

// 级联：根据所选院系过滤专业
const filteredMajorOptions = computed(() => {
  if (!searchForm.deptId) return majorOptions.value
  return majorOptions.value.filter((m) => m.deptId === searchForm.deptId)
})
const handleDeptChange = () => {
  searchForm.majorId = ''
}

// 年级选项
const gradeOptions = ref([2021, 2022, 2023, 2024])

// mock 班级列表
// TODO: 对接后端 班级列表接口
const tableData = ref([
  { id: 1, classNo: 'C001', name: '计算机2301班', majorId: 1, majorName: '计算机科学与技术', grade: 2023, counselor: '王老师', count: 40 },
  { id: 2, classNo: 'C002', name: '计算机2302班', majorId: 1, majorName: '计算机科学与技术', grade: 2023, counselor: '王老师', count: 38 },
  { id: 3, classNo: 'C003', name: '软件2301班', majorId: 3, majorName: '软件工程', grade: 2023, counselor: '李老师', count: 35 },
  { id: 4, classNo: 'C004', name: '网络2201班', majorId: 2, majorName: '网络工程', grade: 2022, counselor: '赵老师', count: 36 }
])

// 搜索
const searchForm = reactive({ deptId: '', majorId: '', name: '' })
const handleSearch = () => {
  // TODO: 对接后端 班级列表查询接口
  ElMessage.success('查询成功')
}
const handleReset = () => {
  searchForm.deptId = ''
  searchForm.majorId = ''
  searchForm.name = ''
}

// 分页
const page = reactive({ current: 1, size: 10, total: 4 })

// 弹窗
const dialogVisible = ref(false)
const editMode = ref(false)
const formRef = ref(null)
const form = reactive({ id: null, classNo: '', name: '', majorId: '', grade: '', counselor: '' })
const rules = {
  classNo: [{ required: true, message: '请输入班级编号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入班级名称', trigger: 'blur' }],
  majorId: [{ required: true, message: '请选择所属专业', trigger: 'change' }],
  grade: [{ required: true, message: '请选择年级', trigger: 'change' }],
  counselor: [{ required: true, message: '请输入辅导员姓名', trigger: 'blur' }]
}

const handleAdd = () => {
  editMode.value = false
  form.id = null
  form.classNo = ''
  form.name = ''
  form.majorId = ''
  form.grade = ''
  form.counselor = ''
  dialogVisible.value = true
}

const handleEdit = (row) => {
  editMode.value = true
  form.id = row.id
  form.classNo = row.classNo
  form.name = row.name
  form.majorId = row.majorId
  form.grade = row.grade
  form.counselor = row.counselor
  dialogVisible.value = true
}

const handleConfirm = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    const majorName = majorOptions.value.find((m) => m.value === form.majorId)?.label || ''
    // TODO: 对接后端 班级新增/编辑接口
    if (editMode.value) {
      const row = tableData.value.find((item) => item.id === form.id)
      if (row) {
        row.classNo = form.classNo
        row.name = form.name
        row.majorId = form.majorId
        row.majorName = majorName
        row.grade = form.grade
        row.counselor = form.counselor
      }
      ElMessage.success('编辑成功')
    } else {
      tableData.value.unshift({
        id: Date.now(),
        classNo: form.classNo,
        name: form.name,
        majorId: form.majorId,
        majorName,
        grade: form.grade,
        counselor: form.counselor,
        count: 0
      })
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
  })
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认要删除班级【${row.name}】吗？`, '删除确认', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // TODO: 对接后端 班级删除接口
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
