<!-- src/views/student/CourseSelect.vue -->
<!-- 可选课程查询与选课/退课 -->
<template>
  <el-card shadow="never">
    <!-- 顶部搜索栏 -->
    <el-form :inline="true" :model="queryForm" class="search-bar">
      <el-form-item label="学期">
        <el-select v-model="queryForm.semester" placeholder="请选择学期" clearable style="width: 180px">
          <el-option v-for="item in semesterOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="课程名称">
        <el-input v-model="queryForm.courseName" placeholder="请输入课程名称" clearable style="width: 180px" />
      </el-form-item>
      <el-form-item label="授课教师">
        <el-input v-model="queryForm.teacher" placeholder="请输入授课教师" clearable style="width: 180px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 选课周期外提示 -->
    <el-alert
      v-if="!inSelectPeriod"
      title="当前不在选课周期内，选课按钮已禁用"
      type="warning"
      show-icon
      :closable="false"
      style="margin-bottom: 16px"
    />

    <!-- 课程列表 -->
    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="courseCode" label="课程编号" width="120" />
      <el-table-column prop="courseName" label="课程名称" min-width="160" />
      <el-table-column prop="teacher" label="授课教师" width="120" />
      <el-table-column prop="credit" label="学分" width="80" align="center" />
      <el-table-column prop="hours" label="学时" width="80" align="center" />
      <el-table-column prop="classTime" label="上课时间" min-width="140" />
      <el-table-column label="已选/容量" width="110" align="center">
        <template #default="{ row }">
          <span :class="{ 'full-text': row.selected >= row.capacity }">
            {{ row.selected }}/{{ row.capacity }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center" fixed="right">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            :disabled="!inSelectPeriod || row.selected >= row.capacity || row.selectedFlag"
            @click="handleSelect(row)"
          >
            {{ row.selectedFlag ? '已选' : '选课' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      style="margin-top: 16px; justify-content: flex-end"
      v-model:current-page="page.current"
      v-model:page-size="page.size"
      :page-sizes="[10, 20, 50]"
      :total="page.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleQuery"
      @current-change="handleQuery"
    />
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'

// 是否处于选课周期内
// TODO: 对接后端 选课周期查询接口
const inSelectPeriod = ref(true)

// 学期下拉数据
const semesterOptions = ref(['2025-2026 第一学期', '2024-2025 第二学期', '2024-2025 第一学期'])

// 查询表单
const queryForm = reactive({
  semester: '',
  courseName: '',
  teacher: ''
})

// 分页参数
const page = reactive({
  current: 1,
  size: 10,
  total: 4
})

// mock 课程列表
// TODO: 对接后端 可选课程查询接口
const tableData = ref([
  { id: 1, courseCode: 'CS101', courseName: '数据结构', teacher: '张伟', credit: 4, hours: 64, classTime: '周一 1-2节 / 周三 3-4节', selected: 95, capacity: 120, selectedFlag: false },
  { id: 2, courseCode: 'CS102', courseName: '操作系统', teacher: '李娜', credit: 3, hours: 48, classTime: '周二 5-6节 / 周四 7-8节', selected: 60, capacity: 60, selectedFlag: false },
  { id: 3, courseCode: 'CS103', courseName: '计算机网络', teacher: '王强', credit: 3, hours: 48, classTime: '周三 1-2节', selected: 30, capacity: 80, selectedFlag: false },
  { id: 4, courseCode: 'CS104', courseName: '软件工程', teacher: '赵敏', credit: 2, hours: 32, classTime: '周五 3-4节', selected: 50, capacity: 100, selectedFlag: false }
])

// 查询
const handleQuery = () => {
  // TODO: 对接后端 可选课程查询接口
  ElMessage.success('查询成功')
}

// 重置
const handleReset = () => {
  queryForm.semester = ''
  queryForm.courseName = ''
  queryForm.teacher = ''
  handleQuery()
}

// 选课
const handleSelect = (row) => {
  // TODO: 对接后端 选课接口
  row.selected += 1
  row.selectedFlag = true
  ElMessage.success(`已成功选课：${row.courseName}`)
}
</script>

<style scoped>
.search-bar {
  margin-bottom: 16px;
}
.full-text {
  color: #f56c6c;
  font-weight: 600;
}
</style>
