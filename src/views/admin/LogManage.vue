<!-- src/views/admin/LogManage.vue -->
<!-- 日志管理，支持按操作人/类型/时间范围查询与导出 -->
<template>
  <el-card shadow="never">
    <!-- 搜索栏 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="操作人">
        <el-input v-model="searchForm.operator" placeholder="请输入操作人" clearable />
      </el-form-item>
      <el-form-item label="操作类型">
        <el-select v-model="searchForm.type" placeholder="请选择操作类型" clearable>
          <el-option v-for="item in typeOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围">
        <el-date-picker
          v-model="searchForm.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作栏 -->
    <div class="toolbar">
      <el-button type="success" :icon="Download" @click="handleExport">导出</el-button>
    </div>

    <!-- 列表 -->
    <el-table :data="tableData" border stripe style="width: 100%; margin-top: 16px">
      <el-table-column prop="logNo" label="日志编号" width="130" />
      <el-table-column prop="operator" label="操作人" width="110" />
      <el-table-column prop="role" label="角色" width="100" />
      <el-table-column prop="type" label="操作类型" width="110" align="center">
        <template #default="{ row }">
          <el-tag>{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="操作内容" min-width="220" />
      <el-table-column prop="ip" label="IP" width="140" />
      <el-table-column prop="operateTime" label="操作时间" width="180" />
    </el-table>

    <el-pagination
      class="pagination"
      v-model:current-page="page.current"
      v-model:page-size="page.size"
      :page-sizes="[10, 20, 50]"
      :total="page.total"
      layout="total, sizes, prev, pager, next, jumper"
      background
    />
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, Download } from '@element-plus/icons-vue'

// 操作类型选项
const typeOptions = ref(['登录', '新增', '编辑', '删除', '导出', '权限配置'])

// mock 日志列表
// TODO: 对接后端 日志列表接口
const tableData = ref([
  { id: 1, logNo: 'LOG20250810001', operator: 'admin', role: '超级管理员', type: '登录', content: '登录系统', ip: '192.168.1.10', operateTime: '2025-08-10 09:00:12' },
  { id: 2, logNo: 'LOG20250810002', operator: 'admin', role: '超级管理员', type: '新增', content: '新增学生账号 202300105', ip: '192.168.1.10', operateTime: '2025-08-10 09:15:30' },
  { id: 3, logNo: 'LOG20250810003', operator: 'sysadmin', role: '系统管理员', type: '删除', content: '删除课程 人工智能导论', ip: '192.168.1.20', operateTime: '2025-08-10 10:20:45' },
  { id: 4, logNo: 'LOG20250810004', operator: 'sysadmin', role: '系统管理员', type: '导出', content: '导出考试安排表', ip: '192.168.1.20', operateTime: '2025-08-10 11:05:18' },
  { id: 5, logNo: 'LOG20250810005', operator: 'admin', role: '超级管理员', type: '权限配置', content: '为管理员【运维管理员】配置权限', ip: '192.168.1.10', operateTime: '2025-08-10 14:30:00' }
])

// 搜索
const searchForm = reactive({ operator: '', type: '', dateRange: [] })
const handleSearch = () => {
  // TODO: 对接后端 日志列表查询接口
  ElMessage.success('查询成功')
}
const handleReset = () => {
  searchForm.operator = ''
  searchForm.type = ''
  searchForm.dateRange = []
}

// 分页
const page = reactive({ current: 1, size: 10, total: 5 })

// 导出
const handleExport = () => {
  // TODO: 对接后端 日志导出接口
  ElMessage.success('导出成功')
}
</script>

<style scoped>
.search-form {
  margin-bottom: 8px;
}
.toolbar {
  display: flex;
  justify-content: flex-end;
}
.pagination {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>
