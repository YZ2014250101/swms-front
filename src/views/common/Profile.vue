<!-- src/views/common/Profile.vue -->
<!-- 个人信息：查看与修改（所有角色共用） -->
<template>
  <div class="profile-page">
    <el-card shadow="never">
      <template #header><span>个人信息</span></template>
      <el-row :gutter="24">
        <el-col :span="8">
          <div class="avatar-box">
            <el-avatar :size="100" :icon="UserFilled" />
            <el-button text type="primary" @click="handleAvatar">更换头像</el-button>
          </div>
        </el-col>
        <el-col :span="16">
          <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="账号">
              <el-input v-model="form.userId" disabled />
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="loading" @click="handleSave">保存修改</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { UserFilled } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import { updateProfile } from '@/api/modules/common/auth'
import { phoneValidator, emailValidator } from '@/utils/validate'

const userStore = useUserStore()
console.log(userStore.userInfo)
const formRef = ref()
const loading = ref(false)

const form = reactive({
  userId: '',
  name: '',
  phone: '',
  email: ''
})

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [{ validator: phoneValidator, trigger: 'blur' }],
  email: [{ validator: emailValidator, trigger: 'blur' }]
}

function loadInfo() {
  // 从 store 取当前用户信息
  const info = userStore.userInfo || {}
  form.userId = info.userId || ''
  form.name = info.name || ''
  form.phone = info.phone || ''
  form.email = info.email || ''
}

async function handleSave() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      // TODO: 对接后端
      // await updateProfile(form)
      userStore.setUserInfoAction({ ...userStore.userInfo, ...form })
      ElMessage.success('保存成功')
    } catch (err) {
      console.error(err)
    } finally {
      loading.value = false
    }
  })
}

function handleReset() {
  loadInfo()
}

function handleAvatar() {
  ElMessage.info('头像上传功能待对接')
}

onMounted(loadInfo)
</script>

<style scoped>
.avatar-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
</style>
