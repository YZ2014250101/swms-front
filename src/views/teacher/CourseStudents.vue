<!-- src/views/teacher/CourseStudents.vue -->
<!-- 授课班级学生名单查询，支持按课程筛选与导出 -->
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
        <el-button type="success" :icon="Download" @click="handleExport">导出名单</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="studentNo" label="学号" width="130" />
      <el-table-column prop="name" label="姓名" width="110" />
      <el-table-column prop="gender" label="性别" width="80" align="center" />
      <el-table-column prop="className" label="班级" width="160" />
      <el-table-column prop="phone" label="联系方式" width="150" />
      <el-table-column label="操作" width="120" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleDetail(row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="summary">
      <el-tag type="success" size="large">选课人数：{{ tableData.length }} 人</el-tag>
      <el-tag type="primary" size="large">男生：{{ maleCount }} 人</el-tag>
      <el-tag type="warning" size="large">女生：{{ femaleCount }} 人</el-tag>
    </div>
  </el-card>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Download } from '@element-plus/icons-vue'

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

// mock 学生名单
// TODO: 对接后端 授课班级学生名单接口，参数 courseId
const tableData = ref([
  { id: 1, studentNo: '20230101', name: '张三', gender: '男', className: '计算机2301班', phone: '13800138001' },
  { id: 2, studentNo: '20230102', name: '李四', gender: '男', className: '计算机2301班', phone: '13800138002' },
  { id: 3, studentNo: '20230103', name: '王芳', gender: '女', className: '计算机2301班', phone: '13800138003' },
  { id: 4, studentNo: '20230104', name: '刘洋', gender: '男', className: '计算机2301班', phone: '13800138004' },
  { id: 5, studentNo: '20230105', name: '赵敏', gender: '女', className: '计算机2301班', phone: '13800138005' }
])

// 性别统计
const maleCount = computed(() => tableData.value.filter((item) => item.gender === '男').length)
const femaleCount = computed(() => tableData.value.filter((item) => item.gender === '女').length)

// 查询
const handleQuery = () => {
  // TODO: 对接后端 授课班级学生名单接口
  ElMessage.success('查询成功')
}

// 导出
const handleExport = () => {
  // TODO: 对接后端 学生名单导出接口
  ElMessage.info('导出名单接口待对接')
}

// 查看详情
const handleDetail = (row) => {
  // TODO: 对接后端 学生详情接口
  ElMessage.info(`学生【${row.name}】详情待对接`)
}
</script>

<style scoped>
.search-bar {
  margin-bottom: 16px;
}
.summary {
  margin-top: 16px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
