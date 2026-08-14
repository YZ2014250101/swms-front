<!-- src/components/layout/AppSidebar.vue -->
<!-- 侧边菜单栏：根据当前角色动态渲染菜单 -->
<template>
  <div class="sidebar">
    <!-- 系统 Logo 区 -->
    <div class="logo">
      <el-icon :size="24"><School /></el-icon>
      <span v-show="!collapsed" class="logo-text">教务管理系统</span>
    </div>
    <!-- 菜单：router 模式，index 作为跳转路径 -->
    <el-menu
      :default-active="activeMenu"
      :collapse="collapsed"
      :collapse-transition="false"
      router
      background-color="#001529"
      text-color="#b7bdc7"
      active-text-color="#fff"
      class="sidebar-menu"
    >
      <template v-for="item in menus" :key="item.title">
        <el-sub-menu :index="item.title">
          <template #title>
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item
            v-for="child in item.children"
            :key="child.path"
            :index="resolvePath(child.path)"
          >
            {{ child.title }}
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { getMenuByRole, commonMenu } from '@/constants/menu'

const props = defineProps({
  collapsed: { type: Boolean, default: false }
})

const route = useRoute()
const userStore = useUserStore()

// 当前角色基础路径，如 /student
const basePath = computed(() => `/${userStore.role}`)

// 拼接角色菜单 + 公共菜单
const menus = computed(() => {
  const roleMenu = getMenuByRole(userStore.role)
  return [...roleMenu, ...commonMenu]
})

// 公共菜单的 path 是相对路径（如 profile），需要补全为绝对路径
function resolvePath(path) {
  if (path.startsWith('/')) return path
  return `${basePath.value}/${path}`
}

// 当前激活菜单
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #001529;
}
.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #fff;
  background: #002140;
  flex-shrink: 0;
}
.logo-text {
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}
.sidebar-menu {
  border-right: none;
  flex: 1;
  overflow-x: hidden;
}
/* 菜单不折叠时宽度 */
.sidebar-menu:not(.el-menu--collapse) {
  width: 220px;
}
</style>
