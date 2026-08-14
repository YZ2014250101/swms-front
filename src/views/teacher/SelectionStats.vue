<!-- src/views/teacher/SelectionStats.vue -->
<!-- 选课学生统计与监控，含统计卡片与选课明细 -->
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
        <el-button type="success" :icon="Download" @click="handleExport">导出</el-button>
      </el-form-item>
    </el-form>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value">{{ stats.selectedCount }}</div>
          <div class="stat-title">已选人数</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value">{{ stats.capacity }}</div>
          <div class="stat-title">课程容量</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value">{{ selectionRate }}%</div>
          <div class="stat-title">选课率</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 选课学生明细 -->
    <el-table :data="tableData" border stripe style="width: 100%; margin-top: 16px">
      <el-table-column prop="studentNo" label="学号" width="130" />
      <el-table-column prop="name" label="姓名" width="110" />
      <el-table-column prop="className" label="班级" width="160" />
      <el-table-column prop="selectTime" label="选课时间" min-width="180" />
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Download } from '@element-plus/icons-vue'

// 课程下拉
// TODO: 对接后端 教师所授课程列表接口
const courseOptions = ref([
  { id: 1, courseName: '数据结构' },
  { id: 2, courseName: '计算机网络' },
  { id: 3, courseName: '软件工程' },
  { id: 4, courseName: '高等数学' }
])

const queryForm = reactive({
  courseId: ''
})

// 统计数据
// TODO: 对接后端 选课统计接口，参数 courseId
const stats = reactive({
  selectedCount: 5,
  capacity: 60
})

// 选课率
const selectionRate = computed(() => {
  if (stats.capacity === 0) return 0
  return ((stats.selectedCount / stats.capacity) * 100).toFixed(1)
})

// mock 选课学生明细
// TODO: 对接后端 选课学生明细接口，参数 courseId
const tableData = ref([
  { studentNo: '20230101', name: '张三', className: '计算机2301班', selectTime: '2025-08-25 09:30:12' },
  { studentNo: '20230102', name: '李四', className: '计算机2301班', selectTime: '2025-08-25 09:35:48' },
  { studentNo: '20230103', name: '王芳', className: '计算机2301班', selectTime: '2025-08-25 10:12:05' },
  { studentNo: '20230201', name: '陈晨', className: '计算机2302班', selectTime: '2025-08-25 10:20:33' },
  { studentNo: '20230202', name: '林晓', className: '计算机2302班', selectTime: '2025-08-25 11:05:19' }
])

// 查询
const handleQuery = () => {
  // TODO: 对接后端 选课统计与明细接口
  ElMessage.success('查询成功')
}

// 导出
const handleExport = () => {
  // TODO: 对接后端 选课明细导出接口
  ElMessage.info('导出接口待对接')
}
</script>

<style scoped>
.search-bar {
  margin-bottom: 16px;
}
.stat-row {
  margin-bottom: 8px;
}
.stat-card {
  text-align: center;
}
.stat-value {
  font-size: 32px;
  font-weight: 600;
  color: #165DFF;
}
.stat-title {
  font-size: 14px;
  color: #909399;
  margin-top: 6px;
}
</style>
