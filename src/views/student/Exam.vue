<!-- src/views/student/Exam.vue -->
<!-- 考试安排查询，含考试须知提示 -->
<!-- 接口：getExamList / getExamByDate（@/api/modules/student/exam） -->
<template>
  <el-card shadow="never">
    <el-form :inline="true" :model="queryForm" class="search-bar">
      <el-form-item label="考试日期">
        <el-date-picker
          v-model="queryForm.examDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择日期"
          clearable
          style="width: 200px"
          @change="handleDateChange"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loadExams">全部考试</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="examList" v-loading="loading" border stripe style="width: 100%">
      <el-table-column prop="courseName" label="课程名称" min-width="160" />
      <el-table-column prop="examDate" label="考试日期" width="130" align="center" />
      <el-table-column prop="examTime" label="考试时间" width="150" align="center" />
      <el-table-column prop="classroom" label="考试地点" width="160" />
      <el-table-column prop="remark" label="备注" min-width="160" />
    </el-table>

    <el-empty v-if="!loading && examList.length === 0" description="暂无考试安排" :image-size="80" style="margin-top: 16px" />

    <!-- 考试须知 -->
    <el-alert
      title="考试须知"
      type="info"
      show-icon
      :closable="false"
      style="margin-top: 16px"
    >
      <template #default>
        <ol class="notice-list">
          <li>请提前 15 分钟到达指定考场，凭学生证或一卡通入场，按座位号就座。</li>
          <li>除允许的文具外，书包、资料、手机等物品须放在考场指定位置，严禁随身携带。</li>
          <li>考试期间严禁使用任何通讯工具及电子设备，违者按作弊处理。</li>
          <li>开考 30 分钟后不得入场，开考 30 分钟内不得交卷出场。</li>
          <li>如有特殊情况需缓考，请提前向教务处提交书面申请并附相关证明。</li>
        </ol>
      </template>
    </el-alert>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getExamList, getExamByDate } from '@/api/modules/student/exam'

const loading = ref(false)
const examList = ref([])

const queryForm = reactive({
  examDate: ''
})

// 加载全部考试安排
const loadExams = async () => {
  queryForm.examDate = ''
  loading.value = true
  try {
    const res = await getExamList()
    examList.value = res.data?.examList || []
  } catch (err) {
    console.error('获取考试安排失败', err)
  } finally {
    loading.value = false
  }
}

// 按日期筛选
const handleDateChange = async (date) => {
  if (!date) {
    await loadExams()
    return
  }
  loading.value = true
  try {
    const res = await getExamByDate(date)
    examList.value = res.data?.examList || []
  } catch (err) {
    console.error('按日期查询考试安排失败', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadExams()
})
</script>

<style scoped>
.search-bar {
  margin-bottom: 16px;
}
.notice-list {
  margin: 8px 0 0;
  padding-left: 18px;
  line-height: 1.9;
  color: #606266;
}
</style>
