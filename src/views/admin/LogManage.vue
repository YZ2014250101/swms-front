<!-- src/views/admin/LogManage.vue -->
<!-- 日志管理：列表查询、清空日志 -->
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
      <el-button type="danger" :icon="Delete" @click="handleClean">清空日志</el-button>
    </div>

    <!-- 列表 -->
    <el-table :data="pagedData" border stripe v-loading="loading" style="width: 100%; margin-top: 16px">
      <el-table-column prop="logNo" label="日志编号" width="150" />
      <el-table-column prop="operator" label="操作人" width="110" />
      <el-table-column prop="role" label="角色" width="110" />
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
      :total="filteredData.length"
      layout="total, sizes, prev, pager, next, jumper"
      background
    />
  </el-card>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Delete } from '@element-plus/icons-vue'
import { getLogList, cleanLog } from '@/api/modules/admin/log'

const loading = ref(false)
const tableData = ref([])

// 操作类型选项
const typeOptions = ref(['登录', '新增', '编辑', '删除', '导出', '权限配置'])

// 搜索
const searchForm = reactive({ operator: '', type: '', dateRange: [] })

const filteredData = computed(() => {
  return tableData.value.filter((row) => {
    if (searchForm.operator && !(row.operator || '').includes(searchForm.operator)) return false
    if (searchForm.type && row.type !== searchForm.type) return false
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      const [start, end] = searchForm.dateRange
      const t = row.operateTime || ''
      if (t < start || t > end + ' 23:59:59') return false
    }
    return true
  })
})

const pagedData = computed(() => {
  const start = (page.current - 1) * page.size
  return filteredData.value.slice(start, start + page.size)
})

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getLogList()
    tableData.value = res.data.logList || []
  } catch (e) {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchList()
})

const handleSearch = () => {
  page.current = 1
}
const handleReset = () => {
  searchForm.operator = ''
  searchForm.type = ''
  searchForm.dateRange = []
  page.current = 1
}

// 分页
const page = reactive({ current: 1, size: 10 })

// 清空日志
const handleClean = () => {
  ElMessageBox.confirm('确认要清空所有系统日志吗？此操作不可恢复！', '清空日志', {
    confirmButtonText: '确认清空',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await cleanLog()
        ElMessage.success('清空成功')
        fetchList()
      } catch (e) {
        // 拦截器已提示
      }
    })
    .catch(() => {})
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
