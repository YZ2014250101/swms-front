<!-- src/views/student/ScoreAppeal.vue -->
<!-- 成绩异议申诉，查看历史申诉并提交新申诉 -->
<template>
  <el-card shadow="never">
    <!-- 顶部选课程 -->
    <div class="filter-bar">
      <span class="label">选择课程：</span>
      <el-select v-model="selectedCourse" placeholder="请选择课程" clearable style="width: 260px" @change="handleCourseChange">
        <el-option v-for="item in courseList" :key="item.id" :label="item.courseName" :value="item.id" />
      </el-select>
      <el-button type="primary" :icon="Plus" class="appeal-btn" @click="handleOpenAppeal">提交申诉</el-button>
    </div>

    <!-- 历史申诉记录 -->
    <el-table :data="tableData" border stripe style="width: 100%; margin-top: 16px">
      <el-table-column prop="courseName" label="课程" width="160" />
      <el-table-column prop="content" label="申诉内容" min-width="240" show-overflow-tooltip />
      <el-table-column prop="appealTime" label="申诉时间" width="170" />
      <el-table-column label="状态" width="110" align="center">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 16px; justify-content: flex-end"
      v-model:current-page="page.current"
      v-model:page-size="page.size"
      :total="page.total"
      layout="total, prev, pager, next"
    />

    <!-- 提交申诉弹窗 -->
    <el-dialog v-model="dialogVisible" title="提交成绩申诉" width="520px">
      <el-form :model="appealForm" label-width="90px" ref="appealFormRef" :rules="rules">
        <el-form-item label="选择课程" prop="courseId">
          <el-select v-model="appealForm.courseId" placeholder="请选择课程" style="width: 100%">
            <el-option v-for="item in courseList" :key="item.id" :label="item.courseName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="申诉理由" prop="reason">
          <el-input
            v-model="appealForm.reason"
            type="textarea"
            :rows="5"
            placeholder="请详细描述申诉理由，例如对某题评分存在异议等"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitAppeal">提交</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 课程下拉
// TODO: 对接后端 我的课程列表接口
const courseList = ref([
  { id: 1, courseName: '数据结构' },
  { id: 2, courseName: '计算机网络' },
  { id: 3, courseName: '软件工程' }
])

const selectedCourse = ref('')

const page = reactive({
  current: 1,
  size: 10,
  total: 3
})

// mock 历史申诉记录
// TODO: 对接后端 申诉记录查询接口
const tableData = ref([
  { id: 1, courseName: '数据结构', content: '期末考试第三大题第二小题评分有异议，本人答案与标准答案一致但未给分。', appealTime: '2025-07-01 10:20:30', status: '已通过' },
  { id: 2, courseName: '计算机网络', content: '平时成绩记录有误，缺勤次数统计与实际不符。', appealTime: '2025-07-03 14:10:00', status: '待处理' },
  { id: 3, courseName: '高等数学', content: '期末试卷总分核算有误，请复核。', appealTime: '2025-07-05 09:00:00', status: '已驳回' }
])

// 状态 tag 类型
const statusTagType = (status) => {
  if (status === '已通过') return 'success'
  if (status === '待处理') return 'warning'
  return 'danger'
}

// 切换课程
const handleCourseChange = () => {
  // TODO: 对接后端 申诉记录查询接口
  ElMessage.success('课程已切换')
}

// 提交申诉弹窗
const dialogVisible = ref(false)
const appealFormRef = ref()
const appealForm = reactive({
  courseId: '',
  reason: ''
})

const rules = {
  courseId: [{ required: true, message: '请选择课程', trigger: 'change' }],
  reason: [{ required: true, message: '请输入申诉理由', trigger: 'blur' }]
}

const handleOpenAppeal = () => {
  appealForm.courseId = ''
  appealForm.reason = ''
  dialogVisible.value = true
}

// 提交申诉
const handleSubmitAppeal = () => {
  appealFormRef.value.validate((valid) => {
    if (!valid) return
    // TODO: 对接后端 提交申诉接口
    const course = courseList.value.find((item) => item.id === appealForm.courseId)
    tableData.value.unshift({
      id: Date.now(),
      courseName: course ? course.courseName : '',
      content: appealForm.reason,
      appealTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
      status: '待处理'
    })
    page.total += 1
    dialogVisible.value = false
    ElMessage.success('申诉已提交，请等待处理')
  })
}
</script>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
}
.label {
  font-size: 14px;
  color: #606266;
  margin-right: 8px;
}
.appeal-btn {
  margin-left: auto;
}
</style>
