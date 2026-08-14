<!-- src/views/admin/CourseManage.vue -->
<!-- 课程资源管理：新增、单课程选课开关、全局选课开关、选课时间设置、考试时间设置 -->
<template>
  <el-card shadow="never">
    <!-- 搜索栏 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="课程名">
        <el-input v-model="searchForm.courseName" placeholder="请输入课程名" clearable />
      </el-form-item>
      <el-form-item label="课程编号">
        <el-input v-model="searchForm.courseNo" placeholder="请输入课程编号" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作栏 -->
    <div class="toolbar">
      <el-form-item label="全局选课" style="margin-right: 12px">
        <el-switch :model-value="globalSelectable === 1" @change="handleToggleGlobal" active-text="开" inactive-text="关" />
      </el-form-item>
      <el-button type="warning" :icon="Clock" @click="openSelectTime">选课时间设置</el-button>
      <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
    </div>

    <!-- 列表 -->
    <el-table :data="filteredList" border stripe v-loading="loading" style="width: 100%; margin-top: 16px">
      <el-table-column prop="courseNo" label="课程编号" width="120" />
      <el-table-column prop="courseName" label="课程名称" min-width="160" />
      <el-table-column label="授课教师" width="120">
        <template #default="{ row }">{{ teacherName(row.teacherId) }}</template>
      </el-table-column>
      <el-table-column prop="credit" label="学分" width="80" align="center" />
      <el-table-column prop="hours" label="学时" width="80" align="center" />
      <el-table-column label="容量" width="110" align="center">
        <template #default="{ row }">{{ row.selectedNum ?? 0 }} / {{ row.maxNum ?? 0 }}</template>
      </el-table-column>
      <el-table-column label="选课状态" width="110" align="center">
        <template #default="{ row }">
          <el-switch :model-value="Number(row.selectable) === 1" @change="(val) => handleToggleSelectable(row, val)" />
        </template>
      </el-table-column>
      <el-table-column label="考试时间" min-width="240">
        <template #default="{ row }">{{ examTimeText(row) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="130" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="openExamTime(row)">设置考试时间</el-button>
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

    <!-- 新增弹窗 -->
    <el-dialog v-model="dialogVisible" title="新增课程" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="课程编号" prop="courseNo">
          <el-input v-model="form.courseNo" placeholder="请输入课程编号" />
        </el-form-item>
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="form.courseName" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="授课教师" prop="teacherId">
          <el-select v-model="form.teacherId" placeholder="请选择授课教师" filterable style="width: 100%">
            <el-option v-for="item in teacherList" :key="item.id" :label="item.name + (item.teacherId ? '(' + item.teacherId + ')' : '')" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="学分" prop="credit">
          <el-input-number v-model="form.credit" :min="1" :max="10" controls-position="right" />
        </el-form-item>
        <el-form-item label="学时" prop="hours">
          <el-input-number v-model="form.hours" :min="8" :max="120" controls-position="right" />
        </el-form-item>
        <el-form-item label="人数上限" prop="maxNum">
          <el-input-number v-model="form.maxNum" :min="1" :max="500" controls-position="right" />
        </el-form-item>
        <el-form-item label="上课星期" prop="weekDay">
          <el-select v-model="form.weekDay" placeholder="请选择星期" style="width: 100%">
            <el-option v-for="d in weekDayOptions" :key="d.value" :label="d.label" :value="d.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="节次" prop="sections">
          <el-col :span="11">
            <el-select v-model="form.startSection" placeholder="开始节次">
              <el-option v-for="n in 12" :key="n" :label="`第${n}节`" :value="n" />
            </el-select>
          </el-col>
          <el-col :span="2" style="text-align: center">至</el-col>
          <el-col :span="11">
            <el-select v-model="form.endSection" placeholder="结束节次">
              <el-option v-for="n in 12" :key="n" :label="`第${n}节`" :value="n" />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="上课教室" prop="classroom">
          <el-input v-model="form.classroom" placeholder="请输入上课教室" />
        </el-form-item>
        <el-form-item label="上课周次" prop="weekRange">
          <el-input v-model="form.weekRange" placeholder="如：1-16" />
        </el-form-item>
        <el-form-item label="课程简介" prop="intro">
          <el-input v-model="form.intro" type="textarea" :rows="3" placeholder="请输入课程简介" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleConfirm">确认</el-button>
      </template>
    </el-dialog>

    <!-- 选课时间设置弹窗 -->
    <el-dialog v-model="selectTimeDialog" title="选课时间设置" width="520px">
      <el-form label-width="100px">
        <el-form-item label="选课时间段">
          <el-date-picker
            v-model="selectTimeForm.range"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="danger" @click="handleClearSelectTime">清空</el-button>
        <el-button @click="selectTimeDialog = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSaveSelectTime">保存</el-button>
      </template>
    </el-dialog>

    <!-- 考试时间设置弹窗 -->
    <el-dialog v-model="examTimeDialog" title="设置考试时间" width="520px">
      <el-form label-width="100px">
        <el-form-item label="课程">
          <span>{{ currentCourse.courseName }}</span>
        </el-form-item>
        <el-form-item label="考试开始">
          <el-date-picker v-model="examTimeForm.examStartTime" type="datetime" placeholder="请选择考试开始时间" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
        </el-form-item>
        <el-form-item label="考试结束">
          <el-date-picker v-model="examTimeForm.examEndTime" type="datetime" placeholder="请选择考试结束时间" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="examTimeDialog = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSaveExamTime">保存</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, Plus, Clock } from '@element-plus/icons-vue'
