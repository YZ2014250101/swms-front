<!-- src/components/business/SearchBar.vue -->
<!-- 通用搜索栏：支持关键词输入 + 查询/重置按钮，插槽支持扩展筛选项 -->
<template>
  <div class="search-bar">
    <el-form :inline="true" :model="modelValue" class="search-form">
      <slot />
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        <slot name="extra" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { Search, Refresh } from '@element-plus/icons-vue'

defineProps({
  modelValue: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['search', 'reset'])

function handleSearch() {
  emit('search')
}
function handleReset() {
  emit('reset')
}
</script>

<style scoped>
.search-bar {
  background: #fff;
  padding: 16px 16px 0;
  border-radius: 4px;
  margin-bottom: 16px;
}
</style>
