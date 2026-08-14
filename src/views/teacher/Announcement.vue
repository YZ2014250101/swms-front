<!-- src/views/teacher/Announcement.vue -->
<!-- 公告发布，支持发布、编辑、删除（教师端无置顶接口，故移除置顶操作） -->
<template>
  <el-card shadow="never">
    <div class="toolbar">
      <el-button type="primary" :icon="Plus" @click="handlePublish">发布公告</el-button>
    </div>

    <el-table :data="tableData" border stripe style="width: 100%; margin-top: 16px" v-loading="loading">
      <el-table-column prop="title" label="标题" min-width="200" />
      <el-table-column label="接收课程" width="200">
        <template #default="{ row }">{{ row.courseName || row.scope || '-' }}</template>
      </el-table-column>
      <el-table-column label="发布时间" width="170">
        <template #default="{ row }">{{ row.publishTime || row.createTime || '' }}</template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.status)">{{ row.status || '已发布' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 发布/编辑公告弹窗 -->
    <el-dialog v-model="dialogVisible" :title="editMode ? '编辑公告' : '发布公告'" width="560px">
      <el-form :model="form" label-width="90px">
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入公告标题" />
        </el-form-item>
        <el-form-item label="接收课程">
          <el-select v-model="form.courseId" placeholder="请选择接收课程" style="width: 100%" clearable>
            <el-option v-for="item in courseOptions" :key="item.id" :label="item.courseName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="form.content" type="textarea" :rows="5" placeholder="请输入公告内容" />
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
import { Plus } from '@element-plus/icons-vue'
import { getTeacherCourses } from '@/api/modules/teacher/course'
import {
  getMyAnnouncementList,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementDetail
} from '@/api/modules/teacher/announcement'
import { onMounted } from 'vue'

const loading = ref(false)
const tableData = ref([])

// 课程下拉（用于发布公告选择接收课程）
const courseOptions = ref([])

// 状态 tag 类型
const statusTagType = (status) => {
  if (status === '已发布') return 'success'
  if (status === '草稿') return 'info'
  return 'warning'
}

// 弹窗
const dialogVisible = ref(false)
const editMode = ref(false)
const form = reactive({
  id: null,
  title: '',
  courseId: '',
  content: ''
})

// 拉取课程下拉
const fetchCourses = async () => {
  try {
    const res = await getTeacherCourses()
    courseOptions.value = res.data?.courseList || []
  } catch (e) {
    // 拦截器已提示
  }
}

// 拉取公告列表
const fetchList = async () => {
  loading.value = true
  try {
    const res = await getMyAnnouncementList()
    tableData.value = res.data?.announcementList || []
  } catch (e) {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}

// 发布
const handlePublish = () => {
  editMode.value = false
  form.id = null
  form.title = ''
  form.courseId = ''
  form.content = ''
  dialogVisible.value = true
}

// 编辑（拉取详情回显内容）
const handleEdit = async (row) => {
  editMode.value = true
  form.id = row.id
  form.title = row.title || ''
  form.courseId = row.courseId || ''
  form.content = row.content || ''
  dialogVisible.value = true
  try {
    const res = await getAnnouncementDetail(row.id)
    const detail = res.data?.announcement || {}
    form.title = detail.title || form.title
    form.courseId = detail.courseId || form.courseId
    form.content = detail.content || form.content
  } catch (e) {
    // 拦截器已提示
  }
}

// 确认（发布/编辑）
const handleConfirm = async () => {
  if (!form.title) {
    ElMessage.warning('请输入公告标题')
    return
  }
  try {
    if (editMode.value) {
      await updateAnnouncement({
        id: form.id,
        title: form.title,
        content: form.content,
        courseId: form.courseId
      })
      ElMessage.success('公告编辑成功')
    } else {
      await addAnnouncement({
        title: form.title,
        content: form.content,
        courseId: form.courseId
      })
      ElMessage.success('公告发布成功')
    }
    dialogVisible.value = false
    fetchList()
  } catch (e) {
    // 拦截器已提示
  }
}

// 删除（二次确认）
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认要删除公告【${row.title}】吗？`, '删除确认', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await deleteAnnouncement(row.id)
        ElMessage.success('删除成功')
        fetchList()
      } catch (e) {
        // 拦截器已提示
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

onMounted(() => {
  fetchCourses()
  fetchList()
})
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: flex-end;
}
</style>
