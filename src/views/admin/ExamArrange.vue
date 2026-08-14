<!-- src/views/admin/ExamArrange.vue -->
<!-- 考试安排管理，支持批量编排、增删改查、导出 -->
<template>
  <el-card shadow="never">
    <!-- 搜索栏 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="学期">
        <el-select v-model="searchForm.semester" placeholder="请选择学期" clearable>
          <el-option v-for="item in semesterOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="课程">
        <el-input v-model="searchForm.course" placeholder="请输入课程" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作栏 -->
    <div class="toolbar">
      <el-button type="success" :icon="Download" @click="handleExport">导出</el-button>
      <el-button type="warning" :icon="Setting" @click="handleBatchArrange">批量编排</el-button>
      <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
    </div>

    <!-- 列表 -->
    <el-table :data="tableData" border stripe style="width: 100%; margin-top: 16px">
      <el-table-column prop="course" label="课程" min-width="150" />
      <el-table-column prop="type" label="考试类型" width="110" align="center" />
      <el-table-column prop="date" label="考试日期" width="120" />
      <el-table-column prop="time" label="考试时间" width="140" />
      <el-table-column prop="room" label="考场" width="120" />
      <el-table-column prop="invigilator" label="监考教师" width="120" />
      <el-table-column prop="count" label="人数" width="80" align="center" />
      <el-table-column label="操作" width="160" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="warning" link size="small" @click="handleAdjust(row)">调整</el-button>
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
    <el-dialog v-model="dialogVisible" :title="editMode ? '编辑考试安排' : '新增考试安排'" width="520px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="课程" prop="course">
          <el-select v-model="form.course" placeholder="请选择课程" style="width: 100%">
            <el-option v-for="item in courseOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="考试类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择考试类型" style="width: 100%">
            <el-option label="期中考试" value="期中考试" />
            <el-option label="期末考试" value="期末考试" />
            <el-option label="补考" value="补考" />
          </el-select>
        </el-form-item>
        <el-form-item label="考试日期" prop="date">
          <el-date-picker v-model="form.date" type="date" placeholder="请选择日期" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="考试时间" prop="time">
          <el-input v-model="form.time" placeholder="如：09:00-11:00" />
        </el-form-item>
        <el-form-item label="考场" prop="room">
          <el-input v-model="form.room" placeholder="请输入考场" />
        </el-form-item>
        <el-form-item label="监考教师" prop="invigilator">
          <el-input v-model="form.invigilator" placeholder="请输入监考教师" />
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
import { Search, Refresh, Plus, Download, Setting } from '@element-plus/icons-vue'

// 学期/课程下拉
const semesterOptions = ref(['2025-2026 第一学期', '2025-2026 第二学期'])
const courseOptions = ref(['数据结构', '计算机网络', '软件工程', '操作系统'])

// mock 考试安排列表
// TODO: 对接后端 考试安排列表接口
const tableData = ref([
  { id: 1, course: '数据结构', type: '期中考试', date: '2025-11-10', time: '09:00-11:00', room: 'A101', invigilator: '刘老师', count: 40 },
  { id: 2, course: '计算机网络', type: '期末考试', date: '2026-01-05', time: '14:00-16:00', room: 'A102', invigilator: '陈老师', count: 38 },
  { id: 3, course: '软件工程', type: '期末考试', date: '2026-01-06', time: '09:00-11:00', room: 'B201', invigilator: '杨老师', count: 35 },
  { id: 4, course: '操作系统', type: '补考', date: '2026-02-25', time: '14:00-16:00', room: 'C301', invigilator: '赵老师', count: 8 }
])

// 搜索
const searchForm = reactive({ semester: '', course: '' })
const handleSearch = () => {
  // TODO: 对接后端 考试安排查询接口
  ElMessage.success('查询成功')
}
const handleReset = () => {
  searchForm.semester = ''
  searchForm.course = ''
}

// 分页
const page = reactive({ current: 1, size: 10, total: 4 })

// 弹窗
const dialogVisible = ref(false)
const editMode = ref(false)
const formRef = ref(null)
const form = reactive({ id: null, course: '', type: '', date: '', time: '', room: '', invigilator: '' })
const rules = {
  course: [{ required: true, message: '请选择课程', trigger: 'change' }],
  type: [{ required: true, message: '请选择考试类型', trigger: 'change' }],
  date: [{ required: true, message: '请选择考试日期', trigger: 'change' }],
  time: [{ required: true, message: '请输入考试时间', trigger: 'blur' }],
  room: [{ required: true, message: '请输入考场', trigger: 'blur' }],
  invigilator: [{ required: true, message: '请输入监考教师', trigger: 'blur' }]
}

const handleAdd = () => {
  editMode.value = false
  form.id = null
  form.course = ''
  form.type = ''
  form.date = ''
  form.time = ''
  form.room = ''
  form.invigilator = ''
  dialogVisible.value = true
}

const handleEdit = (row) => {
  editMode.value = true
  form.id = row.id
  form.course = row.course
  form.type = row.type
  form.date = row.date
  form.time = row.time
  form.room = row.room
  form.invigilator = row.invigilator
  dialogVisible.value = true
}

const handleConfirm = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    // TODO: 对接后端 考试安排新增/编辑接口
    if (editMode.value) {
      const row = tableData.value.find((item) => item.id === form.id)
      if (row) Object.assign(row, form)
      ElMessage.success('编辑成功')
    } else {
      tableData.value.unshift({ id: Date.now(), ...form, count: 0 })
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
  })
}

// 调整
const handleAdjust = (row) => {
  ElMessageBox.confirm(`确认要调整课程【${row.course}】的考试安排吗？`, '调整确认', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // TODO: 对接后端 考试安排调整接口
      ElMessage.success('调整成功')
    })
    .catch(() => {})
}

// 批量编排
const handleBatchArrange = () => {
  ElMessageBox.confirm('确认要批量编排当前学期的考试安排吗？', '批量编排', {
    confirmButtonText: '确认编排',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // TODO: 对接后端 考试批量编排接口
      ElMessage.success('批量编排完成')
    })
    .catch(() => {})
}

// 导出
const handleExport = () => {
  // TODO: 对接后端 考试安排导出接口
  ElMessage.success('导出成功')
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
