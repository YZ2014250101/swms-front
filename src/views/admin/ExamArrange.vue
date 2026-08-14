<!-- src/views/admin/ExamArrange.vue -->
<!-- 考试安排管理：日期筛选、增删改查、批量删除、导出 -->
<template>
  <el-card shadow="never">
    <!-- 搜索栏 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="考试日期">
        <el-date-picker v-model="searchForm.examDate" type="date" placeholder="请选择考试日期" value-format="YYYY-MM-DD" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作栏 -->
    <div class="toolbar">
      <el-button type="success" :icon="Download" @click="handleExport">导出</el-button>
      <el-button type="danger" :icon="Delete" :disabled="!selectedIds.length" @click="handleBatchDelete">批量删除</el-button>
      <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
    </div>

    <!-- 列表 -->
    <el-table :data="tableData" border stripe v-loading="loading" style="width: 100%; margin-top: 16px" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" />
      <el-table-column label="课程" min-width="150">
        <template #default="{ row }">{{ courseName(row.courseId) }}</template>
      </el-table-column>
      <el-table-column prop="examDate" label="考试日期" width="120" />
      <el-table-column prop="examTime" label="考试时间" width="140" />
      <el-table-column prop="classroom" label="考场" width="120" />
      <el-table-column prop="invigilatorId" label="监考教师ID" width="120" align="center" />
      <el-table-column prop="remark" label="备注" min-width="160" />
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
      :total="tableData.length"
      layout="total, sizes, prev, pager, next, jumper"
      background
    />

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="editMode ? '编辑考试安排' : '新增考试安排'" width="520px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="课程" prop="courseId">
          <el-select v-model="form.courseId" placeholder="请选择课程" filterable style="width: 100%">
            <el-option v-for="item in courseList" :key="item.id" :label="item.courseName + (item.courseNo ? '(' + item.courseNo + ')' : '')" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="考试日期" prop="examDate">
          <el-date-picker v-model="form.examDate" type="date" placeholder="请选择考试日期" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-time-picker v-model="form.startTime" placeholder="如 09:00" value-format="HH:mm" format="HH:mm" style="width: 100%" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-time-picker v-model="form.endTime" placeholder="如 11:00" value-format="HH:mm" format="HH:mm" style="width: 100%" />
        </el-form-item>
        <el-form-item label="考场" prop="classroom">
          <el-input v-model="form.classroom" placeholder="请输入考场" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Download, Delete } from '@element-plus/icons-vue'
import {
  getExamList,
  getExamByDate,
  toAddExamSchedule,
  addExamSchedule,
  toEditExamSchedule,
  updateExamSchedule,
  deleteExamSchedule,
  batchDeleteExamSchedule,
  exportExamSchedule
} from '@/api/modules/admin/exam'

const loading = ref(false)
const submitting = ref(false)
const tableData = ref([])
const courseList = ref([])
const semesterList = ref([])
const selectedIds = ref([])

const courseName = (id) => {
  if (!id) return ''
  const c = courseList.value.find((item) => item.id === id)
  return c ? c.courseName : id
}

// blob 下载通用函数
function downloadBlob(response, filename) {
  const blob = new Blob([response.data])
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getExamList()
    tableData.value = res.data.examList || []
  } catch (e) {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}

const fetchAux = async () => {
  try {
    const res = await toAddExamSchedule()
    courseList.value = res.data.courseList || []
    semesterList.value = res.data.semesterList || []
  } catch (e) {}
}

onMounted(async () => {
  await fetchList()
  fetchAux()
})

// 搜索
const searchForm = reactive({ examDate: '' })
const handleSearch = async () => {
  loading.value = true
  page.current = 1
  try {
    if (searchForm.examDate) {
      const res = await getExamByDate(searchForm.examDate)
      tableData.value = res.data.examList || []
    } else {
      const res = await getExamList()
      tableData.value = res.data.examList || []
    }
  } catch (e) {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}
const handleReset = () => {
  searchForm.examDate = ''
  fetchList()
}

// 分页
const page = reactive({ current: 1, size: 10 })

// 多选
const handleSelectionChange = (rows) => {
  selectedIds.value = rows.map((r) => r.id)
}

// 弹窗
const dialogVisible = ref(false)
const editMode = ref(false)
const formRef = ref(null)
const form = reactive({ id: null, courseId: '', examDate: '', startTime: '', endTime: '', classroom: '', remark: '' })
const rules = {
  courseId: [{ required: true, message: '请选择课程', trigger: 'change' }],
  examDate: [{ required: true, message: '请选择考试日期', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  classroom: [{ required: true, message: '请输入考场', trigger: 'blur' }]
}

const resetForm = () => {
  form.id = null
  form.courseId = ''
  form.examDate = ''
  form.startTime = ''
  form.endTime = ''
  form.classroom = ''
  form.remark = ''
}

// 将 "09:00-11:00" / "09:00~11:00" 拆分为起止时间
const splitExamTime = (examTime) => {
  if (!examTime) return ['', '']
  const parts = examTime.split(/[-~]/)
  if (parts.length === 2) return [parts[0].trim(), parts[1].trim()]
  return [examTime, '']
}

const handleAdd = async () => {
  editMode.value = false
  resetForm()
  try {
    const res = await toAddExamSchedule()
    courseList.value = res.data.courseList || courseList.value
    semesterList.value = res.data.semesterList || semesterList.value
  } catch (e) {}
  dialogVisible.value = true
}

const handleEdit = async (row) => {
  editMode.value = true
  resetForm()
  try {
    const res = await toEditExamSchedule(row.id)
    const es = res.data.examSchedule || {}
    courseList.value = res.data.courseList || courseList.value
    const [st, et] = splitExamTime(es.examTime)
    form.id = es.id
    form.courseId = es.courseId ?? ''
    form.examDate = es.examDate || ''
    form.startTime = st
    form.endTime = et
    form.classroom = es.classroom || ''
    form.remark = es.remark || ''
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
      const payload = {
        courseId: form.courseId,
        examDate: form.examDate,
        startTime: form.startTime,
        endTime: form.endTime,
        classroom: form.classroom,
        remark: form.remark
      }
      if (editMode.value) {
        await updateExamSchedule({ id: form.id, ...payload })
        ElMessage.success('编辑成功')
      } else {
        await addExamSchedule(payload)
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
  ElMessageBox.confirm(`确认要删除该考试安排吗？`, '删除确认', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await deleteExamSchedule(row.id)
        ElMessage.success('删除成功')
        fetchList()
      } catch (e) {}
    })
    .catch(() => {})
}

// 批量删除
const handleBatchDelete = () => {
  if (!selectedIds.value.length) return
  ElMessageBox.confirm(`确认要删除选中的 ${selectedIds.value.length} 条考试安排吗？`, '批量删除', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await batchDeleteExamSchedule(selectedIds.value)
        ElMessage.success('删除成功')
        fetchList()
      } catch (e) {}
    })
    .catch(() => {})
}

// 导出
const handleExport = async () => {
  try {
    const response = await exportExamSchedule()
    downloadBlob(response, '考试安排.csv')
    ElMessage.success('导出成功')
  } catch (e) {
    // 拦截器已提示
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
