<!-- src/views/teacher/Homework.vue -->
<!-- 作业管理，支持发布作业与批改学生提交 -->
<template>
  <el-card shadow="never">
    <div class="toolbar">
      <el-button type="primary" :icon="Plus" @click="handlePublish">发布作业</el-button>
    </div>

    <!-- 已发布作业列表 -->
    <el-table :data="tableData" border stripe style="width: 100%; margin-top: 16px">
      <el-table-column prop="name" label="作业名称" min-width="180" />
      <el-table-column prop="courseName" label="课程" width="140" />
      <el-table-column prop="deadline" label="截止时间" width="170" />
      <el-table-column label="已提交" width="100" align="center">
        <template #default="{ row }">
          <el-tag type="success">{{ row.submitted }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="未提交" width="100" align="center">
        <template #default="{ row }">
          <el-tag type="danger">{{ row.unsubmitted }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleGrade(row)">批改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 发布作业弹窗 -->
    <el-dialog v-model="publishDialog" title="发布作业" width="520px">
      <el-form :model="publishForm" label-width="90px">
        <el-form-item label="作业标题">
          <el-input v-model="publishForm.name" placeholder="请输入作业标题" />
        </el-form-item>
        <el-form-item label="所属课程">
          <el-select v-model="publishForm.courseId" placeholder="请选择课程" style="width: 100%">
            <el-option v-for="item in courseOptions" :key="item.id" :label="item.courseName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止时间">
          <el-date-picker v-model="publishForm.deadline" type="datetime" placeholder="选择截止时间" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
        </el-form-item>
        <el-form-item label="作业要求">
          <el-input v-model="publishForm.requirement" type="textarea" :rows="4" placeholder="请输入作业要求" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="publishDialog = false">取消</el-button>
        <el-button type="primary" @click="handlePublishConfirm">确认发布</el-button>
      </template>
    </el-dialog>

    <!-- 批改弹窗：学生提交列表 -->
    <el-dialog v-model="gradeDialog" title="批改作业" width="800px">
      <div class="grade-header">作业：{{ currentHomework.name }}（{{ currentHomework.courseName }}）</div>
      <el-table :data="submissionList" border stripe style="width: 100%">
        <el-table-column prop="studentNo" label="学号" width="120" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="submitTime" label="提交时间" width="170" />
        <el-table-column label="得分" width="140" align="center">
          <template #default="{ row }">
            <el-input-number v-model="row.score" :min="0" :max="100" :precision="1" controls-position="right" size="small" style="width: 110px" />
          </template>
        </el-table-column>
        <el-table-column label="评语" min-width="160">
          <template #default="{ row }">
            <el-input v-model="row.comment" placeholder="请输入评语" size="small" clearable />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleSaveGrade(row)">保存</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 课程下拉
// TODO: 对接后端 教师所授课程列表接口
const courseOptions = ref([
  { id: 1, courseName: '数据结构' },
  { id: 2, courseName: '计算机网络' },
  { id: 3, courseName: '软件工程' }
])

// mock 已发布作业列表
// TODO: 对接后端 教师作业列表接口
const tableData = ref([
  { id: 1, name: '实验一 线性表实现', courseName: '数据结构', deadline: '2025-09-20 23:59:59', submitted: 38, unsubmitted: 2 },
  { id: 2, name: '第二章 课后习题', courseName: '计算机网络', deadline: '2025-10-05 23:59:59', submitted: 30, unsubmitted: 10 },
  { id: 3, name: '需求分析报告', courseName: '软件工程', deadline: '2025-10-15 23:59:59', submitted: 25, unsubmitted: 5 }
])

// 发布作业弹窗
const publishDialog = ref(false)
const publishForm = reactive({
  name: '',
  courseId: '',
  deadline: '',
  requirement: ''
})

const handlePublish = () => {
  publishForm.name = ''
  publishForm.courseId = ''
  publishForm.deadline = ''
  publishForm.requirement = ''
  publishDialog.value = true
}

// 确认发布
const handlePublishConfirm = () => {
  if (!publishForm.name) {
    ElMessage.warning('请输入作业标题')
    return
  }
  if (!publishForm.courseId) {
    ElMessage.warning('请选择所属课程')
    return
  }
  // TODO: 对接后端 发布作业接口
  const course = courseOptions.value.find((c) => c.id === publishForm.courseId)
  tableData.value.push({
    id: Date.now(),
    name: publishForm.name,
    courseName: course ? course.courseName : '',
    deadline: publishForm.deadline,
    submitted: 0,
    unsubmitted: 0
  })
  publishDialog.value = false
  ElMessage.success('作业发布成功')
}

// 批改弹窗
const gradeDialog = ref(false)
const currentHomework = reactive({ id: null, name: '', courseName: '' })

// mock 学生提交列表
// TODO: 对接后端 作业提交列表接口，参数 homeworkId
const submissionList = ref([])

const handleGrade = (row) => {
  currentHomework.id = row.id
  currentHomework.name = row.name
  currentHomework.courseName = row.courseName
  // TODO: 对接后端 作业提交列表接口
  submissionList.value = [
    { id: 1, studentNo: '20230101', name: '张三', submitTime: '2025-09-18 20:15:30', score: 0, comment: '' },
    { id: 2, studentNo: '20230102', name: '李四', submitTime: '2025-09-19 10:20:00', score: 0, comment: '' },
    { id: 3, studentNo: '20230103', name: '王芳', submitTime: '2025-09-19 22:05:45', score: 0, comment: '' }
  ]
  gradeDialog.value = true
}

// 保存单条批改
const handleSaveGrade = (row) => {
  // TODO: 对接后端 作业批改保存接口
  ElMessage.success(`学生【${row.name}】批改已保存，得分：${row.score}`)
}
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: flex-end;
}
.grade-header {
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}
</style>
