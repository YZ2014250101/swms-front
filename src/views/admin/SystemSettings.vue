<!-- src/views/admin/SystemSettings.vue -->
<!-- 系统设置，配置网站名称、登录背景、版权、上传限制、通知规则 -->
<template>
  <el-card shadow="never">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="140px" style="max-width: 640px">
      <el-form-item label="网站名称" prop="siteName">
        <el-input v-model="form.siteName" placeholder="请输入网站名称" />
      </el-form-item>

      <el-form-item label="登录背景" prop="loginBg">
        <el-upload
          class="bg-uploader"
          action="#"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleBgChange"
        >
          <img v-if="form.loginBg" :src="form.loginBg" class="bg-preview" />
          <div v-else class="bg-placeholder">
            <el-icon><Plus /></el-icon>
            <span>点击上传登录背景</span>
          </div>
        </el-upload>
      </el-form-item>

      <el-form-item label="版权信息" prop="copyright">
        <el-input v-model="form.copyright" placeholder="请输入版权信息" />
      </el-form-item>

      <el-form-item label="文件上传大小限制" prop="uploadLimit">
        <el-input-number v-model="form.uploadLimit" :min="1" :max="100" controls-position="right" />
        <span style="margin-left: 8px; color: #909399">MB</span>
      </el-form-item>

      <el-form-item label="允许上传格式" prop="allowFormats">
        <el-checkbox-group v-model="form.allowFormats">
          <el-checkbox v-for="item in formatOptions" :key="item" :value="item" :label="item" />
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="消息通知规则" prop="notify">
        <el-switch v-model="form.notify" active-text="开启" inactive-text="关闭" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Setting" @click="handleSave">保存设置</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Setting } from '@element-plus/icons-vue'

// 允许上传格式选项
const formatOptions = ref(['jpg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip'])

// 表单
const formRef = ref(null)
const form = reactive({
  siteName: '教务管理系统',
  loginBg: '',
  copyright: '© 2025 教务管理系统 版权所有',
  uploadLimit: 10,
  allowFormats: ['jpg', 'png', 'pdf'],
  notify: true
})
const rules = {
  siteName: [{ required: true, message: '请输入网站名称', trigger: 'blur' }],
  copyright: [{ required: true, message: '请输入版权信息', trigger: 'blur' }],
  uploadLimit: [{ required: true, message: '请设置上传大小限制', trigger: 'change' }]
}

// 登录背景上传
const handleBgChange = (file) => {
  // TODO: 对接后端 登录背景上传接口
  form.loginBg = URL.createObjectURL(file.raw)
}

// 保存
const handleSave = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    // TODO: 对接后端 系统设置保存接口
    ElMessage.success('保存成功')
  })
}

// 重置
const handleReset = () => {
  formRef.value.resetFields()
}
</script>

<style scoped>
.bg-uploader :deep(.el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  width: 320px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.bg-uploader :deep(.el-upload):hover {
  border-color: #409eff;
}
.bg-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.bg-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #909399;
  font-size: 13px;
}
</style>
