<!-- src/views/common/Notice.vue -->
<!-- 消息通知（所有角色共用）：列表 + 已读/清空 -->
<template>
  <div class="notice-page">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>消息通知</span>
          <el-button type="danger" text :icon="Delete" @click="handleClear">清空消息</el-button>
        </div>
      </template>
      <el-table :data="tableData" v-loading="loading" border stripe>
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <el-tag :type="typeTag(row.type)">{{ typeText(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="时间" width="180" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isRead ? 'info' : 'danger'" size="small">
              {{ row.isRead ? '已读' : '未读' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="handleRead(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { getNoticeList, readNotice, clearNotice } from '@/api/modules/common/notice'

const loading = ref(false)
const tableData = ref([])

function typeText(t) {
  return { select: '选课', score: '成绩', course: '课程', approval: '审批' }[t] || '通知'
}
function typeTag(t) {
  return { select: 'success', score: 'warning', course: '', approval: 'danger' }[t] || ''
}

async function loadData() {
  loading.value = true
  try {
    // TODO: 对接后端
    // const res = await getNoticeList()
    // tableData.value = res.data
    tableData.value = []
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function handleRead(row) {
  try {
    // TODO: 对接后端
    // await readNotice(row.id)
    row.isRead = 1
    ElMessage.success('已标记为已读')
  } catch (err) {
    console.error(err)
  }
}

function handleClear() {
  ElMessageBox.confirm('确定清空所有消息吗？', '提示', { type: 'warning' })
    .then(async () => {
      // TODO: 对接后端
      // await clearNotice()
      tableData.value = []
      ElMessage.success('已清空')
    })
    .catch(() => {})
}

onMounted(loadData)
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
