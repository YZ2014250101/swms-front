<!-- src/views/admin/RoleManage.vue -->
<!-- 角色权限配置，左侧角色列表，右侧菜单权限树，支持分配权限 -->
<template>
  <el-card shadow="never">
    <el-row :gutter="16">
      <!-- 左侧角色列表 -->
      <el-col :span="10">
        <div class="panel-header">
          <span>角色列表</span>
          <el-button type="primary" :icon="Plus" size="small" @click="handleAdd">新增角色</el-button>
        </div>
        <el-table
          :data="roleList"
          border
          stripe
          style="width: 100%"
          highlight-current-row
          @current-change="handleRoleChange"
        >
          <el-table-column prop="name" label="角色名称" width="130" />
          <el-table-column prop="desc" label="描述" min-width="140" />
          <el-table-column prop="userCount" label="人数" width="80" align="center" />
          <el-table-column label="操作" width="160" align="center">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click.stop="handleEdit(row)">编辑</el-button>
              <el-button type="warning" link size="small" @click.stop="handleAssign(row)">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>

      <!-- 右侧权限树 -->
      <el-col :span="14">
        <div class="panel-header">
          <span>菜单权限{{ currentRole.name ? ' - ' + currentRole.name : '' }}</span>
        </div>
        <el-tree
          ref="permTreeRef"
          :data="permTreeData"
          show-checkbox
          node-key="id"
          default-expand-all
          :props="{ label: 'label', children: 'children' }"
        />
        <div class="tree-footer">
          <el-button type="primary" @click="handleSavePerm">保存权限</el-button>
        </div>
      </el-col>
    </el-row>

    <!-- 新增/编辑角色弹窗 -->
    <el-dialog v-model="dialogVisible" :title="editMode ? '编辑角色' : '新增角色'" width="460px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="form.desc" type="textarea" :rows="3" placeholder="请输入角色描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </template>
    </el-dialog>

    <!-- 分配权限弹窗 -->
    <el-dialog v-model="assignDialog" :title="`分配权限 - ${currentRole.name}`" width="480px">
      <el-tree
        ref="assignTreeRef"
        :data="permTreeData"
        show-checkbox
        node-key="id"
        default-expand-all
        :props="{ label: 'label', children: 'children' }"
      />
      <template #footer>
        <el-button @click="assignDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAssignConfirm">确认</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 菜单权限树
// TODO: 对接后端 菜单权限树接口
const permTreeData = ref([
  {
    id: 1,
    label: '用户权限',
    children: [
      { id: 11, label: '学生管理' },
      { id: 12, label: '教师管理' },
      { id: 13, label: '管理员管理' },
      { id: 14, label: '角色权限' }
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
    label: '教学资源',
    children: [
      { id: 31, label: '课程管理' },
      { id: 32, label: '学期管理' },
      { id: 33, label: '考试编排' }
    ]
  },
  {
    id: 4,
    label: '系统管理',
    children: [
      { id: 41, label: '公告管理' },
      { id: 42, label: '数据统计' },
      { id: 43, label: '日志管理' },
      { id: 44, label: '系统设置' }
    ]
  }
])

// mock 角色列表
// TODO: 对接后端 角色列表接口
const roleList = ref([
  { id: 1, name: '超级管理员', desc: '拥有系统全部权限', userCount: 1 },
  { id: 2, name: '系统管理员', desc: '负责用户与基础数据维护', userCount: 2 },
  { id: 3, name: '教务管理员', desc: '负责课程与考试管理', userCount: 3 }
])

// 当前选中角色
const currentRole = reactive({ id: null, name: '' })
const permTreeRef = ref(null)
const handleRoleChange = (row) => {
  if (!row) return
  currentRole.id = row.id
  currentRole.name = row.name
  // TODO: 对接后端 角色已有权限查询接口
  permTreeRef.value?.setCheckedKeys([])
}

// 保存权限
const handleSavePerm = () => {
  if (!currentRole.id) {
    ElMessage.warning('请先选择角色')
    return
  }
  const keys = permTreeRef.value?.getCheckedKeys() || []
  // TODO: 对接后端 角色权限保存接口
  ElMessage.success(`角色【${currentRole.name}】权限已保存，共 ${keys.length} 项`)
}

// 新增/编辑角色
const dialogVisible = ref(false)
const editMode = ref(false)
const formRef = ref(null)
const form = reactive({ id: null, name: '', desc: '' })
const rules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
}

const handleAdd = () => {
  editMode.value = false
  form.id = null
  form.name = ''
  form.desc = ''
  dialogVisible.value = true
}

const handleEdit = (row) => {
  editMode.value = true
  form.id = row.id
  form.name = row.name
  form.desc = row.desc
  dialogVisible.value = true
}

const handleConfirm = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    // TODO: 对接后端 角色新增/编辑接口
    if (editMode.value) {
      const row = roleList.value.find((item) => item.id === form.id)
      if (row) {
        row.name = form.name
        row.desc = form.desc
      }
      ElMessage.success('编辑成功')
    } else {
      roleList.value.push({ id: Date.now(), name: form.name, desc: form.desc, userCount: 0 })
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
  })
}

// 分配权限弹窗
const assignDialog = ref(false)
const assignTreeRef = ref(null)
const handleAssign = (row) => {
  currentRole.id = row.id
  currentRole.name = row.name
  // TODO: 对接后端 角色已有权限查询接口
  assignDialog.value = true
}
const handleAssignConfirm = () => {
  const keys = assignTreeRef.value?.getCheckedKeys() || []
  // TODO: 对接后端 角色权限分配接口
  assignDialog.value = false
  ElMessage.success(`角色【${currentRole.name}】权限已分配，共 ${keys.length} 项`)
}
</script>

<style scoped>
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}
.tree-footer {
  margin-top: 16px;
  text-align: right;
}
</style>
