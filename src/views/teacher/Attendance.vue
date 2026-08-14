<!-- src/views/teacher/Attendance.vue -->
<!-- 课堂考勤，按课程与日期登记学生出勤状态，支持手动登记与提交 -->
<template>
  <el-card shadow="never">
    <el-form :inline="true" :model="queryForm" class="search-bar">
      <el-form-item label="课程">
        <el-select v-model="queryForm.courseId" placeholder="请选择课程" clearable style="width: 220px" @change="handleQuery">
          <el-option v-for="item in courseOptions" :key="item.id" :label="item.courseName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker v-model="queryForm.date" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 180px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="studentNo" label="学号" width="130" />
      <el-table-column prop="name" label="姓名" width="110" />
      <el-table-column label="出勤状态" width="160" align="center">
        <template #default="{ row }">
          <el-select v-model="row.status" placeholder="请选择" size="small" style="width: 120px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="200">
        <template #default="{ row }">
          <el-input v-model="row.remark" placeholder="请输入备注" size="small" clearable />
        </template>
      </el-table-column>
    </el-table>

    <div class="footer-bar">
      <el-button type="success" :icon="Check" @click="handleSubmit">提交考勤</el-button>
    </div>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Check } from '@element-plus/icons-vue'

// 课程下拉
// TODO: 对接后端 教师所授课程列表接口
const courseOptions = ref([
  { id: 1, courseName: '数据结构' },
  { id: 2, courseName: '计算机网络' },
  { id: 3, courseName: '软件工程' },
  { id: 4, courseName: '高等数学' }
])

// 出勤状态选项
const statusOptions = [
  { label: '出勤', value: '出勤' },
  { label: '迟到', value: '迟到' },
  { label: '早退', value: '早退' },
  { label: '缺勤', value: '缺勤' }
]

const queryForm = reactive({
  courseId: '',
  date: ''
})

// mock 考勤名单
// TODO: 对接后端 考勤名单接口，参数 courseId / date
const tableData = ref([
  { id: 1, studentNo: '20230101', name: '张三', status: '出勤', remark: '' },
  { id: 2, studentNo: '20230102', name: '李四', status: '迟到', remark: '迟到 10 分钟' },
  { id: 3, studentNo: '20230103', name: '王芳', status: '出勤', remark: '' },
  { id: 4, studentNo: '20230104', name: '刘洋', status: '缺勤', remark: '请假未到' },
  { id: 5, studentNo: '20230105', name: '赵敏', status: '早退', remark: '提前离开' }
])

// 查询
const handleQuery = () => {
  // TODO: 对接后端 考勤名单接口
  ElMessage.success('查询成功')
}

// 提交考勤
const handleSubmit = () => {
  if (!queryForm.courseId) {
    ElMessage.warning('请先选择课程')
    return
  }
  if (!queryForm.date) {
    ElMessage.warning('请先选择日期')
    return
  }
  // TODO: 对接后端 提交考勤接口
  ElMessage.success(`已提交 ${tableData.value.length} 名学生的考勤记录`)
}
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