import {
  getCourseList,
  toAddCourse,
  addCourse,
  toggleSelectable,
  toggleGlobalSelectable,
  toSetSelectTime,
  setSelectTime,
  clearSelectTime,
  toSetExamTime,
  saveExamTime
} from '@/api/modules/admin/course'

const loading = ref(false)
const submitting = ref(false)
const tableData = ref([])
const teacherList = ref([])
const globalSelectable = ref(0)

const weekDayOptions = [
  { value: 1, label: '周一' },
  { value: 2, label: '周二' },
  { value: 3, label: '周三' },
  { value: 4, label: '周四' },
  { value: 5, label: '周五' },
  { value: 6, label: '周六' },
  { value: 7, label: '周日' }
]

const teacherName = (id) => {
  if (!id) return ''
  const t = teacherList.value.find((item) => item.id === id)
  return t ? t.name : id
}

const examTimeText = (row) => {
  if (!row.examStartTime && !row.examEndTime) return '未设置'
  return `${row.examStartTime || ''} ~ ${row.examEndTime || ''}`
}

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getCourseList()
    tableData.value = res.data.courseList || []
  } catch (e) {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}

// 拉取教师列表 + 全局选课开关 + 选课时间
const fetchAux = async () => {
  try {
    const res = await toAddCourse()
    teacherList.value = res.data.teacherList || []
  } catch (e) {}
  try {
    const res = await toSetSelectTime()
    globalSelectable.value = Number(res.data.globalSelectable) || 0
  } catch (e) {}
}

onMounted(async () => {
  await fetchList()
  fetchAux()
})

// 搜索
const searchForm = reactive({ courseName: '', courseNo: '' })
const filteredList = computed(() => {
  return tableData.value.filter((row) => {
    if (searchForm.courseName && !(row.courseName || '').includes(searchForm.courseName)) return false
    if (searchForm.courseNo && !(row.courseNo || '').includes(searchForm.courseNo)) return false
    return true
  })
})
const handleSearch = () => {
  page.current = 1
}
const handleReset = () => {
  searchForm.courseName = ''
  searchForm.courseNo = ''
}

// 分页
const page = reactive({ current: 1, size: 10 })

// 新增弹窗
const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({
  courseNo: '',
  courseName: '',
  teacherId: '',
  credit: 2,
  hours: 32,
  maxNum: 60,
  weekDay: '',
  startSection: '',
  endSection: '',
  classroom: '',
  weekRange: '',
  intro: ''
})
const rules = {
  courseNo: [{ required: true, message: '请输入课程编号', trigger: 'blur' }],
  courseName: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  teacherId: [{ required: true, message: '请选择授课教师', trigger: 'change' }],
  maxNum: [{ required: true, message: '请输入人数上限', trigger: 'blur' }]
}

const resetForm = () => {
  form.courseNo = ''
  form.courseName = ''
  form.teacherId = ''
  form.credit = 2
  form.hours = 32
  form.maxNum = 60
  form.weekDay = ''
  form.startSection = ''
  form.endSection = ''
  form.classroom = ''
  form.weekRange = ''
  form.intro = ''
}

