<!-- src/views/student/ScoreAppeal.vue -->
<!-- 成绩异议申诉，查看历史成绩并提交申诉 -->
<!-- 接口：getGradeHistory / toAppeal / submitAppeal（@/api/modules/student/score） -->
<template>
  <el-card shadow="never">
    <div class="filter-bar">
      <span class="title">成绩申诉</span>
      <span class="hint">如对成绩有异议，可点击对应成绩行的"申诉"按钮提交申诉</span>
    </div>

    <!-- 成绩列表（含申诉状态） -->
    <el-table :data="pagedData" v-loading="loading" border stripe style="width: 100%; margin-top: 16px">
      <el-table-column prop="courseNo" label="课程编号" width="120" />
      <el-table-column prop="courseName" label="课程名称" min-width="160" />
      <el-table-column prop="credit" label="学分" width="80" align="center" />
      <el-table-column prop="dailyScore" label="平时成绩" width="100" align="center" />
      <el-table-column prop="finalScore" label="期末成绩" width="100" align="center" />
      <el-table-column prop="totalScore" label="综合成绩" width="100" align="center" />
      <el-table-column label="申诉状态" width="110" align="center">
        <template #default="{ row }">
          <el-tag :type="appealTagType(row.appealStatus)">{{ appealStatusText(row.appealStatus) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="canAppeal(row)"
            type="primary"
            link
            size="small"
            @click="handleOpenAppeal(row)"
          >申诉</el-button>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 16px; justify-content: flex-end"
      v-model:current-page="page.current"
      v-model:page-size="page.size"
      :total="gradeList.length"
      layout="total, prev, pager, next"
    />

    <!-- 提交申诉弹窗 -->
    <el-dialog v-model="dialogVisible" title="提交成绩申诉" width="560px">
      <div v-loading="appealLoading">
        <el-descriptions v-if="gradeEcho" :column="2" border size="small" style="margin-bottom: 16px">
          <el-descriptions-item label="课程">{{ gradeEcho.courseName }}</el-descriptions-item>
          <el-descriptions-item label="学分">{{ gradeEcho.credit }}</el-descriptions-item>
          <el-descriptions-item label="平时成绩">{{ gradeEcho.dailyScore }}</el-descriptions-item>
          <el-descriptions-item label="期末成绩">{{ gradeEcho.finalScore }}</el-descriptions-item>
          <el-descriptions-item label="综合成绩" :span="2">{{ gradeEcho.totalScore }}</el-descriptions-item>
        </el-descriptions>
        <el-form :model="appealForm" label-width="90px" ref="appealFormRef" :rules="rules">
          <el-form-item label="申诉理由" prop="appealReason">
            <el-input
              v-model="appealForm.appealReason"
              type="textarea"
              :rows="5"
              placeholder="请详细描述申诉理由，例如对某题评分存在异议等"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmitAppeal">提交</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getGradeHistory, toAppeal, submitAppeal } from '@/api/modules/student/score'

const loading = ref(false)
const gradeList = ref([])

const page = reactive({
  current: 1,
  size: 10
})

// 当前页数据
const pagedData = computed(() => {
  const start = (page.current - 1) * page.size
  return gradeList.value.slice(start, start + page.size)
})

// 申诉状态文案
const appealStatusText = (s) => {
  const map = { 0: '未申诉', 1: '申诉中', 2: '已通过', 3: '已驳回' }
  return map[s] ?? (s == null ? '未申诉' : s)
}
// 申诉状态 tag 类型
const appealTagType = (s) => {
  const map = { 0: 'info', 1: 'warning', 2: 'success', 3: 'danger' }
  return map[s] ?? 'info'
}
// 是否可申诉（未申诉或已驳回可再次发起，具体以后端校验为准）
const canAppeal = (row) => row.appealStatus == null || row.appealStatus === 0 || row.appealStatus === 3

// 加载成绩历史
const loadGrades = async () => {
  loading.value = true
  try {
    const res = await getGradeHistory()
    gradeList.value = res.data?.gradeList || []
  } catch (err) {
    console.error('获取成绩历史失败', err)
  } finally {
    loading.value = false
  }
}

// 提交申诉弹窗
const dialogVisible = ref(false)
const appealLoading = ref(false)
const submitting = ref(false)
const appealFormRef = ref()
const appealForm = reactive({
  gradeId: '',
  appealReason: ''
})
const gradeEcho = ref(null)

const rules = {
  appealReason: [{ required: true, message: '请输入申诉理由', trigger: 'blur' }]
}

// 打开申诉弹窗，回显成绩
const handleOpenAppeal = async (row) => {
  appealForm.gradeId = row.id
  appealForm.appealReason = ''
  gradeEcho.value = null
  dialogVisible.value = true
  appealLoading.value = true
  try {
    const res = await toAppeal(row.id)
    gradeEcho.value = res.data?.grade || null
  } catch (err) {
    console.error('获取申诉成绩回显失败', err)
  } finally {
    appealLoading.value = false
  }
}

// 提交申诉
const handleSubmitAppeal = () => {
  appealFormRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      await submitAppeal({ gradeId: appealForm.gradeId, appealReason: appealForm.appealReason })
      ElMessage.success('申诉已提交，请等待处理')
      dialogVisible.value = false
      await loadGrades()
    } catch (err) {
      console.error('提交申诉失败', err)
    } finally {
      submitting.value = false
    }
  })
}

onMounted(() => {
  loadGrades()
})
</script>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  gap: 16px;
}
.filter-bar .title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}
.filter-bar .hint {
  font-size: 13px;
  color: #909399;
}
</style>
