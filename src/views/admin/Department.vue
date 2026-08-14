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
    <el-table :data="tableData" border stripe style="width: 100%; margin-top: 16px">
      <el-table-column prop="deptNo" label="院系编号" width="130" />
      <el-table-column prop="name" label="院系名称" min-width="180" />
      <el-table-column prop="leader" label="负责人" width="120" />
      <el-table-column prop="phone" label="联系电话" width="140" />
      <el-table-column prop="createTime" label="成立时间" width="140" />
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
    <el-dialog v-model="dialogVisible" :title="editMode ? '编辑院系' : '新增院系'" width="480px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="院系编号" prop="deptNo">
          <el-input v-model="form.deptNo" placeholder="请输入院系编号" :disabled="editMode" />
        </el-form-item>
        <el-form-item label="院系名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入院系名称" />
        </el-form-item>
        <el-form-item label="负责人" prop="leader">
          <el-input v-model="form.leader" placeholder="请输入负责人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
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

// mock 院系列表
// TODO: 对接后端 院系列表接口
const tableData = ref([
  { id: 1, deptNo: 'D001', name: '计算机学院', leader: '刘院长', phone: '0571-88001001', createTime: '2000-09-01' },
  { id: 2, deptNo: 'D002', name: '软件学院', leader: '陈院长', phone: '0571-88001002', createTime: '2002-09-01' },
  { id: 3, deptNo: 'D003', name: '信息工程学院', leader: '杨院长', phone: '0571-88001003', createTime: '2005-09-01' }
])

// 搜索
const searchForm = reactive({ name: '' })
const handleSearch = () => {
  // TODO: 对接后端 院系列表查询接口
  ElMessage.success('查询成功')
}
const handleReset = () => {
  searchForm.name = ''
}

// 分页
const page = reactive({ current: 1, size: 10, total: 3 })

// 弹窗
const dialogVisible = ref(false)
const editMode = ref(false)
const formRef = ref(null)
const form = reactive({ id: null, deptNo: '', name: '', leader: '', phone: '' })
const rules = {
  deptNo: [{ required: true, message: '请输入院系编号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入院系名称', trigger: 'blur' }],
  leader: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }]
}

const handleAdd = () => {
  editMode.value = false
  form.id = null
  form.deptNo = ''
  form.name = ''
  form.leader = ''
  form.phone = ''
  dialogVisible.value = true
}

const handleEdit = (row) => {
  editMode.value = true
  form.id = row.id
  form.deptNo = row.deptNo
  form.name = row.name
  form.leader = row.leader
  form.phone = row.phone
  dialogVisible.value = true
}

const handleConfirm = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    // TODO: 对接后端 院系新增/编辑接口
    if (editMode.value) {
      const row = tableData.value.find((item) => item.id === form.id)
      if (row) {
        row.deptNo = form.deptNo
        row.name = form.name
        row.leader = form.leader
        row.phone = form.phone
      }
      ElMessage.success('编辑成功')
    } else {
      tableData.value.unshift({
        id: Date.now(),
        deptNo: form.deptNo,
        name: form.name,
        leader: form.leader,
        phone: form.phone,
        createTime: new Date().toLocaleDateString()
      })
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
  })
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认要删除院系【${row.name}】吗？`, '删除确认', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // TODO: 对接后端 院系删除接口
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
