<!-- src/views/admin/RoleManage.vue -->
<!-- 角色权限管理：后端暂未提供接口，仅展示空表格 -->
<template>
  <el-card shadow="never">
    <el-empty description="后端暂未提供角色权限管理接口" />
    <!-- 空角色表格 -->
    <el-table :data="roleList" border stripe style="width: 100%; margin-top: 8px">
      <el-table-column prop="name" label="角色名称" width="130" />
      <el-table-column prop="desc" label="描述" min-width="140" />
      <el-table-column prop="userCount" label="人数" width="80" align="center" />
    </el-table>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'

// 后端暂未提供角色权限管理接口，保留空表格
const roleList = ref([])
</script>
