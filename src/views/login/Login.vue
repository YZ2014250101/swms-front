<!-- src/views/login/Login.vue -->
<!-- 登录页：角色选择 + 账号密码 + 验证码（三端统一入口） -->
<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">教务管理系统</h2>
      <p class="login-subtitle">Student Work Management System</p>

      <el-form ref="loginFormRef" :model="form" :rules="rules" size="large">
        <el-form-item prop="role">  
          <el-select v-model="form.role" placeholder="请选择登录身份" style="width: 100%">
            <el-option label="学生" value="student" />
            <el-option label="教师" value="teacher" />
            <el-option label="系统管理员" value="admin" />
          </el-select>
        </el-form-item>

        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="输入学号 / 工号 / 管理员账号"
            :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="输入登录密码"
            :prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item prop="code">
          <div class="code-row">
            <el-input v-model="form.code" placeholder="验证码" :prefix-icon="Key" />
            <div class="code-img" @click="refreshCode">
              <img v-if="codeUrl" :src="codeUrl" alt="验证码" />
              <span v-else>点击获取</span>
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
          >
            立即登录
          </el-button>
        </el-form-item>

        <div class="login-footer">
          <el-link type="primary" :underline="false" @click="handleForget">忘记密码？</el-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Key } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import { ROLE_HOME } from '@/constants/role'
import { login } from '@/api/modules/common/auth'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loginFormRef = ref()
const loading = ref(false)
// 验证码图片地址（后端返回 base64 或图片流）
const codeUrl = ref('')

const form = reactive({
  role: '',
  username: '',
  password: '',
  code: ''
})

const rules = {
  role: [{ required: true, message: '请选择登录身份', trigger: 'change' }],
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

// 获取验证码
function refreshCode() {
  // TODO: 对接后端验证码接口
  // codeUrl.value = `${import.meta.env.VITE_API_BASE_URL}/common/captcha?t=${Date.now()}`
}

// 登录
async function handleLogin() {
  if (!loginFormRef.value) return
  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    form.role = form.role.toLowerCase()
    form.username = form.username.trim()
    form.password = form.password.trim()
    form.code = form.code.trim()

    try {
      // 调用后端登录接口（按角色路由到 /student/doLogin 等）
      // request.js 拦截器已处理 code!==200，失败会抛错进入 catch
      console.log('登录请求参数:', form)
      
      const res = await login({
        role: form.role,
        username: form.username,
        password: form.password,
        code: form.code
      })
      
      // 后端返回 data: { token, role, userId, name, studentId|teacherId|adminId }
      const data = res.data || {}
      userStore.loginAction({
        token: data.token,
        role: data.role || form.role,
        userInfo: {
          userId: data.userId,
          name: data.name,
          studentId: data.studentId,
          teacherId: data.teacherId,
          adminId: data.adminId
        }
      })
      ElMessage.success('登录成功')
      const redirect = route.query.redirect
      router.push(redirect || ROLE_HOME[form.role] || '/login') 
    } catch (err) {
      console.error('登录请求异常', err)
    } finally {
      loading.value = false
    }
  })
}

function handleForget() {
  ElMessage.info('请联系管理员重置密码')
}

onMounted(() => {
  refreshCode()
})
</script>

<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.login-card {
  width: 420px;
  padding: 40px 36px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
.login-title {
  text-align: center;
  margin: 0 0 4px;
  color: #303133;
  font-size: 26px;
}
.login-subtitle {
  text-align: center;
  color: #909399;
  font-size: 12px;
  margin-bottom: 30px;
}
.code-row {
  display: flex;
  gap: 12px;
  width: 100%;
}
.code-img {
  width: 120px;
  height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  color: #909399;
  flex-shrink: 0;
  overflow: hidden;
}
.code-img img {
  width: 100%;
  height: 100%;
}
.login-btn {
  width: 100%;
}
.login-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
