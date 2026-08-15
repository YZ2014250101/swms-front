<!-- src/views/teacher/MyInfo.vue -->
<!-- 学生个人信息：对接后端 GET /teacher/myInfo，返回 Result<teacher> -->
<template>
  <div class="my-info-page">
    <el-card shadow="never" v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>👤 个人信息</span>
          <el-button type="primary" text :icon="Edit" @click="handleEdit">编辑</el-button>
        </div>
      </template>

      <!-- 错误提示 -->
      <el-alert
        v-if="errorMsg"
        :title="errorMsg"
        type="error"
        show-icon
        :closable="false"
        style="margin-bottom: 16px"
      />

      <!-- 信息展示 -->
      <el-descriptions v-else :column="2" border>
        <el-descriptions-item label="教师ID">{{ teacher.teacherId }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ teacher.name }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ teacher.gender }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ teacher.department }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="editVisible" title="编辑个人信息" width="480px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="教师ID">
          <el-input v-model="form.teacherId" disabled />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio value="男">男</el-radio>
            <el-radio value="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="form.department" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'
import { getTeacherInfo, updateTeacherInfo } from '@/api/modules/teacher/info'

// 教师信息
const teacher = ref({
  teacherId: '',
  name: '',
  gender: '',
  department: ''
})
const loading = ref(false)
const errorMsg = ref('')

// 编辑相关
const editVisible = ref(false)
const saving = ref(false)
const formRef = ref()
const form = reactive({
  teacherId: '',
  name: '',
  gender: '',
  department: ''
})
const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  department: [{ required: true, message: '请输入部门', trigger: 'blur' }]          
}

// 获取教师个人信息（对接后端 /teacher/myInfo）
const getTeacherInfoData = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    // request.js 已统一携带 token，返回 { code, data, message }
    const res = await getTeacherInfo()
    teacher.value = res.data.teacher || {}
    console.log('获取教师个人信息接口返回：', teacher.value)
  } catch (err) {
    console.error('请求教师个人信息接口异常：', err)
    errorMsg.value = '获取教师个人信息失败，请检查后端接口 /teacher/myInfo'
  } finally {
    loading.value = false
  }
}

// 打开编辑弹窗
function handleEdit() {
  Object.assign(form, teacher.value)
  editVisible.value = true
}

// 保存修改
async function handleSave() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    saving.value = true
    try {
      // TODO: 对接后端 PUT /teacher/myInfo（如后端暂未提供修改接口，可注释此行）
      await updateTeacherInfo(form)
      teacher.value = { ...form }
      editVisible.value = false
      ElMessage.success('保存成功')
    } catch (err) {
      console.error(err)
    } finally {
      saving.value = false
    }
  })
}

onMounted(() => {
  getTeacherInfoData()  
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
