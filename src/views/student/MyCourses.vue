<!-- src/views/student/MyCourses.vue -->
<!-- 已选课程列表，支持退课与查看详情 -->
<!-- 接口：getMyCourses / dropCourse（@/api/modules/student/course） -->
<template>
  <el-card shadow="never">
    <el-alert
      v-if="!canDrop && dropHint"
      :title="dropHint"
      type="warning"
      show-icon
      :closable="false"
      style="margin-bottom: 16px"
    />

    <el-table :data="pagedData" v-loading="loading" border stripe style="width: 100%">
      <el-table-column prop="courseNo" label="课程编号" width="120" />
      <el-table-column prop="courseName" label="课程名称" min-width="150" />
      <el-table-column prop="teacherName" label="授课教师" width="110" />
      <el-table-column prop="credit" label="学分" width="80" align="center" />
      <el-table-column prop="hours" label="学时" width="80" align="center" />
      <el-table-column prop="timeLocation" label="上课时间地点" min-width="180" />
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.status" :type="statusTagType(row.status)">{{ row.status }}</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template #default="{ row }">
          <el-tooltip v-if="!canDrop" :content="dropHint || '当前不可退课'" placement="top">
            <el-button type="danger" size="small" disabled>退课</el-button>
          </el-tooltip>
          <el-button v-else type="danger" size="small" @click="handleDrop(row)">退课</el-button>
          <el-button type="primary" link size="small" @click="handleDetail(row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 16px; justify-content: flex-end"
      v-model:current-page="page.current"
      v-model:page-size="page.size"
      :page-sizes="[10, 20, 50]"
      :total="rawList.length"
      layout="total, sizes, prev, pager, next, jumper"
    />
  </el-card>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMyCourses, dropCourse } from '@/api/modules/student/course'

const router = useRouter()

const loading = ref(false)
// 退课开关
const canDrop = ref(false)
const dropHint = ref('')

// 分页参数
const page = reactive({
  current: 1,
  size: 10
})

// 已选课程列表（来自后端）
const rawList = ref([])

// 当前页数据
const pagedData = computed(() => {
  const start = (page.current - 1) * page.size
  return rawList.value.slice(start, start + page.size)
})

// 状态对应 tag 类型
const statusTagType = (status) => {
  if (status === '进行中') return 'success'
  if (status === '已结课') return 'info'
  return 'warning'
}

// 加载已选课程
const loadMyCourses = async () => {
  loading.value = true
  try {
    const res = await getMyCourses()
    const data = res.data || {}
    rawList.value = data.myCourseList || []
    canDrop.value = data.canDrop ?? false
    dropHint.value = data.dropHint || ''
  } catch (err) {
    console.error('获取已选课程失败', err)
  } finally {
    loading.value = false
  }
}

// 退课二次确认
const handleDrop = (row) => {
  ElMessageBox.confirm(`确认要退课【${row.courseName}】吗？退课后无法恢复，请谨慎操作。`, '退课确认', {
    confirmButtonText: '确认退课',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await dropCourse({ courseId: row.id })
        ElMessage.success('退课成功')
        await loadMyCourses()
      } catch (err) {
        console.error('退课失败', err)
      }
    })
    .catch(() => {
      ElMessage.info('已取消退课')
    })
}

// 查看详情
const handleDetail = (row) => {
  router.push(`/student/course-detail/${row.id}`)
}

onMounted(() => {
  loadMyCourses()
})
</script>

<style scoped>
</style>
