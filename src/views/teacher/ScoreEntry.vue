<!-- src/views/teacher/ScoreEntry.vue -->
<!-- 成绩录入，平时/期末成绩可编辑，综合成绩自动计算，支持单条与批量保存 -->
<template>
  <el-card shadow="never">
    <el-form :inline="true" :model="queryForm" class="search-bar">
      <el-form-item label="课程">
        <el-select v-model="queryForm.courseId" placeholder="请选择课程" clearable style="width: 260px" @change="handleQuery">
          <el-option v-for="item in courseOptions" :key="item.id" :label="item.courseName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 成绩录入未开放提示 -->
    <el-alert
      v-if="!gradeInputAllowed && queryForm.courseId"
      :title="gradeInputMsg || '当前课程成绩录入未开放'"
      type="warning"
      show-icon
      :closable="false"
      style="margin-bottom: 12px"
    />

    <el-table :data="tableData" border stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="studentNo" label="学号" width="130" />
      <el-table-column prop="name" label="姓名" width="110" />
      <el-table-column prop="className" label="班级" width="160" />
      <el-table-column label="平时成绩" width="160" align="center">
        <template #default="{ row }">
          <el-input-number v-model="row.dailyScore" :min="0" :max="100" :precision="1" :disabled="!gradeInputAllowed" controls-position="right" size="small" style="width: 120px" />
        </template>
      </el-table-column>
      <el-table-column label="期末成绩" width="160" align="center">
        <template #default="{ row }">
          <el-input-number v-model="row.finalScore" :min="0" :max="100" :precision="1" :disabled="!gradeInputAllowed" controls-position="right" size="small" style="width: 120px" />
        </template>
      </el-table-column>
      <el-table-column label="综合成绩" width="120" align="center">
        <template #default="{ row }">
          <span :style="{ color: calcTotal(row) >= 60 ? '#67c23a' : '#f56c6c', fontWeight: 600 }">
            {{ calcTotal(row) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" :disabled="!gradeInputAllowed" @click="handleSave(row)">保存</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="footer-bar">
      <el-button type="success" :icon="Check" :disabled="!gradeInputAllowed" @click="handleBatchSave">批量保存</el-button>
    </div>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Check } from '@element-plus/icons-vue'
import { getTeacherCourses } from '@/api/modules/teacher/course'
import { gradeInput, saveGrade, batchSaveGrade } from '@/api/modules/teacher/score'
import { onMounted } from 'vue'

const route = useRoute()

// 课程下拉
const courseOptions = ref([])

const queryForm = reactive({
  courseId: route.query.courseId ? Number(route.query.courseId) : ''
})

const loading = ref(false)
const tableData = ref([])
const gradeInputAllowed = ref(true)
const gradeInputMsg = ref('')

// 综合成绩 = 平时*0.3 + 期末*0.7
const calcTotal = (row) => {
  const daily = Number(row.dailyScore) || 0
  const final = Number(row.finalScore) || 0
  const total = daily * 0.3 + final * 0.7
  return Math.round(total * 10) / 10
}

// 拉取课程下拉
const fetchCourses = async () => {
  try {
    const res = await getTeacherCourses()
    courseOptions.value = res.data?.courseList || []
    if (queryForm.courseId) {
      handleQuery()
    }
  } catch (e) {
    // 拦截器已提示
  }
}

// 拉取成绩录入数据
const fetchGradeInput = async () => {
  if (!queryForm.courseId) {
    ElMessage.warning('请先选择课程')
    return
  }
  loading.value = true
  try {
    const res = await gradeInput(queryForm.courseId)
    const data = res.data || {}
    // 兜底初始化 dailyScore/finalScore
    const list = (data.studentList || []).map((item) => ({
      ...item,
      dailyScore: item.dailyScore ?? item.usualScore ?? 0,
      finalScore: item.finalScore ?? item.examScore ?? 0
    }))
    tableData.value = list
    gradeInputAllowed.value = data.gradeInputAllowed !== false
    gradeInputMsg.value = data.gradeInputMsg || ''
  } catch (e) {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}

// 查询
const handleQuery = () => {
  fetchGradeInput()
}

// 单条保存
const handleSave = async (row) => {
  if (!gradeInputAllowed.value) {
    ElMessage.warning(gradeInputMsg.value || '成绩录入未开放')
    return
  }
  try {
    await saveGrade({
      studentId: row.studentId || row.id,
      courseId: queryForm.courseId,
      dailyScore: row.dailyScore,
      finalScore: row.finalScore
    })
    ElMessage.success(`学生【${row.name}】成绩已保存，综合成绩：${calcTotal(row)}`)
    fetchGradeInput()
  } catch (e) {
    // 拦截器已提示
  }
}

// 批量保存
const handleBatchSave = async () => {
  if (!gradeInputAllowed.value) {
    ElMessage.warning(gradeInputMsg.value || '成绩录入未开放')
    return
  }
  if (tableData.value.length === 0) {
    ElMessage.warning('没有可保存的成绩记录')
    return
  }
  try {
    await batchSaveGrade({
      studentIds: tableData.value.map((r) => r.studentId || r.id),
      courseId: queryForm.courseId,
      dailyScores: tableData.value.map((r) => r.dailyScore),
      finalScores: tableData.value.map((r) => r.finalScore)
    })
    ElMessage.success(`已批量保存 ${tableData.value.length} 条成绩记录`)
    fetchGradeInput()
  } catch (e) {
    // 拦截器已提示
  }
}

onMounted(() => {
  fetchCourses()
})
</script>

<style scoped>
.search-bar {
  margin-bottom: 16px;
}
.footer-bar {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
