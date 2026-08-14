<!-- src/views/admin/AdminManage.vue -->
<!-- 管理员账号管理，支持增删改查、权限配置 -->
<template>
  <el-card shadow="never">
    <!-- 操作栏 -->
    <div class="toolbar">
      <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
    </div>

    <!-- 列表 -->
    <el-table :data="tableData" border stripe style="width: 100%; margin-top: 16px">
      <el-table-column prop="account" label="账号" width="140" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="roleName" label="角色" width="140">
        <template #default="{ row }">
          <el-tag>{{ row.roleName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === '正常' ? 'success' : 'danger'">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="warning" link size="small" @click="handlePermission(row)">权限配置</el-button>
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
    <el-dialog v-model="dialogVisible" :title="editMode ? '编辑管理员' : '新增管理员'" width="480px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="账号" prop="account">
          <el-input v-model="form.account" placeholder="请输入账号" :disabled="editMode" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item v-if="!editMode" label="密码" prop="password">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="form.roleId" placeholder="请选择角色" style="width: 100%">
            <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </template>
    </el-dialog>

    <!-- 权限配置弹窗 -->
    <el-dialog v-model="permDialog" title="权限配置" width="420px">
      <div class="perm-tip">为管理员【{{ currentAdmin.name }}】配置菜单权限：</div>
      <el-tree
        ref="permTreeRef"
        :data="permTreeData"
        show-checkbox
        node-key="id"
        default-expand-all
        :props="{ label: 'label', children: 'children' }"
      />
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
import { Plus } from '@element-plus/icons-vue'

// 角色下拉
// TODO: 对接后端 角色列表接口
const roleOptions = ref([
  { value: 1, label: '超级管理员' },
  { value: 2, label: '系统管理员' },
  { value: 3, label: '运维管理员' }
])

// 权限菜单树
// TODO: 对接后端 菜单权限树接口
const permTreeData = ref([
  {
    id: 1,
    label: '用户权限',
    children: [
      { id: 11, label: '学生管理' },
      { id: 12, label: '教师管理' },
      { id: 13, label: '管理员管理' }
    ]
  },
  {
    id: 2,
    label: '院系班级',
    children: [
      { id: 21, label: '院系管理' },
      { id: 22, label: '专业管理' },
      { id: 23, label: '班级管理' }
    ]
  },
  {
    id: 3,
    label: '系统设置',
    children: [{ id: 31, label: '系统设置' }, { id: 32, label: '日志管理' }]
  }
])

// mock 管理员列表
// TODO: 对接后端 管理员列表接口
const tableData = ref([
  { id: 1, account: 'admin', name: '超级管理员', roleId: 1, roleName: '超级管理员', createTime: '2024-09-01 10:00:00', status: '正常' },
  { id: 2, account: 'sysadmin', name: '系统管理员', roleId: 2, roleName: '系统管理员', createTime: '2024-09-05 14:30:00', status: '正常' },
  { id: 3, account: 'opsadmin', name: '运维管理员', roleId: 3, roleName: '运维管理员', createTime: '2024-10-10 09:15:00', status: '禁用' }
])

// 分页
const page = reactive({ current: 1, size: 10, total: 3 })

// 弹窗
const dialogVisible = ref(false)
const editMode = ref(false)
const formRef = ref(null)
const form = reactive({
  id: null,
  account: '',
  name: '',
  password: '',
  roleId: ''
})
const rules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  roleId: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

const handleAdd = () => {
  editMode.value = false
  form.id = null
  form.account = ''
  form.name = ''
  form.password = ''
  form.roleId = ''
  dialogVisible.value = true
}

const handleEdit = (row) => {
  editMode.value = true
  form.id = row.id
  form.account = row.account
  form.name = row.name
  form.password = ''
  form.roleId = row.roleId
  dialogVisible.value = true
}

const handleConfirm = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    const roleName = roleOptions.value.find((r) => r.value === form.roleId)?.label || ''
    // TODO: 对接后端 管理员新增/编辑接口
    if (editMode.value) {
      const row = tableData.value.find((item) => item.id === form.id)
      if (row) {
        row.name = form.name
        row.roleId = form.roleId
        row.roleName = roleName
      }
      ElMessage.success('编辑成功')
    } else {
      tableData.value.unshift({
        id: Date.now(),
        account: form.account,
        name: form.name,
        roleId: form.roleId,
        roleName,
        createTime: new Date().toLocaleString(),
        status: '正常'
      })
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
  })
}

// 权限配置
const permDialog = ref(false)
const permTreeRef = ref(null)
const currentAdmin = reactive({ id: null, name: '' })
const handlePermission = (row) => {
  currentAdmin.id = row.id
  currentAdmin.name = row.name
  // TODO: 对接后端 管理员已有权限查询接口
  permDialog.value = true
}
const handlePermConfirm = () => {
  // TODO: 对接后端 管理员权限配置接口
  permDialog.value = false
  ElMessage.success('权限配置成功')
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认要删除管理员【${row.name}】吗？`, '删除确认', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // TODO: 对接后端 管理员删除接口
      const idx = tableData.value.findIndex((item) => item.id === row.id)
      if (idx !== -1) tableData.value.splice(idx, 1)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
</script>

<style scoped>
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