const handleAdd = async () => {
  resetForm()
  try {
    const res = await toAddCourse()
    teacherList.value = res.data.teacherList || teacherList.value
  } catch (e) {}
  dialogVisible.value = true
}

const handleConfirm = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      await addCourse({
        courseNo: form.courseNo,
        courseName: form.courseName,
        teacherId: form.teacherId,
        credit: form.credit,
        maxNum: form.maxNum,
        weekDay: form.weekDay,
        startSection: form.startSection,
        endSection: form.endSection,
        classroom: form.classroom,
        weekRange: form.weekRange,
        hours: form.hours,
        intro: form.intro
      })
      ElMessage.success('新增成功')
      dialogVisible.value = false
      fetchList()
    } catch (e) {
      // 拦截器已提示
    } finally {
      submitting.value = false
    }
  })
}

// 单课程选课开关
const handleToggleSelectable = (row, val) => {
  const next = val ? 1 : 0
  toggleSelectable(row.id, next)
    .then(() => {
      row.selectable = next
      ElMessage.success(next === 1 ? '已开启选课' : '已关闭选课')
    })
    .catch(() => {
      // 失败保持原状
    })
}

// 全局选课开关
const handleToggleGlobal = (val) => {
  const next = val ? 1 : 0
  toggleGlobalSelectable(next)
    .then(() => {
      globalSelectable.value = next
      ElMessage.success(next === 1 ? '已开启全局选课' : '已关闭全局选课')
    })
    .catch(() => {})
}

// 选课时间设置
const selectTimeDialog = ref(false)
const selectTimeForm = reactive({ range: [] })
const openSelectTime = async () => {
  selectTimeForm.range = []
  try {
    const res = await toSetSelectTime()
    globalSelectable.value = Number(res.data.globalSelectable) || 0
    if (res.data.selectStartTime && res.data.selectEndTime) {
      selectTimeForm.range = [res.data.selectStartTime, res.data.selectEndTime]
    }
  } catch (e) {}
  selectTimeDialog.value = true
}
const handleSaveSelectTime = async () => {
  if (!selectTimeForm.range || selectTimeForm.range.length !== 2 || !selectTimeForm.range[0] || !selectTimeForm.range[1]) {
    ElMessage.warning('请选择完整的选课时间段')
    return
  }
  submitting.value = true
  try {
    await setSelectTime(selectTimeForm.range[0], selectTimeForm.range[1])
    ElMessage.success('选课时间设置成功')
    selectTimeDialog.value = false
  } catch (e) {
    // 拦截器已提示
  } finally {
    submitting.value = false
  }
}
const handleClearSelectTime = async () => {
  submitting.value = true
  try {
    await clearSelectTime()
    ElMessage.success('已清空选课时间')
    selectTimeForm.range = []
    selectTimeDialog.value = false
  } catch (e) {
    // 拦截器已提示
  } finally {
    submitting.value = false
  }
}

// 考试时间设置
const examTimeDialog = ref(false)
const currentCourse = reactive({ id: null, courseName: '' })
const examTimeForm = reactive({ examStartTime: '', examEndTime: '' })
const openExamTime = async (row) => {
  currentCourse.id = row.id
  currentCourse.courseName = row.courseName
  examTimeForm.examStartTime = ''
  examTimeForm.examEndTime = ''
  try {
    const res = await toSetExamTime(row.id)
    const course = res.data.course || {}
    examTimeForm.examStartTime = course.examStartTime || ''
    examTimeForm.examEndTime = course.examEndTime || ''
  } catch (e) {}
  examTimeDialog.value = true
}
const handleSaveExamTime = async () => {
  if (!examTimeForm.examStartTime || !examTimeForm.examEndTime) {
    ElMessage.warning('请选择完整的考试起止时间')
    return
  }
  submitting.value = true
  try {
    await saveExamTime(currentCourse.id, examTimeForm.examStartTime, examTimeForm.examEndTime)
    ElMessage.success('考试时间设置成功')
    examTimeDialog.value = false
    fetchList()
  } catch (e) {
    // 拦截器已提示
  } finally {
    submitting.value = false
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
  align-items: center;
  gap: 8px;
}
.pagination {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>
