<!-- src/views/admin/TeacherManage.vue -->
<!-- 教师账号管理，支持增删改查、权限分配、注销 -->
<template>
  <el-card shadow="never">
    <!-- 搜索栏 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="工号">
        <el-input v-model="searchForm.teacherNo" placeholder="请输入工号" clearable />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
      </el-form-item>
      <el-form-item label="院系">
        <el-select v-model="searchForm.deptId" placeholder="请选择院系" clearable>
          <el-option v-for="item in deptOptions" :key="item.value" :label="item.label" :value="item.value" />
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
      <el-table-column prop="teacherNo" label="工号" width="120" />
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="gender" label="性别" width="80" align="center" />
      <el-table-column prop="deptName" label="院系" width="160" />
      <el-table-column prop="title" label="职称" width="110" />
      <el-table-column prop="phone" label="手机号" width="130" />
      <el-table-column label="状态" width="90" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === '在职' ? 'success' : 'info'">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="warning" link size="small" @click="handlePermission(row)">权限分配</el-button>
          <el-button type="danger" link size="small" @click="handleCancel(row)">注销</el-button>
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
    <el-dialog v-model="dialogVisible" :title="editMode ? '编辑教师' : '新增教师'" width="520px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工号" prop="teacherNo">
          <el-input v-model="form.teacherNo" placeholder="请输入工号" :disabled="editMode" />
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
        <el-form-item label="院系" prop="deptId">
          <el-select v-model="form.deptId" placeholder="请选择院系" style="width: 100%">
            <el-option v-for="item in deptOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="职称" prop="title">
          <el-select v-model="form.title" placeholder="请选择职称" style="width: 100%">
            <el-option label="教授" value="教授" />
            <el-option label="副教授" value="副教授" />
            <el-option label="讲师" value="讲师" />
            <el-option label="助教" value="助教" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </template>
    </el-dialog>

    <!-- 权限分配弹窗 -->
    <el-dialog v-model="permDialog" title="权限分配" width="420px">
      <div class="perm-tip">为教师【{{ currentTeacher.name }}】分配角色权限：</div>
      <el-checkbox-group v-model="permForm.roles">
        <el-checkbox v-for="r in roleOptions" :key="r.value" :value="r.value" :label="r.label" />
      </el-checkbox-group>
      <template #footer>
        <el-button @click="permDialog = false">取消</el-button>
        <el-button type="primary" @click="handlePermConfirm">确认</el-button>
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

// 角色选项
const roleOptions = ref([
  { value: 'teacher', label: '教师' },
  { value: 'headTeacher', label: '班主任' },
  { value: 'courseAdmin', label: '课程管理员' }
])

// mock 教师列表
// TODO: 对接后端 教师列表接口
const tableData = ref([
  { id: 1, teacherNo: 'T1001', name: '刘老师', gender: '男', deptId: 1, deptName: '计算机学院', title: '教授', phone: '13900139001', email: 'liu@edu.cn', status: '在职' },
  { id: 2, teacherNo: 'T1002', name: '陈老师', gender: '女', deptId: 2, deptName: '软件学院', title: '副教授', phone: '13900139002', email: 'chen@edu.cn', status: '在职' },
  { id: 3, teacherNo: 'T1003', name: '杨老师', gender: '男', deptId: 1, deptName: '计算机学院', title: '讲师', phone: '13900139003', email: 'yang@edu.cn', status: '离职' }
])

// 搜索
const searchForm = reactive({ teacherNo: '', name: '', deptId: '' })
const handleSearch = () => {
  // TODO: 对接后端 教师列表查询接口
  ElMessage.success('查询成功')
}
const handleReset = () => {
  searchForm.teacherNo = ''
  searchForm.name = ''
  searchForm.deptId = ''
}

// 分页
const page = reactive({ current: 1, size: 10, total: 3 })

// 弹窗
const dialogVisible = ref(false)
const editMode = ref(false)
const formRef = ref(null)
const form = reactive({
  id: null,
  teacherNo: '',
  name: '',
  gender: '男',
  deptId: '',
  title: '',
  phone: '',
  email: ''
})
const rules = {
  teacherNo: [{ required: true, message: '请输入工号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  deptId: [{ required: true, message: '请选择院系', trigger: 'change' }],
  title: [{ required: true, message: '请选择职称', trigger: 'change' }],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }],
  email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }]
}

const handleAdd = () => {
  editMode.value = false
  form.id = null
  form.teacherNo = ''
  form.name = ''
  form.gender = '男'
  form.deptId = ''
  form.title = ''
  form.phone = ''
  form.email = ''
  dialogVisible.value = true
}

const handleEdit = (row) => {
  editMode.value = true
  form.id = row.id
  form.teacherNo = row.teacherNo
  form.name = row.name
  form.gender = row.gender
  form.deptId = row.deptId
  form.title = row.title
  form.phone = row.phone
  form.email = row.email
  dialogVisible.value = true
}

const handleConfirm = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    const deptName = deptOptions.value.find((d) => d.value === form.deptId)?.label || ''
    // TODO: 对接后端 教师新增/编辑接口
    if (editMode.value) {
      const row = tableData.value.find((item) => item.id === form.id)
      if (row) {
        Object.assign(row, { name: form.name, gender: form.gender, deptId: form.deptId, deptName, title: form.title, phone: form.phone, email: form.email })
      }
      ElMessage.success('编辑成功')
    } else {
      tableData.value.unshift({
        id: Date.now(),
        teacherNo: form.teacherNo,
        name: form.name,
        gender: form.gender,
        deptId: form.deptId,
        deptName,
        title: form.title,
        phone: form.phone,
        email: form.email,
        status: '在职'
      })
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
  })
}

// 权限分配
const permDialog = ref(false)
const currentTeacher = reactive({ id: null, name: '' })
const permForm = reactive({ roles: [] })
const handlePermission = (row) => {
  currentTeacher.id = row.id
  currentTeacher.name = row.name
  permForm.roles = []
  // TODO: 对接后端 教师已有权限查询接口
  permDialog.value = true
}
const handlePermConfirm = () => {
  // TODO: 对接后端 教师权限分配接口
  permDialog.value = false
  ElMessage.success('权限分配成功')
}

// 注销
const handleCancel = (row) => {
  ElMessageBox.confirm(`确认要注销教师【${row.name}】的账号吗？`, '注销确认', {
    confirmButtonText: '确认注销',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // TODO: 对接后端 教师注销接口
      row.status = '离职'
      ElMessage.success('已注销')
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
.perm-tip {
  margin-bottom: 12px;
  color: #606266;
}
</style>
