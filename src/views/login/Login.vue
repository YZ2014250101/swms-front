<template>
  <div class="login-container">
    <div class="login-card">
      <h2>教务管理系统登录</h2>

      <!-- 角色选择下拉框 -->
      <div class="form-row">
        <label>登录身份</label>
        <select v-model="form.userType" class="select-box">
          <option value="">请选择身份</option>
          <option value="student">学生</option>
          <option value="teacher">教师</option>
          <option value="admin">系统管理员</option>
        </select>
      </div>

      <!-- 账号输入框 -->
      <div class="form-row">
        <label>账号</label>
        <input
          v-model="form.username"
          type="text"
          placeholder="输入学号/工号/管理员账号"
          class="input-box"
        />
      </div>

      <!-- 密码输入框 -->
      <div class="form-row">
        <label>密码</label>
        <input
          v-model="form.password"
          type="password"
          placeholder="输入登录密码"
          class="input-box"
        />
      </div>

      <!-- 登录按钮 -->
      <button @click="handleLogin" class="login-btn">立即登录</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// 表单数据绑定
const form = ref({
  userType: '',
  username: '',
  password: ''
})

// 登录提交方法
const handleLogin = async () => {
  // 简单前端校验
  if (!form.value.userType) {
    alert('请先选择登录身份')
    return
  }
  if (!form.value.username || !form.value.password) {
    alert('账号和密码不能为空')
    return
  }

  try {
    // 请求后端登录接口，携带userType角色参数
    let res
      // 根据角色自动使用对应登录接口
      switch (form.value.userType) {
        case 'student':
          res = await axios.post('/api/student/doLogin', null, {
          params: {
              username: form.value.username,
              password: form.value.password,
              userType: form.value.userType
          }
        })
          break
        case 'teacher':
          res = await axios.post('/api/teacher/index', null, {
          params: {
              username: form.value.username,
              password: form.value.password,
              userType: form.value.userType
          }
        })
          break
        case 'admin':
          res = await axios.post('/api/admin/index', null, {
          params: {
              username: form.value.username,
              password: form.value.password,
              userType: form.value.userType
          }
        })
          break
      }    


    // 判断后端返回结果
    if (res.data.code === 200) {
      const loginData = res.data.data
      // 存储token和用户信息到本地存储
      localStorage.setItem('token', loginData.token)
      localStorage.setItem('userInfo', JSON.stringify(loginData))

      // 根据角色自动跳转对应首页
      switch (loginData.role) {
        case 'student':
          router.push('/student/index')
          break
        case 'teacher':
          router.push('/teacher/index')
          break
        case 'admin':
          router.push('/admin/index')
          break
      }
    } else {
      // 弹出后端错误提示
      alert(res.data.msg)
    }
  } catch (error) {
    console.error('登录请求异常：', error)
    alert('服务器连接失败，请检查后端是否启动')
  }
}
</script>

<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 420px;
  padding: 36px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-row {
  margin-bottom: 22px;
}

.form-row label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #555;
}

.input-box, .select-box {
  width: 100%;
  box-sizing: border-box;
  height: 42px;
  padding: 0 12px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 15px;
}

.login-btn {
  width: 100%;
  height: 44px;
  background-color: #165DFF;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.login-btn:hover {
  background-color: #0e4bdb;
}
</style>