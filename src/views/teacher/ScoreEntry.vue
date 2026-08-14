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

    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="studentNo" label="学号" width="130" />
      <el-table-column prop="name" label="姓名" width="110" />
      <el-table-column prop="className" label="班级" width="160" />
      <el-table-column label="平时成绩" width="160" align="center">
        <template #default="{ row }">
          <el-input-number v-model="row.usualScore" :min="0" :max="100" :precision="1" controls-position="right" size="small" style="width: 120px" />
        </template>
      </el-table-column>
      <el-table-column label="期末成绩" width="160" align="center">
        <template #default="{ row }">
          <el-input-number v-model="row.examScore" :min="0" :max="100" :precision="1" controls-position="right" size="small" style="width: 120px" />
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
          <el-button type="primary" link size="small" @click="handleSave(row)">保存</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="footer-bar">
      <el-button type="success" :icon="Check" @click="handleBatchSave">批量保存</el-button>
    </div>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Check } from '@element-plus/icons-vue'

const route = useRoute()

// 课程下拉
// TODO: 对接后端 教师所授课程列表接口
const courseOptions = ref([
  { id: 1, courseName: '数据结构' },
  { id: 2, courseName: '计算机网络' },
  { id: 3, courseName: '软件工程' },
  { id: 4, courseName: '高等数学' }
])

const queryForm = reactive({
  courseId: route.query.courseId ? Number(route.query.courseId) : ''
})

// mock 学生成绩数据
// TODO: 对接后端 成绩录入列表接口，参数 courseId
const tableData = ref([
  { id: 1, studentNo: '20230101', name: '张三', className: '计算机2301班', usualScore: 85, examScore: 78 },
  { id: 2, studentNo: '20230102', name: '李四', className: '计算机2301班', usualScore: 90, examScore: 82 },
  { id: 3, studentNo: '20230103', name: '王芳', className: '计算机2301班', usualScore: 78, examScore: 88 },
  { id: 4, studentNo: '20230104', name: '刘洋', className: '计算机2301班', usualScore: 70, examScore: 55 },
  { id: 5, studentNo: '20230105', name: '赵敏', className: '计算机2301班', usualScore: 92, examScore: 95 }
])

// 综合成绩 = 平时*0.3 + 期末*0.7
const calcTotal = (row) => {
  const total = (row.usualScore * 0.3 + row.examScore * 0.7)
  return Math.round(total * 10) / 10
}

// 查询
const handleQuery = () => {
  // TODO: 对接后端 成绩录入列表接口
  ElMessage.success('查询成功')
}

// 单条保存
const handleSave = (row) => {
  // TODO: 对接后端 单条成绩保存接口
  ElMessage.success(`学生【${row.name}】成绩已保存，综合成绩：${calcTotal(row)}`)
}

// 批量保存
const handleBatchSave = () => {
  // TODO: 对接后端 批量成绩保存接口
  ElMessage.success(`已批量保存 ${tableData.value.length} 条成绩记录`)
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
