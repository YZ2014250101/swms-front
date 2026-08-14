<!-- src/views/common/Announcement.vue -->
<!-- 系统公告列表（所有角色共用） -->
<template>
  <div class="announcement-page">
    <el-card shadow="never">
      <template #header><span>系统公告</span></template>
      <el-table :data="tableData" v-loading="loading" border stripe>
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="title" label="标题" min-width="240">
          <template #default="{ row }">
            <el-link type="primary" :underline="false" @click="goDetail(row)">{{ row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="publisher" label="发布人" width="120" />
        <el-table-column prop="publishTime" label="发布时间" width="180" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="goDetail(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { getAnnouncementList } from '@/api/modules/common/announcement'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const tableData = ref([])

async function loadData() {
  loading.value = true
  try {
    // TODO: 对接后端
    // const res = await getAnnouncementList()
    // tableData.value = res.data
    tableData.value = []
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

function goDetail(row) {
  router.push(`/${userStore.role}/announcement/${row.id}`)
}

onMounted(loadData)
</script>
