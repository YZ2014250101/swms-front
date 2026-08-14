<!-- src/views/student/MyCourses.vue -->
<!-- 已选课程列表，支持退课与查看详情 -->
<template>
  <el-card shadow="never">
    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="courseCode" label="课程编号" width="120" />
      <el-table-column prop="courseName" label="课程名称" min-width="150" />
      <el-table-column prop="teacher" label="授课教师" width="110" />
      <el-table-column prop="credit" label="学分" width="80" align="center" />
      <el-table-column prop="hours" label="学时" width="80" align="center" />
      <el-table-column prop="timeLocation" label="上课时间地点" min-width="180" />
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="danger" size="small" :disabled="row.status === '已结课'" @click="handleDrop(row)">退课</el-button>
          <el-button type="primary" link size="small" @click="handleDetail(row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 16px; justify-content: flex-end"
      v-model:current-page="page.current"
      v-model:page-size="page.size"
      :page-sizes="[10, 20, 50]"
      :total="page.total"
      layout="total, sizes, prev, pager, next, jumper"
    />
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

// 分页参数
const page = reactive({
  current: 1,
  size: 10,
  total: 4
})

// mock 已选课程列表
// TODO: 对接后端 我的已选课程列表接口
const tableData = ref([
  { id: 1, courseCode: 'CS101', courseName: '数据结构', teacher: '张伟', credit: 4, hours: 64, timeLocation: '周一 1-2节 教学楼A301 / 周三 3-4节 教学楼A301', status: '进行中' },
  { id: 2, courseCode: 'CS103', courseName: '计算机网络', teacher: '王强', credit: 3, hours: 48, timeLocation: '周三 1-2节 教学楼B205', status: '进行中' },
  { id: 3, courseCode: 'CS104', courseName: '软件工程', teacher: '赵敏', credit: 2, hours: 32, timeLocation: '周五 3-4节 教学楼C102', status: '进行中' },
  { id: 4, courseCode: 'CS100', courseName: '高等数学', teacher: '刘洋', credit: 5, hours: 80, timeLocation: '周二 1-2节 教学楼A101 / 周四 1-2节 教学楼A101', status: '已结课' }
])

// 状态对应 tag 类型
const statusTagType = (status) => {
  if (status === '进行中') return 'success'
  if (status === '已结课') return 'info'
  return 'warning'
}

// 退课二次确认
const handleDrop = (row) => {
  ElMessageBox.confirm(`确认要退课【${row.courseName}】吗？退课后无法恢复，请谨慎操作。`, '退课确认', {
    confirmButtonText: '确认退课',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // TODO: 对接后端 退课接口
      const idx = tableData.value.findIndex((item) => item.id === row.id)
      if (idx !== -1) {
        tableData.value.splice(idx, 1)
        page.total -= 1
      }
      ElMessage.success('退课成功')
    })
    .catch(() => {
      ElMessage.info('已取消退课')
    })
}

// 查看详情
const handleDetail = (row) => {
  router.push(`/student/course-detail/${row.id}`)
}
</script>

<style scoped>
</style>
