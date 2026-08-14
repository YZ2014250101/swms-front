<!-- src/views/admin/StudentManage.vue -->
<!-- 学生账号管理，支持增删改查、批量导入、重置密码、启用/禁用 -->
<template>
  <el-card shadow="never">
    <!-- 搜索栏 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="学号">
        <el-input v-model="searchForm.studentNo" placeholder="请输入学号" clearable />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
      </el-form-item>
      <el-form-item label="班级">
        <el-select v-model="searchForm.classId" placeholder="请选择班级" clearable>
          <el-option v-for="item in classOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
          <el-option label="正常" value="正常" />
          <el-option label="禁用" value="禁用" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作栏 -->
    <div class="toolbar">
      <el-button type="success" :icon="Upload" @click="importDialog = true">批量导入</el-button>
      <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
    </div>

    <!-- 列表 -->
    <el-table :data="tableData" border stripe style="width: 100%; margin-top: 16px">
      <el-table-column prop="studentNo" label="学号" width="130" />
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="gender" label="性别" width="80" align="center" />
      <el-table-column prop="className" label="班级" width="140" />
      <el-table-column prop="phone" label="手机号" width="130" />
      <el-table-column label="状态" width="90" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === '正常' ? 'success' : 'danger'">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="warning" link size="small" @click="handleResetPwd(row)">重置密码</el-button>
          <el-button :type="row.status === '正常' ? 'info' : 'success'" link size="small" @click="handleToggleStatus(row)">{{ row.status === '正常' ? '禁用' : '启用' }}</el-button>
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
    <el-dialog v-model="dialogVisible" :title="editMode ? '编辑学生' : '新增学生'" width="520px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学号" prop="studentNo">
          <el-input v-model="form.studentNo" placeholder="请输入学号" :disabled="editMode" />
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
        <el-form-item label="班级" prop="classId">
          <el-select v-model="form.classId" placeholder="请选择班级" style="width: 100%">
            <el-option v-for="item in classOptions" :key="item.value" :label="item.label" :value="item.value" />
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

    <!-- 批量导入弹窗 -->
    <el-dialog v-model="importDialog" title="批量导入学生" width="480px">
      <el-upload drag accept=".xlsx,.xls" :auto-upload="false" :limit="1">
        <el-icon class="el-icon--upload"><Upload /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">仅支持 .xlsx / .xls 格式，请先下载模板填写</div>
        </template>
      </el-upload>
      <template #footer>
        <el-button @click="importDialog = false">取消</el-button>
        <el-button type="primary" @click="handleImport">确认导入</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Upload } from '@element-plus/icons-vue'

// 班级下拉
// TODO: 对接后端 班级下拉列表接口
const classOptions = ref([
  { value: 1, label: '计算机2301班' },
  { value: 2, label: '计算机2302班' },
  { value: 3, label: '软件2301班' }
])

// mock 学生列表
// TODO: 对接后端 学生列表接口
const tableData = ref([
  { id: 1, studentNo: '202300101', name: '张三', gender: '男', classId: 1, className: '计算机2301班', phone: '13800138001', email: 'zhangsan@edu.cn', status: '正常' },
  { id: 2, studentNo: '202300102', name: '李四', gender: '女', classId: 1, className: '计算机2301班', phone: '13800138002', email: 'lisi@edu.cn', status: '正常' },
  { id: 3, studentNo: '202300103', name: '王芳', gender: '女', classId: 2, className: '计算机2302班', phone: '13800138003', email: 'wangfang@edu.cn', status: '禁用' },
  { id: 4, studentNo: '202300201', name: '赵六', gender: '男', classId: 3, className: '软件2301班', phone: '13800138004', email: 'zhaoliu@edu.cn', status: '正常' }
])

// 搜索
const searchForm = reactive({ studentNo: '', name: '', classId: '', status: '' })
const handleSearch = () => {
  // TODO: 对接后端 学生列表查询接口
  ElMessage.success('查询成功')
}
const handleReset = () => {
  searchForm.studentNo = ''
  searchForm.name = ''
  searchForm.classId = ''
  searchForm.status = ''
}

// 分页
const page = reactive({ current: 1, size: 10, total: 4 })

// 弹窗
const dialogVisible = ref(false)
const editMode = ref(false)
const formRef = ref(null)
const form = reactive({
  id: null,
  studentNo: '',
  name: '',
  gender: '男',
  classId: '',
  phone: '',
  email: ''
})
const rules = {
  studentNo: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  classId: [{ required: true, message: '请选择班级', trigger: 'change' }],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }],
  email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }]
}

const handleAdd = () => {
  editMode.value = false
  form.id = null
  form.studentNo = ''
  form.name = ''
  form.gender = '男'
  form.classId = ''
  form.phone = ''
  form.email = ''
  dialogVisible.value = true
}

const handleEdit = (row) => {
  editMode.value = true
  form.id = row.id
  form.studentNo = row.studentNo
  form.name = row.name
  form.gender = row.gender
  form.classId = row.classId
  form.phone = row.phone
  form.email = row.email
  dialogVisible.value = true
}

const handleConfirm = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    const className = classOptions.value.find((c) => c.value === form.classId)?.label || ''
    // TODO: 对接后端 学生新增/编辑接口
    if (editMode.value) {
      const row = tableData.value.find((item) => item.id === form.id)
      if (row) {
        Object.assign(row, { name: form.name, gender: form.gender, classId: form.classId, className, phone: form.phone, email: form.email })
      }
      ElMessage.success('编辑成功')
    } else {
      tableData.value.unshift({
        id: Date.now(),
        studentNo: form.studentNo,
        name: form.name,
        gender: form.gender,
        classId: form.classId,
        className,
        phone: form.phone,
        email: form.email,
        status: '正常'
      })
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
  })
}

// 重置密码
const handleResetPwd = (row) => {
  ElMessageBox.confirm(`确认重置学生【${row.name}】的密码为默认密码吗？`, '重置密码', {
    confirmButtonText: '确认重置',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // TODO: 对接后端 重置学生密码接口
      ElMessage.success('密码已重置')
    })
    .catch(() => {})
}

// 启用/禁用
const handleToggleStatus = (row) => {
  // TODO: 对接后端 学生启用/禁用接口
  row.status = row.status === '正常' ? '禁用' : '正常'
  ElMessage.success(row.status === '正常' ? '已启用' : '已禁用')
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认要删除学生【${row.name}】吗？`, '删除确认', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // TODO: 对接后端 学生删除接口
      const idx = tableData.value.findIndex((item) => item.id === row.id)
      if (idx !== -1) tableData.value.splice(idx, 1)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

// 批量导入
const importDialog = ref(false)
const handleImport = () => {
  // TODO: 对接后端 学生批量导入接口
  importDialog.value = false
  ElMessage.success('导入成功')
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
