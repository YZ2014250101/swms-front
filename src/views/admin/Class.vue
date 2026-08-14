<!-- src/views/admin/Class.vue -->
<!-- 班级管理，支持按专业筛选、增删改查 -->
<template>
  <el-card shadow="never">
    <!-- 搜索栏 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="所属专业">
        <el-select v-model="searchForm.majorId" placeholder="请选择专业" clearable style="width: 200px">
          <el-option v-for="item in majorList" :key="item.id" :label="item.name" :value="item.id" />
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
    <el-table :data="filteredList" border stripe v-loading="loading" style="width: 100%; margin-top: 16px">
      <el-table-column prop="code" label="班级编号" width="130" />
      <el-table-column prop="name" label="班级名称" min-width="150" />
      <el-table-column label="所属专业" width="180">
        <template #default="{ row }">{{ majorName(row.majorId) }}</template>
      </el-table-column>
      <el-table-column label="辅导员" width="120">
        <template #default="{ row }">{{ teacherName(row.counselorId) }}</template>
      </el-table-column>
      <el-table-column prop="studentCount" label="人数" width="90" align="center" />
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
    <el-dialog v-model="dialogVisible" :title="editMode ? '编辑班级' : '新增班级'" width="480px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="班级编号" prop="code">
          <el-input v-model="form.code" placeholder="请输入班级编号" />
        </el-form-item>
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入班级名称" />
        </el-form-item>
        <el-form-item label="所属专业" prop="majorId">
          <el-select v-model="form.majorId" placeholder="请选择专业" style="width: 100%">
            <el-option v-for="item in majorList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="辅导员" prop="teacherId">
          <el-select v-model="form.teacherId" placeholder="请选择辅导员" filterable style="width: 100%">
            <el-option v-for="item in teacherList" :key="item.id" :label="item.name + (item.teacherId ? '(' + item.teacherId + ')' : '')" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注" />
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
import { getClassList, toAddClass, addClass, toEditClass, updateClass, deleteClass } from '@/api/modules/admin/department'

const loading = ref(false)
const submitting = ref(false)
const tableData = ref([])
const majorList = ref([])
const teacherList = ref([])

const majorName = (id) => {
  const m = majorList.value.find((item) => item.id === id)
  return m ? m.name : ''
}
const teacherName = (id) => {
  const t = teacherList.value.find((item) => item.id === id)
  return t ? t.name : ''
}

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getClassList()
    tableData.value = res.data.classList || []
    majorList.value = res.data.majorList || []
    teacherList.value = res.data.teacherList || []
  } catch (e) {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}

onMounted(fetchList)

// 搜索
const searchForm = reactive({ majorId: '', name: '' })
const filteredList = computed(() => {
  return tableData.value.filter((row) => {
    if (searchForm.majorId && Number(row.majorId) !== Number(searchForm.majorId)) return false
    if (searchForm.name && !(row.name || '').includes(searchForm.name)) return false
    return true
  })
})
const handleSearch = () => {
  page.current = 1
}
const handleReset = () => {
  searchForm.majorId = ''
  searchForm.name = ''
}

// 分页
const page = reactive({ current: 1, size: 10 })

// 弹窗
const dialogVisible = ref(false)
const editMode = ref(false)
const formRef = ref(null)
const form = reactive({ id: null, code: '', name: '', majorId: '', teacherId: '', remark: '' })
const rules = {
  name: [{ required: true, message: '请输入班级名称', trigger: 'blur' }],
  majorId: [{ required: true, message: '请选择所属专业', trigger: 'change' }],
  teacherId: [{ required: true, message: '请选择辅导员', trigger: 'change' }]
}

const resetForm = () => {
  form.id = null
  form.code = ''
  form.name = ''
  form.majorId = ''
  form.teacherId = ''
  form.remark = ''
}

const handleAdd = async () => {
  editMode.value = false
  resetForm()
  try {
    const res = await toAddClass()
    majorList.value = res.data.majorList || majorList.value
    teacherList.value = res.data.teacherList || teacherList.value
    dialogVisible.value = true
  } catch (e) {
    // 拦截器已提示
  }
}

const handleEdit = async (row) => {
  editMode.value = true
  resetForm()
  try {
    const res = await toEditClass(row.id)
    const info = res.data.classInfo || {}
    majorList.value = res.data.majorList || majorList.value
    teacherList.value = res.data.teacherList || teacherList.value
    form.id = info.id
    form.code = info.code || ''
    form.name = info.name || ''
    form.majorId = info.majorId ?? ''
    // 读取为 counselorId，写入为 teacherId
    form.teacherId = info.counselorId ?? info.teacherId ?? ''
    form.remark = info.remark || ''
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
      const payload = { code: form.code, name: form.name, majorId: form.majorId, teacherId: form.teacherId, remark: form.remark }
      if (editMode.value) {
        await updateClass({ id: form.id, ...payload })
        ElMessage.success('编辑成功')
      } else {
        await addClass(payload)
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
  ElMessageBox.confirm(`确认要删除班级【${row.name}】吗？`, '删除确认', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await deleteClass(row.id)
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
