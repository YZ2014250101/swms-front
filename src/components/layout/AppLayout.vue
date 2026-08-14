<!-- src/components/layout/AppLayout.vue -->
<!-- 主布局：左侧菜单 + 顶部导航 + 内容区 -->
<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="sidebarWidth" class="layout-aside">
      <AppSidebar :collapsed="appStore.sidebarCollapsed" />
    </el-aside>

    <el-container>
      <!-- 顶部导航 -->
      <el-header class="layout-header">
        <AppHeader :collapsed="appStore.sidebarCollapsed" />
      </el-header>
      <!-- 内容区 -->
      <el-main class="layout-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()

// 侧边栏宽度：折叠时 64px，展开 220px
const sidebarWidth = computed(() => (appStore.sidebarCollapsed ? '64px' : '220px'))
</script>

<style scoped>
.layout-container {
  height: 100%;
}
.layout-aside {
  transition: width 0.3s;
  overflow: hidden;
}
.layout-header {
  padding: 0;
  height: 60px;
}
.layout-main {
  background: #f0f2f5;
  padding: 16px;
  overflow-y: auto;
}
/* 路由切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
