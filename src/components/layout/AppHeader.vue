<!-- src/components/layout/AppHeader.vue -->
<!-- 顶部导航：折叠按钮 + 用户下拉菜单 -->
<template>
  <div class="header">
    <div class="header-left">
      <el-icon class="collapse-btn" :size="20" @click="toggleSidebar">
        <Fold v-if="!collapsed" />
        <Expand v-else />
      </el-icon>
      <span class="page-title">{{ currentTitle }}</span>
    </div>
    <div class="header-right">
      <el-dropdown @command="handleCommand">
        <span class="user-info">
          <el-avatar :size="32" :icon="UserFilled" />
          <span class="username">{{ userStore.userInfo?.name || '用户' }}</span>
          <el-tag size="small" type="info" effect="plain">{{ userStore.roleLabel }}</el-tag>
          <el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="password">
              <el-icon><Lock /></el-icon>修改密码
            </el-dropdown-item>
            <el-dropdown-item command="notice">
              <el-icon><Bell /></el-icon>消息通知
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { UserFilled } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'
import { logout } from '@/api/modules/common/auth'

const props = defineProps({
  collapsed: { type: Boolean, default: false }
})

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()

const collapsed = computed(() => props.collapsed)

function toggleSidebar() {
  appStore.toggleSidebar()
}

// 当前页面标题
const currentTitle = computed(() => route.meta.title || '教务管理系统')

// 下拉菜单命令处理
function handleCommand(command) {
  const base = `/${userStore.role}`
  if (command === 'profile') {
    router.push(`${base}/profile`)
  } else if (command === 'password') {
    router.push(`${base}/password`)
  } else if (command === 'notice') {
    router.push(`${base}/notice`)
  } else if (command === 'logout') {
    handleLogout()
  }
}

function handleLogout() {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 通知后端退出（失败不阻塞，前端仍清除登录态）
      try {
        await logout(userStore.role)
      } catch (e) {
        console.warn('后端退出接口异常，仍清除前端登录态', e)
      }
      userStore.logoutAction()
      ElMessage.success('已退出登录')
      router.push('/login')
    })
    .catch(() => {})
}
</script>

<style scoped>
.header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #e5e4e7;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.collapse-btn {
  cursor: pointer;
  color: #545c64;
}
.collapse-btn:hover {
  color: #409eff;
}
.page-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  outline: none;
}
.username {
  font-size: 14px;
  color: #303133;
}
</style>
