<!-- src/views/common/Profile.vue -->
<!-- 个人信息：按角色调用各端 myInfo 接口展示（后端暂无修改接口，只读） -->
<template>
  <div class="profile-page">
    <el-card shadow="never" v-loading="loading">
      <template #header><span>个人信息</span></template>
      <el-alert
        v-if="errorMsg"
        :title="errorMsg"
        type="error"
        show-icon
        :closable="false"
        style="margin-bottom: 16px"
      />
      <el-descriptions v-else :column="2" border>
        <el-descriptions-item label="姓名">{{ info.name }}</el-descriptions-item>
        <!-- 学生字段 -->
        <template v-if="role === 'student'">
          <el-descriptions-item label="学号">{{ info.studentId }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ info.gender }}</el-descriptions-item>
          <el-descriptions-item label="专业">{{ info.major }}</el-descriptions-item>
        </template>
        <!-- 教师字段 -->
        <template v-else-if="role === 'teacher'">
          <el-descriptions-item label="工号">{{ info.teacherId }}</el-descriptions-item>
          <el-descriptions-item label="院系">{{ info.department }}</el-descriptions-item>
          <el-descriptions-item label="职称">{{ info.title }}</el-descriptions-item>
        </template>
        <!-- 管理员字段 -->
        <template v-else-if="role === 'admin'">
          <el-descriptions-item label="管理员ID">{{ info.adminId }}</el-descriptions-item>
        </template>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { getMyInfo } from '@/api/modules/common/profile'

const userStore = useUserStore()
const role = computed(() => userStore.role)
const loading = ref(false)
const errorMsg = ref('')
const info = reactive({})

async function loadInfo() {
  loading.value = true
  errorMsg.value = ''
  try {
    const res = await getMyInfo(userStore.role)
    Object.assign(info, res.data || {})
  } catch (err) {
    console.error('获取个人信息失败', err)
    errorMsg.value = '获取个人信息失败，请检查后端接口 /' + userStore.role + '/myInfo'
  } finally {
    loading.value = false
  }
}

onMounted(loadInfo)
</script>
