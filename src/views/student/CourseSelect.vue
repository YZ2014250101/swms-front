<!-- src/views/student/CourseSelect.vue -->
<!-- 可选课程查询与选课/退课 -->
<!-- 接口：getCourseList / selectCourse（@/api/modules/student/course） -->
<template>
  <el-card shadow="never">
    <!-- 顶部搜索栏 -->
    <el-form :inline="true" :model="queryForm" class="search-bar">
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
      v-if="!canSelect"
      :title="selectHint"
      type="warning"
      show-icon
      :closable="false"
      style="margin-bottom: 16px"
    />

    <!-- 课程列表 -->
    <el-table :data="pagedData" v-loading="loading" border stripe style="width: 100%">
      <el-table-column prop="courseNo" label="课程编号" width="120" />
      <el-table-column prop="courseName" label="课程名称" min-width="160" />
      <el-table-column prop="teacherName" label="授课教师" width="120" />
      <el-table-column prop="credit" label="学分" width="80" align="center" />
      <el-table-column prop="hours" label="学时" width="80" align="center" />
      <el-table-column prop="classTime" label="上课时间" min-width="140" />
      <el-table-column label="已选/容量" width="110" align="center">
        <template #default="{ row }">
          <span :class="{ 'full-text': row.selectedNum >= row.maxNum }">
            {{ row.selectedNum }}/{{ row.maxNum }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center" fixed="right">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            :disabled="!canSelect || row.selectedNum >= row.maxNum || row.selectedFlag"
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
      :total="filteredList.length"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleQuery"
      @current-change="handleQuery"
    />
  </el-card>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getCourseList, selectCourse } from '@/api/modules/student/course'

const loading = ref(false)

// 选课开关相关
const globalSelectable = ref(false)
const selectStartTime = ref('')
const selectEndTime = ref('')
const inSelectTimeRange = ref(false)

// 是否允许选课
const canSelect = computed(() => globalSelectable.value && inSelectTimeRange.value)

// 选课禁用提示
const selectHint = computed(() => {
  if (!globalSelectable.value) return '当前选课功能未开放，选课按钮已禁用'
  if (!inSelectTimeRange.value) {
    return selectEndTime.value
      ? `当前不在选课周期内，选课时间截至 ${selectEndTime.value}`
      : '当前不在选课周期内，选课按钮已禁用'
  }
  return ''
})

// 查询表单
const queryForm = reactive({
  courseName: '',
  teacher: ''
})

// 分页参数
const page = reactive({
  current: 1,
  size: 10
})

// 全部课程列表（来自后端）
const rawList = ref([])

// 客户端过滤
const filteredList = computed(() => {
  return rawList.value.filter((c) => {
    if (queryForm.courseName && !(c.courseName || '').includes(queryForm.courseName)) return false
    if (queryForm.teacher && !(c.teacherName || '').includes(queryForm.teacher)) return false
    return true
  })
})

// 当前页数据
const pagedData = computed(() => {
  const start = (page.current - 1) * page.size
  return filteredList.value.slice(start, start + page.size)
})

// 加载可选课程
const loadCourses = async () => {
  loading.value = true
  try {
    const res = await getCourseList()
    const data = res.data || {}
    rawList.value = data.courseList || []
    globalSelectable.value = data.globalSelectable ?? false
    selectStartTime.value = data.selectStartTime || ''
    selectEndTime.value = data.selectEndTime || ''
    inSelectTimeRange.value = data.inSelectTimeRange ?? false
  } catch (err) {
    console.error('获取课程列表失败', err)
  } finally {
    loading.value = false
  }
}

// 查询
const handleQuery = () => {
  page.current = 1
}

// 重置
const handleReset = () => {
  queryForm.courseName = ''
  queryForm.teacher = ''
  page.current = 1
}

// 选课
const handleSelect = async (row) => {
  try {
    await selectCourse({ courseId: row.id })
    ElMessage.success(`已成功选课：${row.courseName}`)
    await loadCourses()
  } catch (err) {
    // 拦截器已提示错误
    console.error('选课失败', err)
  }
}

onMounted(() => {
  loadCourses()
})
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
