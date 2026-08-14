<!-- src/views/common/AnnouncementDetail.vue -->
<!-- 公告详情（所有角色共用） -->
<template>
  <div class="detail-page">
    <el-card shadow="never" v-loading="loading">
      <template #header>
        <div class="detail-header">
          <el-button text :icon="ArrowLeft" @click="goBack">返回</el-button>
          <span>{{ detail.title }}</span>
        </div>
      </template>
      <div class="detail-meta">
        <span>发布人：{{ detail.publisher }}</span>
        <el-divider direction="vertical" />
        <span>分类：{{ detail.category }}</span>
        <el-divider direction="vertical" />
        <span>发布时间：{{ detail.publishTime }}</span>
      </div>
      <el-divider />
      <div class="detail-content" v-html="detail.content"></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getAnnouncementDetail } from '@/api/modules/common/announcement'
import { useUserStore } from '@/store/modules/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const detail = reactive({
  title: '',
  publisher: '',
  category: '',
  publishTime: '',
  content: ''
})

async function loadDetail() {
  loading.value = true
  try {
    // 按角色调公告详情接口，返回 {announcement}
    const res = await getAnnouncementDetail(userStore.role, route.params.id)
    Object.assign(detail, res.data?.announcement || res.data || {})
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.back()
}

onMounted(loadDetail)
</script>

<style scoped>
.detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 500;
}
.detail-meta {
  color: #909399;
  font-size: 13px;
}
.detail-content {
  line-height: 1.8;
  color: #303133;
}
</style>
