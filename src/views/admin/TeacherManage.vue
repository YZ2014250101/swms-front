<!-- src/views/admin/TeacherManage.vue -->
<!-- 教师账号管理，支持增删改查、重置密码、启用/禁用 -->
<template>
  <el-card shadow="never">
    <!-- 搜索栏 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="工号">
        <el-input v-model="searchForm.teacherId" placeholder="请输入工号" clearable />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
      </el-form-item>
      <el-form-item label="院系">
        <el-input v-model="searchForm.department" placeholder="请输入院系" clearable />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 120px">
          <el-option label="在职" :value="1" />
          <el-option label="离职" :value="0" />
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
    <el-table :data="filteredList" border stripe v-loading="loading" style="width: 100%; margin-top: 16px">
      <el-table-column prop="teacherId" label="工号" width="120" />
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="gender" label="性别" width="80" align="center" />
      <el-table-column prop="department" label="院系" min-width="150" />
      <el-table-column prop="title" label="职称" width="110" />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column label="状态" width="90" align="center">
        <template #default="{ row }">
          <el-tag :type="Number(row.status) === 1 ? 'success' : 'info'">{{ Number(row.status) === 1 ? '在职' : '离职' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="warning" link size="small" @click="handleResetPwd(row)">重置密码</el-button>
          <el-button :type="Number(row.status) === 1 ? 'info' : 'success'" link size="small" @click="handleToggleStatus(row)">{{ Number(row.status) === 1 ? '禁用' : '启用' }}</el-button>
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
    <el-dialog v-model="dialogVisible" :title="editMode ? '编辑教师' : '新增教师'" width="520px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工号" prop="teacherId">
          <el-input v-model="form.teacherId" placeholder="请输入工号" :disabled="editMode" />
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
        <el-form-item label="院系" prop="department">
          <el-input v-model="form.department" placeholder="请输入院系" />
        </el-form-item>
        <el-form-item label="职称" prop="title">
          <el-select v-model="form.title" placeholder="请选择职称" style="width: 100%">
            <el-option label="教授" value="教授" />
            <el-option label="副教授" value="副教授" />
            <el-option label="讲师" value="讲师" />
            <el-option label="助教" value="助教" />
          </el-select>
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
import { getTeacherList, addTeacher, toEditTeacher, updateTeacher, updateTeaStatus, resetTeaPwd } from '@/api/modules/admin/user'

const loading = ref(false)
const submitting = ref(false)
const tableData = ref([])

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getTeacherList()
    tableData.value = res.data.teaList || []
  } catch (e) {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}

onMounted(fetchList)

// 搜索
const searchForm = reactive({ teacherId: '', name: '', department: '', status: '' })
const filteredList = computed(() => {
  return tableData.value.filter((row) => {
    if (searchForm.teacherId && !(row.teacherId || '').includes(searchForm.teacherId)) return false
    if (searchForm.name && !(row.name || '').includes(searchForm.name)) return false
    if (searchForm.department && !(row.department || '').includes(searchForm.department)) return false
    if (searchForm.status !== '' && Number(row.status) !== Number(searchForm.status)) return false
    return true
  })
})
const handleSearch = () => {
  page.current = 1
}
const handleReset = () => {
  searchForm.teacherId = ''
  searchForm.name = ''
  searchForm.department = ''
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
  teacherId: '',
  username: '',
  password: '',
  name: '',
  gender: '男',
  age: '',
  department: '',
  title: ''
})
const rules = {
  teacherId: [{ required: true, message: '请输入工号', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }]
}

const resetForm = () => {
  form.id = null
  form.teacherId = ''
  form.username = ''
  form.password = ''
  form.name = ''
  form.gender = '男'
  form.age = ''
  form.department = ''
  form.title = ''
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
    const res = await toEditTeacher(row.id)
    const tea = res.data.tea || {}
    form.id = tea.id
    form.teacherId = tea.teacherId || ''
    form.username = tea.username || ''
    form.name = tea.name || ''
    form.gender = tea.gender || '男'
    form.age = tea.age ?? ''
    form.department = tea.department || ''
    form.title = tea.title || ''
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
        await updateTeacher({
          id: form.id,
          teacherId: form.teacherId,
          username: form.username,
          name: form.name,
          gender: form.gender,
          age: form.age,
          department: form.department,
          title: form.title
        })
        ElMessage.success('编辑成功')
      } else {
        await addTeacher({
          teacherId: form.teacherId,
          username: form.username,
          password: form.password,
          name: form.name,
          age: form.age,
          gender: form.gender,
          department: form.department,
          title: form.title
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
  ElMessageBox.confirm(`确认重置教师【${row.name}】的密码为默认密码吗？`, '重置密码', {
    confirmButtonText: '确认重置',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await resetTeaPwd(row.id)
        ElMessage.success('密码已重置')
      } catch (e) {}
    })
    .catch(() => {})
}

// 启用/禁用
const handleToggleStatus = (row) => {
  const newStatus = Number(row.status) === 1 ? 0 : 1
  updateTeaStatus(row.id, newStatus)
    .then(() => {
      row.status = newStatus
      ElMessage.success(newStatus === 1 ? '已启用' : '已禁用')
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
