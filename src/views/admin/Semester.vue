<!-- src/views/admin/Semester.vue -->
<!-- 学期管理：增删改查、设为当前学期、状态切换、成绩录入开关 -->
<template>
  <el-card shadow="never">
    <!-- 操作栏 -->
    <div class="toolbar">
      <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
    </div>

    <!-- 列表 -->
    <el-table :data="tableData" border stripe v-loading="loading" style="width: 100%; margin-top: 16px">
      <el-table-column prop="academicYear" label="学年" width="120" />
      <el-table-column prop="semesterName" label="学期" width="100" align="center" />
      <el-table-column prop="startDate" label="开始时间" width="120" />
      <el-table-column prop="endDate" label="结束时间" width="120" />
      <el-table-column label="选课时间" width="200">
        <template #default="{ row }">{{ rangeText(row.selectStartTime, row.selectEndTime) }}</template>
      </el-table-column>
      <el-table-column label="考试时间" width="200">
        <template #default="{ row }">{{ rangeText(row.examStartTime, row.examEndTime) }}</template>
      </el-table-column>
      <el-table-column label="成绩录入时间" width="200">
        <template #default="{ row }">{{ rangeText(row.gradeStartTime, row.gradeEndTime) }}</template>
      </el-table-column>
      <el-table-column label="当前学期" width="100" align="center">
        <template #default="{ row }">
          <el-tag v-if="Number(row.isCurrent) === 1" type="success">当前</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-switch :model-value="Number(row.status) === 1" @change="(val) => handleToggleStatus(row, val)" active-text="启用" inactive-text="停用" />
        </template>
      </el-table-column>
      <el-table-column label="成绩录入" width="110" align="center">
        <template #default="{ row }">
          <el-switch :model-value="Number(row.gradeInputEnabled) === 1" @change="(val) => handleToggleGradeInput(row, val)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button v-if="Number(row.isCurrent) !== 1" type="success" link size="small" @click="handleSetCurrent(row)">设为当前</el-button>
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
    <el-dialog v-model="dialogVisible" :title="editMode ? '编辑学期' : '新增学期'" width="620px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="学年" prop="academicYear">
          <el-input v-model="form.academicYear" placeholder="如：2025-2026" />
        </el-form-item>
        <el-form-item label="学期" prop="semesterName">
          <el-select v-model="form.semesterName" placeholder="请选择学期" style="width: 100%">
            <el-option label="第一学期" value="第一学期" />
            <el-option label="第二学期" value="第二学期" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startDate">
          <el-date-picker v-model="form.startDate" type="date" placeholder="请选择开始时间" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endDate">
          <el-date-picker v-model="form.endDate" type="date" placeholder="请选择结束时间" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="选课开始" prop="selectStartTime">
          <el-date-picker v-model="form.selectStartTime" type="date" placeholder="请选择选课开始时间" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="选课结束" prop="selectEndTime">
          <el-date-picker v-model="form.selectEndTime" type="date" placeholder="请选择选课结束时间" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="考试开始" prop="examStartTime">
          <el-date-picker v-model="form.examStartTime" type="date" placeholder="请选择考试开始时间" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="考试结束" prop="examEndTime">
          <el-date-picker v-model="form.examEndTime" type="date" placeholder="请选择考试结束时间" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="成绩录入开始" prop="gradeStartTime">
          <el-date-picker v-model="form.gradeStartTime" type="date" placeholder="请选择成绩录入开始时间" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="成绩录入结束" prop="gradeEndTime">
          <el-date-picker v-model="form.gradeEndTime" type="date" placeholder="请选择成绩录入结束时间" value-format="YYYY-MM-DD" style="width: 100%" />
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
import { Plus } from '@element-plus/icons-vue'
import {
  getSemesterList,
  addSemester,
  toEditSemester,
  updateSemester,
  deleteSemester,
  setCurrentSemester,
  updateSemesterStatus,
  toggleGradeInput
} from '@/api/modules/admin/semester'

const loading = ref(false)
const submitting = ref(false)
const tableData = ref([])

const rangeText = (a, b) => {
  if (!a && !b) return '-'
  return `${a || ''} ~ ${b || ''}`
}

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getSemesterList()
    tableData.value = res.data.semesterList || []
  } catch (e) {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}

onMounted(fetchList)

// 分页
const page = reactive({ current: 1, size: 10 })

// 弹窗
const dialogVisible = ref(false)
const editMode = ref(false)
const formRef = ref(null)
const form = reactive({
  id: null,
  academicYear: '',
  semesterName: '',
  startDate: '',
  endDate: '',
  selectStartTime: '',
  selectEndTime: '',
  examStartTime: '',
  examEndTime: '',
  gradeStartTime: '',
  gradeEndTime: ''
})
const rules = {
  academicYear: [{ required: true, message: '请输入学年', trigger: 'blur' }],
  semesterName: [{ required: true, message: '请选择学期', trigger: 'change' }],
  startDate: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束时间', trigger: 'change' }]
}

const resetForm = () => {
  form.id = null
  form.academicYear = ''
  form.semesterName = ''
  form.startDate = ''
  form.endDate = ''
  form.selectStartTime = ''
  form.selectEndTime = ''
  form.examStartTime = ''
  form.examEndTime = ''
  form.gradeStartTime = ''
  form.gradeEndTime = ''
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
    const res = await toEditSemester(row.id)
    const s = res.data.semester || {}
    form.id = s.id
    form.academicYear = s.academicYear || ''
    form.semesterName = s.semesterName || ''
    form.startDate = s.startDate || ''
    form.endDate = s.endDate || ''
    form.selectStartTime = s.selectStartTime || ''
    form.selectEndTime = s.selectEndTime || ''
    form.examStartTime = s.examStartTime || ''
    form.examEndTime = s.examEndTime || ''
    form.gradeStartTime = s.gradeStartTime || ''
    form.gradeEndTime = s.gradeEndTime || ''
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
        academicYear: form.academicYear,
        semesterName: form.semesterName,
        startDate: form.startDate,
        endDate: form.endDate,
        selectStartTime: form.selectStartTime,
        selectEndTime: form.selectEndTime,
        examStartTime: form.examStartTime,
        examEndTime: form.examEndTime,
        gradeStartTime: form.gradeStartTime,
        gradeEndTime: form.gradeEndTime
      }
      if (editMode.value) {
        await updateSemester({ id: form.id, ...payload })
        ElMessage.success('编辑成功')
      } else {
        await addSemester(payload)
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

// 设为当前学期
const handleSetCurrent = (row) => {
  ElMessageBox.confirm(`确认将【${row.academicYear} ${row.semesterName}】设为当前学期吗？`, '设为当前学期', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await setCurrentSemester(row.id)
        ElMessage.success('设置成功')
        fetchList()
      } catch (e) {}
    })
    .catch(() => {})
}

// 状态切换
const handleToggleStatus = (row, val) => {
  const next = val ? 1 : 0
  updateSemesterStatus(row.id, next)
    .then(() => {
      row.status = next
      ElMessage.success(next === 1 ? '已启用' : '已停用')
    })
    .catch(() => {})
}

// 成绩录入开关
const handleToggleGradeInput = (row, val) => {
  const next = val ? 1 : 0
  toggleGradeInput(row.id, next)
    .then(() => {
      row.gradeInputEnabled = next
      ElMessage.success(next === 1 ? '已开启成绩录入' : '已关闭成绩录入')
    })
    .catch(() => {})
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认要删除学期【${row.academicYear} ${row.semesterName}】吗？`, '删除确认', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await deleteSemester(row.id)
        ElMessage.success('删除成功')
        fetchList()
      } catch (e) {}
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
