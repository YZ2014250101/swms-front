<!-- src/views/admin/StudentManage.vue -->
<!-- 学生账号管理，支持增删改查、批量导入、重置密码、启用/禁用 -->
<template>
  <el-card shadow="never">
    <!-- 搜索栏 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="学号">
        <el-input v-model="searchForm.studentId" placeholder="请输入学号" clearable />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
      </el-form-item>
      <el-form-item label="专业">
        <el-input v-model="searchForm.major" placeholder="请输入专业" clearable />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 120px">
          <el-option label="正常" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作栏 -->
    <div class="toolbar">
      <el-button type="success" :icon="Upload" @click="openImport">批量导入</el-button>
      <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
    </div>

    <!-- 列表 -->
    <el-table :data="filteredList" border stripe v-loading="loading" style="width: 100%; margin-top: 16px">
      <el-table-column prop="studentId" label="学号" width="130" />
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="gender" label="性别" width="80" align="center" />
      <el-table-column prop="age" label="年龄" width="80" align="center" />
      <el-table-column prop="major" label="专业" min-width="140" />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column label="状态" width="90" align="center">
        <template #default="{ row }">
          <el-tag :type="Number(row.status) === 1 ? 'success' : 'danger'">{{ Number(row.status) === 1 ? '正常' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="warning" link size="small" @click="handleResetPwd(row)">重置密码</el-button>
          <el-button :type="Number(row.status) === 1 ? 'info' : 'success'" link size="small" @click="handleToggleStatus(row)">{{ Number(row.status) === 1 ? '禁用' : '启用' }}</el-button>
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
    <el-dialog v-model="dialogVisible" :title="editMode ? '编辑学生' : '新增学生'" width="520px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学号" prop="studentId">
          <el-input v-model="form.studentId" placeholder="请输入学号" :disabled="editMode" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item v-if="!editMode" label="密码" prop="password">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio value="男">男</el-radio>
            <el-radio value="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="form.age" :min="0" :max="120" controls-position="right" />
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="form.major" placeholder="请输入专业" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleConfirm">确认</el-button>
      </template>
    </el-dialog>

    <!-- 批量导入弹窗 -->
    <el-dialog v-model="importDialog" title="批量导入学生" width="480px" @close="handleImportClose">
      <el-upload drag accept=".xlsx,.xls" :auto-upload="false" :limit="1" :on-change="onFileChange" :on-remove="onFileRemove" ref="uploadRef">
        <el-icon class="el-icon--upload"><Upload /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">仅支持 .xlsx / .xls 格式，请先下载模板填写</div>
        </template>
      </el-upload>
      <template #footer>
        <el-button @click="importDialog = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleImport">确认导入</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Upload } from '@element-plus/icons-vue'
import { getStudentList, addStudent, toEditStudent, updateStudent, updateStuStatus, resetStuPwd, deleteStudent, importStudent } from '@/api/modules/admin/user'

const loading = ref(false)
const submitting = ref(false)
const tableData = ref([])

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getStudentList()
    tableData.value = res.data.stuList || []
  } catch (e) {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}

onMounted(fetchList)

// 搜索
const searchForm = reactive({ studentId: '', name: '', major: '', status: '' })
const filteredList = computed(() => {
  return tableData.value.filter((row) => {
    if (searchForm.studentId && !(row.studentId || '').includes(searchForm.studentId)) return false
    if (searchForm.name && !(row.name || '').includes(searchForm.name)) return false
    if (searchForm.major && !(row.major || '').includes(searchForm.major)) return false
    if (searchForm.status !== '' && Number(row.status) !== Number(searchForm.status)) return false
    return true
  })
})
const handleSearch = () => {
  page.current = 1
}
const handleReset = () => {
  searchForm.studentId = ''
  searchForm.name = ''
  searchForm.major = ''
  searchForm.status = ''
}

// 分页
const page = reactive({ current: 1, size: 10 })

// 弹窗
const dialogVisible = ref(false)
const editMode = ref(false)
const formRef = ref(null)
const form = reactive({
  id: null,
  studentId: '',
  username: '',
  password: '',
  name: '',
  gender: '男',
  age: '',
  major: ''
})
const rules = {
  studentId: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }]
}

const resetForm = () => {
  form.id = null
  form.studentId = ''
  form.username = ''
  form.password = ''
  form.name = ''
  form.gender = '男'
  form.age = ''
  form.major = ''
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
    const res = await toEditStudent(row.id)
    const stu = res.data.stu || {}
    form.id = stu.id
    form.studentId = stu.studentId || ''
    form.username = stu.username || ''
    form.name = stu.name || ''
    form.gender = stu.gender || '男'
    form.age = stu.age ?? ''
    form.major = stu.major || ''
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
      if (editMode.value) {
        await updateStudent({
          id: form.id,
          studentId: form.studentId,
          username: form.username,
          name: form.name,
          gender: form.gender,
          age: form.age,
          major: form.major
        })
        ElMessage.success('编辑成功')
      } else {
        await addStudent({
          studentId: form.studentId,
          username: form.username,
          password: form.password,
          name: form.name,
          gender: form.gender,
          age: form.age,
          major: form.major
        })
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

// 重置密码
const handleResetPwd = (row) => {
  ElMessageBox.confirm(`确认重置学生【${row.name}】的密码为默认密码吗？`, '重置密码', {
    confirmButtonText: '确认重置',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await resetStuPwd(row.id)
        ElMessage.success('密码已重置')
      } catch (e) {}
    })
    .catch(() => {})
}

// 启用/禁用
const handleToggleStatus = (row) => {
  const newStatus = Number(row.status) === 1 ? 0 : 1
  updateStuStatus(row.id, newStatus)
    .then(() => {
      row.status = newStatus
      ElMessage.success(newStatus === 1 ? '已启用' : '已禁用')
    })
    .catch(() => {})
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认要删除学生【${row.name}】吗？`, '删除确认', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await deleteStudent(row.id)
        ElMessage.success('删除成功')
        fetchList()
      } catch (e) {}
    })
    .catch(() => {})
}

// 批量导入
const importDialog = ref(false)
const importFile = ref(null)
const uploadRef = ref(null)
const openImport = () => {
  importFile.value = null
  importDialog.value = true
}
const onFileChange = (file) => {
  importFile.value = file.raw
}
const onFileRemove = () => {
  importFile.value = null
}
const handleImportClose = () => {
  importFile.value = null
  uploadRef.value?.clearFiles()
}
const handleImport = async () => {
  if (!importFile.value) {
    ElMessage.warning('请先选择文件')
    return
  }
  const fd = new FormData()
  fd.append('file', importFile.value)
  submitting.value = true
  try {
    await importStudent(fd)
    ElMessage.success('导入成功')
    importDialog.value = false
    fetchList()
  } catch (e) {
    // 拦截器已提示
  } finally {
    submitting.value = false
  }
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
