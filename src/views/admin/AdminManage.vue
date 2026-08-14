<!-- src/views/admin/AdminManage.vue -->
<!-- 管理员账号管理：后端暂未提供接口，仅展示空表格 -->
<template>
  <el-card shadow="never">
    <el-empty description="后端暂未提供管理员账号管理接口" />
    <!-- 空表格 -->
    <el-table :data="tableData" border stripe style="width: 100%; margin-top: 8px">
      <el-table-column prop="account" label="账号" width="140" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="roleName" label="角色" width="140" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === '正常' ? 'success' : 'danger'">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'

// 后端暂未提供管理员账号管理接口，保留空表格
const tableData = ref([])
</script>
