<!-- src/views/admin/CourseManage.vue -->
<!-- 课程资源管理，支持增删改查、选课开关、下架 -->
<template>
  <el-card shadow="never">
    <!-- 搜索栏 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="课程名">
        <el-input v-model="searchForm.name" placeholder="请输入课程名" clearable />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="searchForm.category" placeholder="请选择分类" clearable>
          <el-option v-for="item in categoryOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作栏 -->
    <div class="toolbar">
      <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
    </div>

    <!-- 列表 -->
    <el-table :data="tableData" border stripe style="width: 100%; margin-top: 16px">
      <el-table-column prop="courseNo" label="课程编号" width="120" />
      <el-table-column prop="name" label="课程名称" min-width="160" />
      <el-table-column prop="category" label="分类" width="110" />
      <el-table-column prop="credit" label="学分" width="80" align="center" />
      <el-table-column prop="hours" label="学时" width="80" align="center" />
      <el-table-column prop="teacher" label="授课教师" width="110" />
      <el-table-column prop="classroom" label="上课教室" width="120" />
      <el-table-column label="选课状态" width="110" align="center">
        <template #default="{ row }">
          <el-switch
            v-model="row.openSelect"
            :active-text="row.openSelect ? '开启' : ''"
            @change="handleToggleSelect(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="warning" link size="small" @click="handleOffShelf(row)">{{ row.shelf ? '下架' : '上架' }}</el-button>
          <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
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

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="editMode ? '编辑课程' : '新增课程'" width="560px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="课程编号" prop="courseNo">
          <el-input v-model="form.courseNo" placeholder="请输入课程编号" :disabled="editMode" />
        </el-form-item>
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类" style="width: 100%">
            <el-option v-for="item in categoryOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="学分" prop="credit">
          <el-input-number v-model="form.credit" :min="0.5" :max="10" :step="0.5" controls-position="right" />
        </el-form-item>
        <el-form-item label="学时" prop="hours">
          <el-input-number v-model="form.hours" :min="8" :max="120" controls-position="right" />
        </el-form-item>
        <el-form-item label="授课教师" prop="teacher">
          <el-input v-model="form.teacher" placeholder="请输入授课教师" />
        </el-form-item>
        <el-form-item label="上课教室" prop="classroom">
          <el-input v-model="form.classroom" placeholder="请输入上课教室" />
        </el-form-item>
        <el-form-item label="上课周期" prop="schedule">
          <el-input v-model="form.schedule" placeholder="如：周一 1-2节" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'

// 课程分类
const categoryOptions = ref(['必修课', '专业选修课', '公共选修课', '实验课'])

// mock 课程列表
// TODO: 对接后端 课程列表接口
const tableData = ref([
  { id: 1, courseNo: 'CS101', name: '数据结构', category: '必修课', credit: 4, hours: 64, teacher: '刘老师', classroom: 'A101', schedule: '周一 1-2节', openSelect: true, shelf: true },
  { id: 2, courseNo: 'CS102', name: '计算机网络', category: '必修课', credit: 3, hours: 48, teacher: '陈老师', classroom: 'A102', schedule: '周二 3-4节', openSelect: false, shelf: true },
  { id: 3, courseNo: 'CS201', name: '软件工程', category: '专业选修课', credit: 3, hours: 48, teacher: '杨老师', classroom: 'B201', schedule: '周三 5-6节', openSelect: true, shelf: true },
  { id: 4, courseNo: 'CS301', name: '人工智能导论', category: '公共选修课', credit: 2, hours: 32, teacher: '赵老师', classroom: 'C301', schedule: '周四 7-8节', openSelect: false, shelf: false }
])

// 搜索
const searchForm = reactive({ name: '', category: '' })
const handleSearch = () => {
  // TODO: 对接后端 课程列表查询接口
  ElMessage.success('查询成功')
}
const handleReset = () => {
  searchForm.name = ''
  searchForm.category = ''
}

// 分页
const page = reactive({ current: 1, size: 10, total: 4 })

// 弹窗
const dialogVisible = ref(false)
const editMode = ref(false)
const formRef = ref(null)
const form = reactive({
  id: null,
  courseNo: '',
  name: '',
  category: '',
  credit: 2,
  hours: 32,
  teacher: '',
  classroom: '',
  schedule: ''
})
const rules = {
  courseNo: [{ required: true, message: '请输入课程编号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  teacher: [{ required: true, message: '请输入授课教师', trigger: 'blur' }]
}

const handleAdd = () => {
  editMode.value = false
  form.id = null
  form.courseNo = ''
  form.name = ''
  form.category = ''
  form.credit = 2
  form.hours = 32
  form.teacher = ''
  form.classroom = ''
  form.schedule = ''
  dialogVisible.value = true
}

const handleEdit = (row) => {
  editMode.value = true
  form.id = row.id
  form.courseNo = row.courseNo
  form.name = row.name
  form.category = row.category
  form.credit = row.credit
  form.hours = row.hours
  form.teacher = row.teacher
  form.classroom = row.classroom
  form.schedule = row.schedule
  dialogVisible.value = true
}

const handleConfirm = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    // TODO: 对接后端 课程新增/编辑接口
    if (editMode.value) {
      const row = tableData.value.find((item) => item.id === form.id)
      if (row) Object.assign(row, form)
      ElMessage.success('编辑成功')
    } else {
      tableData.value.unshift({
        id: Date.now(),
        courseNo: form.courseNo,
        name: form.name,
        category: form.category,
        credit: form.credit,
        hours: form.hours,
        teacher: form.teacher,
        classroom: form.classroom,
        schedule: form.schedule,
        openSelect: false,
        shelf: true
      })
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
  })
}

// 选课开关
const handleToggleSelect = (row) => {
  // TODO: 对接后端 课程选课开关接口
  ElMessage.success(row.openSelect ? '已开启选课' : '已关闭选课')
}

// 下架/上架
const handleOffShelf = (row) => {
  ElMessageBox.confirm(`确认要${row.shelf ? '下架' : '上架'}课程【${row.name}】吗？`, '操作确认', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // TODO: 对接后端 课程上下架接口
      row.shelf = !row.shelf
      ElMessage.success(row.shelf ? '已上架' : '已下架')
    })
    .catch(() => {})
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认要删除课程【${row.name}】吗？`, '删除确认', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // TODO: 对接后端 课程删除接口
      const idx = tableData.value.findIndex((item) => item.id === row.id)
      if (idx !== -1) tableData.value.splice(idx, 1)
      ElMessage.success('删除成功')
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
