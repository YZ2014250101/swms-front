<!-- src/views/admin/Semester.vue -->
<!-- 学期与时间管理，支持增删改查，配置各类教学时间节点 -->
<template>
  <el-card shadow="never">
    <!-- 操作栏 -->
    <div class="toolbar">
      <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
    </div>

    <!-- 列表 -->
    <el-table :data="tableData" border stripe style="width: 100%; margin-top: 16px">
      <el-table-column prop="year" label="学年" width="120" />
      <el-table-column prop="term" label="学期" width="90" align="center" />
      <el-table-column prop="startTime" label="开始时间" width="120" />
      <el-table-column prop="endTime" label="结束时间" width="120" />
      <el-table-column prop="selectTime" label="选课时间" width="180" />
      <el-table-column prop="examTime" label="考试时间" width="120" />
      <el-table-column prop="scoreTime" label="成绩录入时间" width="180" />
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
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
    <el-dialog v-model="dialogVisible" :title="editMode ? '编辑学期' : '新增学期'" width="560px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="学年" prop="year">
          <el-input v-model="form.year" placeholder="如：2025-2026" />
        </el-form-item>
        <el-form-item label="学期" prop="term">
          <el-select v-model="form.term" placeholder="请选择学期" style="width: 100%">
            <el-option label="第一学期" value="第一学期" />
            <el-option label="第二学期" value="第二学期" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker v-model="form.startTime" type="date" placeholder="请选择开始时间" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="form.endTime" type="date" placeholder="请选择结束时间" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="选课时间" prop="selectTime">
          <el-date-picker v-model="form.selectTime" type="datetimerange" range-separator="至" start-placeholder="开始" end-placeholder="结束" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
        </el-form-item>
        <el-form-item label="考试时间" prop="examTime">
          <el-date-picker v-model="form.examTime" type="date" placeholder="请选择考试时间" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="成绩录入时间" prop="scoreTime">
          <el-date-picker v-model="form.scoreTime" type="datetimerange" range-separator="至" start-placeholder="开始" end-placeholder="结束" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="开学" value="开学" />
            <el-option label="期中" value="期中" />
            <el-option label="期末" value="期末" />
            <el-option label="放假" value="放假" />
          </el-select>
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
import { Plus } from '@element-plus/icons-vue'

// 状态 tag 类型
const statusTagType = (status) => {
  if (status === '开学') return 'success'
  if (status === '期中') return 'warning'
  if (status === '期末') return 'danger'
  return 'info'
}

// mock 学期列表
// TODO: 对接后端 学期列表接口
const tableData = ref([
  { id: 1, year: '2025-2026', term: '第一学期', startTime: '2025-09-01', endTime: '2026-01-15', selectTime: '2025-08-25 00:00:00 ~ 2025-08-31 23:59:59', examTime: '2026-01-05', scoreTime: '2026-01-10 00:00:00 ~ 2026-01-20 23:59:59', status: '开学' },
  { id: 2, year: '2025-2026', term: '第二学期', startTime: '2026-02-20', endTime: '2026-06-30', selectTime: '2026-02-10 00:00:00 ~ 2026-02-18 23:59:59', examTime: '2026-06-20', scoreTime: '2026-06-25 00:00:00 ~ 2026-07-05 23:59:59', status: '放假' }
])

// 分页
const page = reactive({ current: 1, size: 10, total: 2 })

// 弹窗
const dialogVisible = ref(false)
const editMode = ref(false)
const formRef = ref(null)
const form = reactive({
  id: null,
  year: '',
  term: '',
  startTime: '',
  endTime: '',
  selectTime: [],
  examTime: '',
  scoreTime: [],
  status: ''
})
const rules = {
  year: [{ required: true, message: '请输入学年', trigger: 'blur' }],
  term: [{ required: true, message: '请选择学期', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const formatRange = (arr) => (Array.isArray(arr) && arr.length === 2 ? `${arr[0]} ~ ${arr[1]}` : '')

const handleAdd = () => {
  editMode.value = false
  form.id = null
  form.year = ''
  form.term = ''
  form.startTime = ''
  form.endTime = ''
  form.selectTime = []
  form.examTime = ''
  form.scoreTime = []
  form.status = ''
  dialogVisible.value = true
}

const handleEdit = (row) => {
  editMode.value = true
  form.id = row.id
  form.year = row.year
  form.term = row.term
  form.startTime = row.startTime
  form.endTime = row.endTime
  form.selectTime = []
  form.examTime = row.examTime
  form.scoreTime = []
  form.status = row.status
  dialogVisible.value = true
}

const handleConfirm = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    // TODO: 对接后端 学期新增/编辑接口
    const selectTimeStr = formatRange(form.selectTime)
    const scoreTimeStr = formatRange(form.scoreTime)
    if (editMode.value) {
      const row = tableData.value.find((item) => item.id === form.id)
      if (row) {
        row.year = form.year
        row.term = form.term
        row.startTime = form.startTime
        row.endTime = form.endTime
        row.selectTime = selectTimeStr
        row.examTime = form.examTime
        row.scoreTime = scoreTimeStr
        row.status = form.status
      }
      ElMessage.success('编辑成功')
    } else {
      tableData.value.unshift({
        id: Date.now(),
        year: form.year,
        term: form.term,
        startTime: form.startTime,
        endTime: form.endTime,
        selectTime: selectTimeStr,
        examTime: form.examTime,
        scoreTime: scoreTimeStr,
        status: form.status
      })
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
  })
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认要删除学期【${row.year} ${row.term}】吗？`, '删除确认', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // TODO: 对接后端 学期删除接口
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
</style>
