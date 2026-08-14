// src/store/modules/app.js
// 应用 UI 状态：侧边栏折叠等全局界面状态
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 侧边栏是否折叠
  const sidebarCollapsed = ref(false)

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setSidebar(value) {
    sidebarCollapsed.value = value
  }

  return {
    sidebarCollapsed,
    toggleSidebar,
    setSidebar
  }
})
